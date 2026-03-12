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
    const goal = await prisma.savingsGoal.update({
      where: { id, userId },
      data: {
        currentAmount: {
          increment: new Prisma.Decimal(amount),
        },
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

  async deleteGoal(id: string, userId: string): Promise<void> {
    await prisma.savingsGoal.delete({
      where: { id, userId },
    });
  },

  calculateSavingsProgress(current: number, target: number): number {
    if (target === 0) return 0;
    return Math.min(Math.round((current / target) * 100), 100);
  },
};
