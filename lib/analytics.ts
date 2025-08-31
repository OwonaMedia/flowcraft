// FlowCraft - Analytics Library
// Tracking und Analytics für Bot Performance

import { prisma } from "@/lib/prisma";

export interface AnalyticsEvent {
  event: string;
  botId?: string;
  userId?: string;
  properties?: Record<string, any>;
}

export interface DashboardMetrics {
  totalMessages: number;
  activeBots: number;
  uniqueContacts: number;
  conversionRate: number;
  dailyStats: Array<{
    date: string;
    messages: number;
    contacts: number;
  }>;
}

export interface BotMetrics {
  botId: string;
  name: string;
  messagesReceived: number;
  messagesSent: number;
  uniqueContacts: number;
  avgResponseTime: number;
  conversionRate: number;
  isActive: boolean;
}

/**
 * Track Analytics Event
 */
export async function trackEvent(event: AnalyticsEvent): Promise<void> {
  try {
    // In production, this would send to analytics service
    console.log('Analytics Event:', event);
    
    // For now, just store basic bot metrics
    if (event.botId && event.event === 'message_received') {
      // Update bot analytics would go here
    }
  } catch (error) {
    console.error('Failed to track event:', error);
  }
}

/**
 * Get Dashboard Analytics
 */
export async function getDashboardAnalytics(userId: string, days: number = 7): Promise<DashboardMetrics> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        bots: {
          include: {
            analytics: {
              where: {
                date: {
                  gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
                },
              },
              orderBy: { date: 'desc' },
            },
          },
        },
      },
    });

    if (!user) {
      return getEmptyMetrics();
    }

    // Calculate aggregated metrics
    const allAnalytics = user.bots.flatMap(bot => bot.analytics);
    
    const totalMessages = allAnalytics.reduce((sum, a) => sum + a.messagesReceived + a.messagesSent, 0);
    const activeBots = user.bots.filter(bot => bot.isActive).length;
    const uniqueContacts = Math.max(...allAnalytics.map(a => a.uniqueContacts), 0);
    const conversionRate = allAnalytics.length > 0 
      ? allAnalytics.reduce((sum, a) => sum + a.conversionsCount, 0) / allAnalytics.length 
      : 0;

    // Daily stats for chart
    const dailyStats = allAnalytics.reduce((acc, analytics) => {
      const dateStr = analytics.date.toISOString().split('T')[0];
      const existing = acc.find(d => d.date === dateStr);
      
      if (existing) {
        existing.messages += analytics.messagesReceived + analytics.messagesSent;
        existing.contacts += analytics.uniqueContacts;
      } else {
        acc.push({
          date: dateStr,
          messages: analytics.messagesReceived + analytics.messagesSent,
          contacts: analytics.uniqueContacts,
        });
      }
      
      return acc;
    }, [] as Array<{ date: string; messages: number; contacts: number }>);

    return {
      totalMessages,
      activeBots,
      uniqueContacts,
      conversionRate,
      dailyStats: dailyStats.slice(0, days),
    };

  } catch (error) {
    console.error('Failed to get dashboard analytics:', error);
    return getEmptyMetrics();
  }
}

/**
 * Get Bot-specific Analytics
 */
export async function getBotAnalytics(botId: string, days: number = 7): Promise<BotMetrics | null> {
  try {
    const bot = await prisma.bot.findUnique({
      where: { id: botId },
      include: {
        analytics: {
          where: {
            date: {
              gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
            },
          },
        },
      },
    });

    if (!bot) {
      return null;
    }

    const analytics = bot.analytics;
    const messagesReceived = analytics.reduce((sum, a) => sum + a.messagesReceived, 0);
    const messagesSent = analytics.reduce((sum, a) => sum + a.messagesSent, 0);
    const uniqueContacts = Math.max(...analytics.map(a => a.uniqueContacts), 0);
    const avgResponseTime = analytics.length > 0 
      ? analytics.reduce((sum, a) => sum + (a.avgResponseTime || 0), 0) / analytics.length
      : 0;
    const conversionRate = analytics.length > 0
      ? analytics.reduce((sum, a) => sum + a.conversionsCount, 0) / analytics.length
      : 0;

    return {
      botId: bot.id,
      name: bot.name,
      messagesReceived,
      messagesSent,
      uniqueContacts,
      avgResponseTime,
      conversionRate,
      isActive: bot.isActive,
    };

  } catch (error) {
    console.error('Failed to get bot analytics:', error);
    return null;
  }
}

/**
 * Get empty metrics for fallback
 */
function getEmptyMetrics(): DashboardMetrics {
  return {
    totalMessages: 0,
    activeBots: 0,
    uniqueContacts: 0,
    conversionRate: 0,
    dailyStats: [],
  };
}

/**
 * Record Bot Activity
 */
export async function recordBotActivity(botId: string, activity: {
  messagesReceived?: number;
  messagesSent?: number;
  uniqueContacts?: number;
  responseTime?: number;
}): Promise<void> {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await prisma.botAnalytics.upsert({
      where: {
        botId_date: {
          botId,
          date: today,
        },
      },
      update: {
        messagesReceived: { increment: activity.messagesReceived || 0 },
        messagesSent: { increment: activity.messagesSent || 0 },
        uniqueContacts: Math.max(activity.uniqueContacts || 0),
        avgResponseTime: activity.responseTime,
      },
      create: {
        botId,
        date: today,
        messagesReceived: activity.messagesReceived || 0,
        messagesSent: activity.messagesSent || 0,
        uniqueContacts: activity.uniqueContacts || 0,
        avgResponseTime: activity.responseTime,
      },
    });

  } catch (error) {
    console.error('Failed to record bot activity:', error);
  }
}
