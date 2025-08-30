// BotChat Pro - Bots API Routes
// CRUD operations for bot management

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validation schemas
const CreateBotSchema = z.object({
  name: z.string().min(1, "Bot name is required").max(100),
  description: z.string().optional(),
  welcomeMessage: z.string().optional(),
  fallbackMessage: z.string().optional(),
});

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
});

/**
 * GET /api/bots - Get all bots for authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get user's bots
    const bots = await prisma.bot.findMany({
      where: { 
        userId: user.id,
        deletedAt: null,
      },
      include: {
        flows: {
          where: { deletedAt: null },
          orderBy: { position: 'asc' },
        },
        _count: {
          select: {
            messages: {
              where: {
                createdAt: {
                  gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate stats for each bot
    const botsWithStats = await Promise.all(
      bots.map(async (bot) => {
        const [messagesCount, contactsCount, conversionsCount] = await Promise.all([
          prisma.message.count({
            where: {
              botId: bot.id,
              createdAt: {
                gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
              },
            },
          }),
          prisma.message.groupBy({
            by: ['contactPhone'],
            where: {
              botId: bot.id,
              contactPhone: { not: null },
              createdAt: {
                gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
              },
            },
          }).then(results => results.length),
          // Conversions could be calculated based on specific flow completions
          // For now, we'll use a placeholder
          0,
        ]);

        return {
          ...bot,
          stats: {
            messages: messagesCount,
            contacts: contactsCount,
            conversions: conversionsCount,
          },
        };
      })
    );

    return NextResponse.json({ bots: botsWithStats });
  } catch (error) {
    console.error("Error fetching bots:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST /api/bots - Create a new bot
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = CreateBotSchema.parse(body);

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check subscription limits
    const botCount = await prisma.bot.count({
      where: { 
        userId: user.id,
        deletedAt: null,
      },
    });

    const maxBots = user.subscriptionTier === "free" ? 1 : 
                   user.subscriptionTier === "starter" ? 5 : 
                   user.subscriptionTier === "pro" ? 20 : 100;

    if (botCount >= maxBots) {
      return NextResponse.json({ 
        error: `Bot limit reached. Your ${user.subscriptionTier} plan allows up to ${maxBots} bots.` 
      }, { status: 403 });
    }

    // Create bot
    const bot = await prisma.bot.create({
      data: {
        ...validatedData,
        userId: user.id,
        fallbackMessage: validatedData.fallbackMessage || 
          "Entschuldigung, ich habe das nicht verstanden. Können Sie das anders formulieren?",
      },
      include: {
        flows: true,
      },
    });

    return NextResponse.json({ bot }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: "Validation error", 
        details: error.issues 
      }, { status: 400 });
    }
    
    console.error("Error creating bot:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
