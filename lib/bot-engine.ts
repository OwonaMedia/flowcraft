// BotChat Pro - Bot Execution Engine
// Processes incoming messages and executes bot flows

import { prisma } from "@/lib/prisma";
import { whatsapp } from "@/lib/whatsapp";
import type { Bot, BotFlow, Message } from "@prisma/client";

interface BotWithFlows extends Bot {
  flows: BotFlow[];
}

interface FlowNode {
  id: string;
  type: string;
  data: any;
  position: { x: number; y: number };
}

interface FlowEdge {
  id: string;
  source: string;
  target: string;
  data?: any;
}

interface BotContext {
  bot: BotWithFlows;
  contactPhone: string;
  lastMessage: Message;
  currentFlow?: BotFlow;
  currentNode?: string;
  variables: Record<string, any>;
}

/**
 * Main function to process incoming messages
 */
export async function processIncomingMessage(
  bot: BotWithFlows,
  incomingMessage: any,
  messageRecord: Message
): Promise<void> {
  try {
    const context: BotContext = {
      bot,
      contactPhone: messageRecord.contactPhone || "",
      lastMessage: messageRecord,
      variables: {},
    };

    // Get or create conversation state
    const conversationState = await getConversationState(context);
    context.currentFlow = conversationState.currentFlow || undefined;
    context.currentNode = conversationState.currentNode || undefined;
    context.variables = conversationState.variables;

    // Find matching flow if no current flow
    if (!context.currentFlow) {
      context.currentFlow = (await findMatchingFlow(context, messageRecord.content)) || undefined;
    }

    // If still no flow, use fallback
    if (!context.currentFlow) {
      await sendFallbackMessage(context);
      return;
    }

    // Execute the current flow
    await executeFlow(context);

  } catch (error) {
    console.error("❌ Error processing message:", error);
    await sendErrorMessage(bot, messageRecord.contactPhone!);
  }
}

/**
 * Get or create conversation state for a contact
 */
