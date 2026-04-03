import { prisma } from "./db";
import { Budget } from "@/types";
import { Prisma } from "@prisma/client";

export const budgetService = {
  async getBudgets(userId: string, month: number, year: number): Promise<Budget[]> {
    const budgets = await prisma.budget.findMany({
      where: { userId, month, year },
    });

    const budgetsWithSpent = await Promise.all(
      budgets.map(async (budget) => {
        const spent = await prisma.transaction.aggregate({
          where: {
            userId,
            category: budget.category,
            type: "expense",
            transactionDate: {
              gte: new Date(year, month - 1, 1),
              lt: new Date(year, month, 1),
            },
          },
          _sum: { amount: true },
        });

        return {
          id: budget.id,
          userId: budget.userId,
          category: budget.category,
          monthlyLimit: Number(budget.monthlyLimit),
          month: budget.month,
          year: budget.year,
          spent: Number(spent._sum.amount || 0),
          createdAt: budget.createdAt.toISOString(),
        };
      })
    );

    return budgetsWithSpent;
  },

  async createBudget(userId: string, data: { category: string; monthlyLimit: number; month: number; year: number }): Promise<Budget> {
    const budget = await prisma.budget.upsert({
      where: {
        userId_category_month_year: {
          userId,
          category: data.category,
          month: data.month,
          year: data.year,
        },
      },
      update: {
        monthlyLimit: new Prisma.Decimal(data.monthlyLimit),
      },
      create: {
        userId,
        category: data.category,
        monthlyLimit: new Prisma.Decimal(data.monthlyLimit),
        month: data.month,
        year: data.year,
      },
    });

    return {
      id: budget.id,
      userId: budget.userId,
      category: budget.category,
      monthlyLimit: Number(budget.monthlyLimit),
      month: budget.month,
      year: budget.year,
      createdAt: budget.createdAt.toISOString(),
    };
  },

  async deleteBudget(id: string, userId: string): Promise<void> {
    await prisma.budget.delete({
      where: { id, userId },
    });
  },

  async calculateBudgetUsage(monthlyLimit: number, spent: number): Promise<number> {
    if (monthlyLimit === 0) return 0;
    return Math.min(Math.round((spent / monthlyLimit) * 100), 100);
  },

  async checkAndNotifyBudgetExceeded(userId: string, category: string, date: Date, amountAdded: number = 0): Promise<void> {
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const budget = await prisma.budget.findFirst({
      where: { userId, category, month, year },
    });

    if (!budget) return;

    const spentResult = await prisma.transaction.aggregate({
      where: {
        userId,
        category,
        type: "expense",
        transactionDate: {
          gte: new Date(year, month - 1, 1),
          lt: new Date(year, month, 1),
        },
      },
      _sum: { amount: true },
    });

    const totalSpent = Number(spentResult._sum.amount || 0);
    const limit = Number(budget.monthlyLimit);
    if (limit <= 0) return;

    const prevSpent = totalSpent - amountAdded;
    const prevPercent = (prevSpent / limit) * 100;
    const currentPercent = (totalSpent / limit) * 100;

    const { budgetThresholds } = await notificationService.getAlertSettings(userId);
    const crossedThresholds = budgetThresholds.filter(t => prevPercent < t && currentPercent >= t);

    for (const threshold of crossedThresholds) {
      let severity = "Warning";
      if (threshold >= 110) severity = "Critical (Overspending)";
      else if (threshold >= 100) severity = "Danger (Limit reached)";
      else if (threshold >= 80) severity = "Alert";

      await notificationService.notifyIfThresholdCrossed({
        userId,
        message: `${severity}: ${category} budget is ${threshold}% used. Spent: ₹${totalSpent.toLocaleString()}, Limit: ₹${limit.toLocaleString()}`,
        type: "budget",
        threshold,
        identifier: `budget:${category}:${year}-${month}`,
      });
    }
  },
};

import { notificationService } from "./notificationService";

