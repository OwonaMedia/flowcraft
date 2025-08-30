// BotChat Pro - Individual Bot API Routes
// CRUD operations for specific bots

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validation schemas
const UpdateBotSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  welcomeMessage: z.string().optional(),
  fallbackMessage: z.string().optional(),
  flows: z.object({
    nodes: z.array(z.any()),
    edges: z.array(z.any()),
  }).optional(),
  whatsappPhoneId: z.string().optional(),
  whatsappToken: z.string().optional(),
});

/**
 * GET /api/bots/[id] - Get specific bot
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const resolvedParams = await params;
    const bot = await prisma.bot.findFirst({
      where: {
        id: resolvedParams.id,
        userId: user.id,
        deletedAt: null,
      },
      include: {
        flows: {
          where: { deletedAt: null },
          orderBy: { position: 'asc' },
        },
      },
    });

    if (!bot) {
      return NextResponse.json({ error: "Bot not found" }, { status: 404 });
    }

    return NextResponse.json({ bot });
  } catch (error) {
    console.error("Error fetching bot:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * PUT /api/bots/[id] - Update specific bot
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = UpdateBotSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const resolvedParams = await params;
    // Check if bot exists and belongs to user
    const existingBot = await prisma.bot.findFirst({
      where: {
        id: resolvedParams.id,
        userId: user.id,
        deletedAt: null,
      },
    });

    if (!existingBot) {
      return NextResponse.json({ error: "Bot not found" }, { status: 404 });
    }

    // Extract flows data if provided
    const { flows, ...botData } = validatedData;

    // Update bot
    const updatedBot = await prisma.bot.update({
      where: { id: resolvedParams.id },
      data: {
        ...botData,
        updatedAt: new Date(),
      },
      include: {
        flows: {
          where: { deletedAt: null },
          orderBy: { position: 'asc' },
        },
      },
    });

    // Update flows if provided
    if (flows) {
      // Delete existing flows
      await prisma.botFlow.updateMany({
        where: { botId: resolvedParams.id },
        data: { deletedAt: new Date() },
      });

      // Create new flow with the updated data
      await prisma.botFlow.create({
        data: {
          name: "Main Flow",
          description: "Auto-generated flow from editor",
          nodes: flows,
          edges: [], // Edges are stored within nodes for React Flow
          triggerType: "always",
          botId: resolvedParams.id,
        },
      });
    }

    return NextResponse.json({ bot: updatedBot });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: "Validation error", 
        details: error.issues 
      }, { status: 400 });
    }
    
    console.error("Error updating bot:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * DELETE /api/bots/[id] - Delete specific bot (soft delete)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const resolvedParams = await params;
    // Check if bot exists and belongs to user
    const existingBot = await prisma.bot.findFirst({
      where: {
        id: resolvedParams.id,
        userId: user.id,
        deletedAt: null,
      },
    });

    if (!existingBot) {
      return NextResponse.json({ error: "Bot not found" }, { status: 404 });
    }

    // Soft delete bot and related data
    const deletedAt = new Date();
    
    await prisma.$transaction([
      // Soft delete bot
      prisma.bot.update({
        where: { id: resolvedParams.id },
        data: { deletedAt },
      }),
      // Soft delete flows
      prisma.botFlow.updateMany({
        where: { botId: resolvedParams.id },
        data: { deletedAt },
      }),
      // Soft delete messages (optional - for immediate cleanup)
      prisma.message.updateMany({
        where: { botId: resolvedParams.id },
        data: { deletedAt },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting bot:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