async function getConversationState(context: BotContext) {
  // For now, we'll use a simple approach
  // In production, you might want to store this in Redis or a dedicated table
  
  // Check if there's a recent conversation
  const recentMessage = await prisma.message.findFirst({
    where: {
      botId: context.bot.id,
      contactPhone: context.contactPhone,
      direction: "outgoing",
      createdAt: {
        gte: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  if (recentMessage) {
    // Try to find current flow from the context
    // This is simplified - in production you'd store flow state
    return {
      currentFlow: null,
      currentNode: null,
      variables: {},
    };
  }

  return {
    currentFlow: null,
    currentNode: null,
    variables: {},
  };
}

/**
 * Find a flow that matches the incoming message
 */
async function findMatchingFlow(context: BotContext, messageContent: string): Promise<BotFlow | null> {
  const { flows } = context.bot;
  
  // Check for keyword triggers
  for (const flow of flows) {
    if (flow.triggerType === "keyword" && flow.triggerValue) {
      const keywords = flow.triggerValue.toLowerCase().split(",").map(k => k.trim());
      const messageWords = messageContent.toLowerCase().split(/\s+/);
      
      for (const keyword of keywords) {
        if (messageWords.includes(keyword)) {
          return flow;
        }
      }
    }
  }

  // Check for "always" triggers (greeting flow)
  const alwaysFlow = flows.find(flow => flow.triggerType === "always");
  if (alwaysFlow) {
    return alwaysFlow;
  }

  return null;
}

/**
 * Execute a bot flow
 */
async function executeFlow(context: BotContext): Promise<void> {
  if (!context.currentFlow) return;

  try {
    const flowData = context.currentFlow.nodes as unknown as { nodes: FlowNode[]; edges: FlowEdge[] };
    const { nodes, edges } = flowData;

    // Find start node if no current node
    let currentNode = context.currentNode 
      ? nodes.find(n => n.id === context.currentNode)
      : nodes.find(n => n.type === "start");

    if (!currentNode) {
      console.error("❌ No start node found in flow");
      return;
    }

    // Execute nodes in sequence
    let maxSteps = 10; // Prevent infinite loops
    while (currentNode && maxSteps > 0) {
      maxSteps--;

      const result = await executeNode(context, currentNode);
      
      if (result.stop) {
        break;
      }

      // Find next node
      const nextEdge = edges.find(e => e.source === currentNode!.id);
      if (!nextEdge) {
        break;
      }

      currentNode = nodes.find(n => n.id === nextEdge.target);
    }

  } catch (error) {
    console.error("❌ Error executing flow:", error);
    throw error;
  }
}

/**
 * Execute a single flow node
 */
async function executeNode(context: BotContext, node: FlowNode): Promise<{ stop?: boolean }> {
  switch (node.type) {
    case "start":
      // Start node - just continue to next
      return {};

    case "message":
      await sendTextMessage(context, node.data.text || node.data.message);
      return {};

    case "condition":
      // TODO: Implement condition logic
      return {};

    case "collect_input":
      // TODO: Implement input collection
      await sendTextMessage(context, node.data.prompt || "Bitte antworten Sie:");
      return { stop: true }; // Wait for user input

    case "api_call":
      // TODO: Implement API calls
      return {};

    case "delay":
      // TODO: Implement delays
      return {};

    case "end":
      return { stop: true };

    default:
      console.warn(`⚠️  Unknown node type: ${node.type}`);
      return {};
  }
}

/**
 * Send a text message through the bot
 */
async function sendTextMessage(context: BotContext, text: string): Promise<void> {
  try {
    if (!context.bot.whatsappPhoneId || !context.bot.whatsappToken) {
      console.error("❌ Bot not configured for WhatsApp");
      return;
    }

    // Replace variables in text
    const processedText = replaceVariables(text, context.variables);

    // Send via WhatsApp API
    await whatsapp.sendTextMessage(
      context.bot.whatsappPhoneId,
      context.contactPhone,
      processedText
    );

    // Store outgoing message
    await prisma.message.create({
      data: {
        direction: "outgoing",
        content: processedText,
        contactPhone: context.contactPhone,
        botId: context.bot.id,
      },
    });

    console.log(`📤 Sent: ${processedText.substring(0, 50)}...`);

  } catch (error) {
    console.error("❌ Error sending message:", error);
    throw error;
  }
}

/**
 * Send fallback message when no flow matches
 */
async function sendFallbackMessage(context: BotContext): Promise<void> {
  const fallbackText = context.bot.fallbackMessage || 
    "Entschuldigung, ich habe das nicht verstanden. Können Sie das anders formulieren?";
  
  await sendTextMessage(context, fallbackText);
}

/**
 * Send error message when something goes wrong
 */
async function sendErrorMessage(bot: Bot, contactPhone: string): Promise<void> {
  try {
    if (!bot.whatsappPhoneId) return;

    const errorText = "Es tut mir leid, es ist ein technischer Fehler aufgetreten. Bitte versuchen Sie es später erneut.";
    
    await whatsapp.sendTextMessage(bot.whatsappPhoneId, contactPhone, errorText);

    // Store error message
    await prisma.message.create({
      data: {
        direction: "outgoing",
        content: errorText,
        contactPhone,
        botId: bot.id,
      },
    });

  } catch (error) {
    console.error("❌ Error sending error message:", error);
  }
}

/**
 * Replace variables in text (e.g., {{name}} -> John)
 */
function replaceVariables(text: string, variables: Record<string, any>): string {
  return text.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
    return variables[varName] || match;
  });
}

/**
 * Create a simple text flow for testing
 */
export function createSimpleFlow(botId: string, welcomeMessage: string) {
  return {
    name: "Willkommens-Flow",
    description: "Einfacher Begrüßungsflow",
    triggerType: "always",
    botId,
    nodes: {
      nodes: [
        {
          id: "start",
          type: "start",
          data: { label: "Start" },
          position: { x: 100, y: 100 },
        },
        {
          id: "welcome",
          type: "message",
          data: { text: welcomeMessage },
          position: { x: 300, y: 100 },
        },
        {
          id: "end",
          type: "end",
          data: { label: "Ende" },
          position: { x: 500, y: 100 },
        },
      ],
      edges: [
        { id: "e1", source: "start", target: "welcome" },
        { id: "e2", source: "welcome", target: "end" },
      ],
    },
  };
}

export type { BotContext, FlowNode, FlowEdge };
