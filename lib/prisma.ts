// BotChat Pro - Prisma Client Configuration
// Optimized for Next.js development with proper connection pooling

import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const createPrismaClient = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
};

export const prisma = globalThis.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

// GDPR Helper Functions
export const gdprHelpers = {
  // Soft delete user and related data
  async deleteUserData(userId: string) {
    const deletedAt = new Date();
    
    await prisma.$transaction([
      // Soft delete user
      prisma.user.update({
        where: { id: userId },
        data: { deletedAt },
      }),
      // Soft delete bots
      prisma.bot.updateMany({
        where: { userId },
        data: { deletedAt },
      }),
      // Hard delete messages after retention period
      prisma.message.deleteMany({
        where: {
          bot: { userId },
          createdAt: {
            lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days
          },
        },
      }),
    ]);
  },

  // Export user data for GDPR requests
  async exportUserData(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        bots: {
          include: {
            flows: true,
            messages: {
              where: {
                createdAt: {
                  gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
                },
              },
            },
            analytics: true,
          },
        },
        apiKeys: true,
      },
    });

    // Remove sensitive data before export
    if (user) {
      user.bots.forEach(bot => {
        bot.whatsappToken = "[REDACTED]";
        bot.messages.forEach(message => {
          message.contactPhone = "[REDACTED]";
        });
      });
      
      user.apiKeys.forEach(key => {
        key.keyHash = "[REDACTED]";
      });
    }

    return user;
  },

  // Clean up old data automatically
  async cleanupOldData() {
    const retentionDays = 30;
    const cutoffDate = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);

    await prisma.$transaction([
      // Delete old messages
      prisma.message.deleteMany({
        where: {
          createdAt: { lt: cutoffDate },
          deletedAt: { not: null },
        },
      }),
      // Delete old analytics (keep aggregated data)
      prisma.botAnalytics.deleteMany({
        where: {
          date: { lt: cutoffDate },
        },
      }),
    ]);
  },
};
