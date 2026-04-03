import { prisma } from "./db";
import { SavingsGoal } from "@/types";
import { Prisma } from "@prisma/client";

export const savingsService = {
  async getGoals(userId: string): Promise<SavingsGoal[]> {
    const goals = await prisma.savingsGoal.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return goals.map((goal) => ({
      id: goal.id,
      userId: goal.userId,
      title: goal.title,
      targetAmount: Number(goal.targetAmount),
      currentAmount: Number(goal.currentAmount),
      deadline: goal.deadline.toISOString(),
      createdAt: goal.createdAt.toISOString(),
    }));
  },

  async createGoal(userId: string, data: { title: string; targetAmount: number; deadline: string }): Promise<SavingsGoal> {
    const goal = await prisma.savingsGoal.create({
      data: {
        userId,
        title: data.title,
        targetAmount: new Prisma.Decimal(data.targetAmount),
        currentAmount: new Prisma.Decimal(0),
        deadline: new Date(data.deadline),
      },
    });

    return {
      id: goal.id,
      userId: goal.userId,
      title: goal.title,
      targetAmount: Number(goal.targetAmount),
      currentAmount: Number(goal.currentAmount),
      deadline: goal.deadline.toISOString(),
      createdAt: goal.createdAt.toISOString(),
    };
  },

  async updateSavingsProgress(id: string, userId: string, amount: number): Promise<SavingsGoal> {
    const exists = await prisma.savingsGoal.findFirst({
      where: { id, userId },
    });
    if (!exists) throw new Error("Goal not found");

    const goal = await prisma.savingsGoal.update({
      where: { id },
      data: {
        currentAmount: {
          increment: new Prisma.Decimal(amount),
        },
      },
    });

    // Check progress for notifications
    this.checkAndNotifyGoalProgress(userId, id).catch(err => {
      console.error("Failed to check goal notification:", err);
    });

    return {
      id: goal.id,
      userId: goal.userId,
      title: goal.title,
      targetAmount: Number(goal.targetAmount),
      currentAmount: Number(goal.currentAmount),
      deadline: goal.deadline.toISOString(),
      createdAt: goal.createdAt.toISOString(),
    };
  },

  async deleteGoal(id: string, userId: string): Promise<void> {
    await prisma.savingsGoal.deleteMany({
      where: { id, userId },
    });
  },

  calculateSavingsProgress(current: number, target: number): number {
    if (target === 0) return 0;
    return Math.min(Math.round((current / target) * 100), 100);
  },

  async checkAndNotifyGoalProgress(userId: string, id: string, amountAdded: number = 0): Promise<void> {
    const goal = await prisma.savingsGoal.findFirst({
      where: { id, userId },
    });

    if (!goal) return;

    const current = Number(goal.currentAmount);
    const target = Number(goal.targetAmount);
    if (target <= 0) return;

    const prevAmount = current - amountAdded;
    const prevPercent = (prevAmount / target) * 100;
    const currentPercent = (current / target) * 100;

    const { goalThresholds } = await notificationService.getAlertSettings(userId);
    const crossedThresholds = goalThresholds.filter(t => prevPercent < t && currentPercent >= t);

    for (const threshold of crossedThresholds) {
      let message = `Goal reached for ${goal.title}! 🎉 Saved: ₹${current.toLocaleString()}, Target: ₹${target.toLocaleString()}`;
      if (threshold === 25) message = `Started well! You've reached 25% of your goal: ${goal.title}`;
      else if (threshold === 50) message = `Halfway there! 🚀 You've reached 50% of your goal: ${goal.title}`;
      else if (threshold === 80) message = `Almost there! You've reached 80% of your goal: ${goal.title}`;

      await notificationService.notifyIfThresholdCrossed({
        userId,
        message,
        type: "savings",
        threshold,
        identifier: `goal:${goal.title}`,
      });
    }
  },
};

import { notificationService } from "./notificationService";

