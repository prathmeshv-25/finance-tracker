import { prisma } from "./db";
import { Prisma } from "@prisma/client";

export const subscriptionService = {
  async createSubscription(userId: string, data: {
    name: string;
    amount: number;
    billingCycle: "monthly" | "yearly";
    startDate: string;
    category?: string;
  }) {
    const startDate = new Date(data.startDate);
    
    // Calculate the actual next billing date based on the cycle
    const nextBillingDate = new Date(startDate);
    if (data.billingCycle === "monthly") {
      nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
    } else {
      nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
    }

    return await prisma.subscription.create({
      data: {
        userId,
        name: data.name,
        amount: new Prisma.Decimal(data.amount),
        billingCycle: data.billingCycle,
        startDate: startDate,
        nextBillingDate: nextBillingDate,
        category: data.category || "Subscription",
      },
    });
  },

  async getSubscriptions(userId: string) {
    return await prisma.subscription.findMany({
      where: { userId },
      orderBy: { nextBillingDate: "asc" },
    });
  },

  async deactivateSubscription(id: string, userId: string) {
    const exists = await prisma.subscription.findFirst({
      where: { id, userId },
    });
    if (!exists) throw new Error("Subscription not found");

    return await prisma.subscription.update({
      where: { id },
      data: { isActive: false },
    });
  },

  async updateSubscription(id: string, userId: string, data: any) {
    const exists = await prisma.subscription.findFirst({
      where: { id, userId },
    });
    if (!exists) throw new Error("Subscription not found");

    return await prisma.subscription.update({
      where: { id },
      data,
    });
  },

  async deleteSubscription(id: string, userId: string) {
    return await prisma.subscription.deleteMany({
      where: { id, userId },
    });
  },

  async checkAndNotifyUpcomingSubscriptions(userId: string) {
    const today = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(today.getDate() + 3);

    const upcomingSubscriptions = await prisma.subscription.findMany({
      where: {
        userId,
        isActive: true,
        nextBillingDate: {
          gte: today,
          lte: threeDaysFromNow,
        },
      },
    });

    for (const sub of upcomingSubscriptions) {
      const existingNotification = await prisma.notification.findFirst({
        where: {
          userId,
          type: "system",
          message: {
            contains: `Subscription upcoming: ${sub.name}`,
          },
          createdAt: {
            gte: new Date(new Date().setDate(today.getDate() - 7)), // Don't notify more than once a week for the same billing event
          },
        },
      });

      if (!existingNotification) {
        await prisma.notification.create({
          data: {
            userId,
            message: `Subscription upcoming: ${sub.name} (₹${Number(sub.amount).toLocaleString()}) is due on ${sub.nextBillingDate.toLocaleDateString()}.`,
            type: "system",
          },
        });
      }
    }
  },
};
