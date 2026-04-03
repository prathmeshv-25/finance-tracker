import { prisma } from "./db";

export type NotificationType = "reminder" | "transaction" | "system" | "budget" | "savings";

export const notificationService = {
  async getNotifications(userId: string) {
    return await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
  },

  async markAsRead(id: string, userId: string) {
    return await prisma.notification.update({
      where: { id, userId },
      data: { isRead: true },
    });
  },

  async markAllAsRead(userId: string) {
    return await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  },

  async deleteNotification(id: string, userId: string) {
    return await prisma.notification.delete({
      where: { id, userId },
    });
  },

  async createNotification(userId: string, message: string, type: NotificationType, metadata?: any) {
    return await prisma.notification.create({
      data: {
        userId,
        message,
        type,
        metadata: metadata || null,
      },
    });
  },

  async getAlertSettings(userId: string) {
    try {
        let settings = await prisma.alertSettings.findUnique({
          where: { userId },
        });
    
        if (!settings) {
          settings = await prisma.alertSettings.create({
            data: { userId },
          });
        }
    
        return {
          budgetThresholds: (settings.budgetThresholds as number[]) || [50, 80, 100, 110],
          goalThresholds: (settings.goalThresholds as number[]) || [25, 50, 80, 100],
          lowBalanceLimit: Number(settings.lowBalanceLimit),
        };
    } catch {
        // Fallback if schema is not ready
        return {
            budgetThresholds: [50, 80, 100, 110],
            goalThresholds: [25, 50, 80, 100],
            lowBalanceLimit: 1000,
        };
    }
  },

  // Core Logic: Checks which thresholds were crossed
  checkThresholds(prev: number, curr: number, thresholds: number[]) {
    return thresholds.filter(t => prev < t && curr >= t);
  },

  // Check and notify for crossing a specific threshold
  async notifyIfThresholdCrossed(args: {
    userId: string;
    message: string;
    type: NotificationType;
    threshold: number;
    identifier: string; // Identifier for the resource (e.g. "budget:Food:2024-04" or "goal:Vacation")
  }) {
    const { userId, message, type, threshold, identifier } = args;

    // Check if a notification for this specific identifier and threshold exists in the current logic
    // We use metadata to track exactly which threshold was triggered for which resource.
    /*
    const existing = await prisma.notification.findFirst({
      where: {
        userId,
        type,
        metadata: {
            path: ['id'],
            equals: identifier,
            // also check threshold? Actually, easier to check by string key in metadata
        },
      },
    });
    */

    // Using a more robust check with typed JSON or search in message if identifier is included.
    const searchString = `[ID:${identifier}:T:${threshold}]`;

    const notificationExists = await (prisma.notification as any).findFirst({
        where: {
            userId,
            type,
            message: { contains: searchString }
        }
    });

    if (!notificationExists) {
        await this.createNotification(userId, `${message} ${searchString}`, type, { identifier, threshold });
    }
  },

  async checkGeneralAlerts(userId: string) {
    const now = new Date();
    
    // 1. Check Subscriptions
    const subscriptions = await prisma.subscription.findMany({
      where: { userId, isActive: true },
    });

    for (const sub of subscriptions) {
      const nextDate = new Date(sub.nextBillingDate);
      const diffTime = nextDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 3 || diffDays === 1 || diffDays === 0) {
        let label = `is due in ${diffDays} days`;
        if (diffDays === 0) label = "is due TODAY";
        
        await this.notifyIfThresholdCrossed({
            userId,
            message: `Subscription Alert: ${sub.name} (₹${sub.amount.toLocaleString()}) ${label}.`,
            type: "system",
            threshold: diffDays, 
            identifier: `sub:${sub.id}:${nextDate.toISOString().split('T')[0]}`
        });
      }
    }

    // 2. Check Reminders
    const reminders = await prisma.reminder.findMany({
        where: { userId, isCompleted: false }
    });

    for (const rem of reminders) {
        const dueDate = new Date(rem.dueDate);
        const diffTime = dueDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 3 && diffDays >= 0) {
            let label = `is due in ${diffDays} days`;
            if (diffDays === 0) label = "is due TODAY";
            
            await this.notifyIfThresholdCrossed({
                userId,
                message: `Reminder Alert: ${rem.title} ${label}.`,
                type: "reminder",
                threshold: diffDays,
                identifier: `rem:${rem.id}:${dueDate.toISOString().split('T')[0]}`
            });
        } else if (diffDays < 0) {
             await this.notifyIfThresholdCrossed({
                userId,
                message: `OVERDUE Alert: ${rem.title} was due on ${dueDate.toLocaleDateString()}.`,
                type: "reminder",
                threshold: -1,
                identifier: `rem:${rem.id}:overdue`
            });
        }
    }
  },
};

