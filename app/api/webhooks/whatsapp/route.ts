// BotChat Pro - WhatsApp Webhook Handler
// Handles incoming WhatsApp messages and webhook verification

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateWebhookSignature, normalizePhoneNumber } from "@/lib/whatsapp";
import { processIncomingMessage } from "@/lib/bot-engine";

/**
 * GET - Webhook verification for WhatsApp
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  // Verify webhook (WhatsApp requires this)
  if (mode === "subscribe" && token === process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN) {
    console.log("✅ WhatsApp webhook verified");
    return new NextResponse(challenge, { status: 200 });
  }

  console.log("❌ WhatsApp webhook verification failed");
  return new NextResponse("Verification failed", { status: 403 });
}

/**
 * POST - Handle incoming WhatsApp messages
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-hub-signature-256") || "";

    // Validate webhook signature for security
    if (!validateWebhookSignature(body, signature)) {
      console.error("❌ Invalid webhook signature");
      return new NextResponse("Invalid signature", { status: 401 });
    }

    const data = JSON.parse(body);
    
    // Process webhook data
    await handleWebhookData(data);
    
    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("❌ Webhook processing error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

/**
 * Handle the actual webhook data from WhatsApp
 */
async function handleWebhookData(data: any) {
  if (!data.entry || !Array.isArray(data.entry)) {
    console.log("⚠️  No entries in webhook data");
    return;
  }

  for (const entry of data.entry) {
    if (!entry.changes || !Array.isArray(entry.changes)) {
      continue;
    }

    for (const change of entry.changes) {
      if (change.field !== "messages") {
        continue;
      }

      const { value } = change;
      
      // Handle incoming messages
      if (value.messages && Array.isArray(value.messages)) {
        for (const message of value.messages) {
          await handleIncomingMessage(message, value.metadata);
        }
      }

      // Handle message status updates
      if (value.statuses && Array.isArray(value.statuses)) {
        for (const status of value.statuses) {
          await handleMessageStatus(status);
        }
      }
    }
  }
}

/**
 * Handle incoming WhatsApp message
 */
async function handleIncomingMessage(message: any, metadata: any) {
  try {
    const phoneNumberId = metadata.phone_number_id;
    const fromPhone = normalizePhoneNumber(message.from);
    
    console.log(`📨 Incoming message from ${fromPhone}:`, message.type);

    // Find the bot for this phone number
    const bot = await prisma.bot.findFirst({
      where: {
        whatsappPhoneId: phoneNumberId,
        isActive: true,
      },
      include: {
        flows: {
          where: { isActive: true },
          orderBy: { position: 'asc' },
        },
      },
    });

    if (!bot) {
      console.log(`⚠️  No active bot found for phone number ${phoneNumberId}`);
      return;
    }

    // Store the incoming message
    const messageRecord = await prisma.message.create({
      data: {
        direction: "incoming",
        content: getMessageContent(message),
        mediaUrl: await getMediaUrl(message),
        mediaType: message.type !== "text" ? message.type : null,
        contactPhone: fromPhone,
        contactName: message.profile?.name || null,
        whatsappMessageId: message.id,
        botId: bot.id,
      },
    });

    // Process the message through the bot engine
    await processIncomingMessage(bot, message, messageRecord);
    
    console.log(`✅ Message processed for bot ${bot.name}`);
  } catch (error) {
    console.error("❌ Error handling incoming message:", error);
  }
}

/**
 * Handle WhatsApp message status updates
 */
async function handleMessageStatus(status: any) {
  try {
    const messageId = status.id;
    const newStatus = status.status; // sent, delivered, read, failed

    // Update message status in database
    await prisma.message.updateMany({
      where: { whatsappMessageId: messageId },
      data: { whatsappStatus: newStatus },
    });

    console.log(`📊 Message ${messageId} status updated to: ${newStatus}`);
  } catch (error) {
    console.error("❌ Error updating message status:", error);
  }
}

/**
 * Extract text content from various message types
 */
function getMessageContent(message: any): string {
  switch (message.type) {
    case "text":
      return message.text?.body || "";
    case "image":
      return message.image?.caption || "[Bild]";
    case "document":
      return message.document?.caption || `[Dokument: ${message.document?.filename}]`;
    case "audio":
      return "[Sprachnachricht]";
    case "video":
      return message.video?.caption || "[Video]";
    case "location":
      return `[Standort: ${message.location?.latitude}, ${message.location?.longitude}]`;
    case "contacts":
      return "[Kontakt geteilt]";
    case "interactive":
      if (message.interactive?.type === "button_reply") {
        return message.interactive.button_reply.title;
      }
      if (message.interactive?.type === "list_reply") {
        return message.interactive.list_reply.title;
      }
      return "[Interaktive Nachricht]";
    default:
      return `[${message.type}]`;
  }
}

/**
 * Get media URL if message contains media
 */
async function getMediaUrl(message: any): Promise<string | null> {
  try {
    if (message.type === "image" && message.image?.id) {
      return `/api/media/whatsapp/${message.image.id}`;
    }
    if (message.type === "document" && message.document?.id) {
      return `/api/media/whatsapp/${message.document.id}`;
    }
    if (message.type === "audio" && message.audio?.id) {
      return `/api/media/whatsapp/${message.audio.id}`;
    }
    if (message.type === "video" && message.video?.id) {
      return `/api/media/whatsapp/${message.video.id}`;
    }
    return null;
  } catch (error) {
    console.error("❌ Error getting media URL:", error);
    return null;
  }
}
