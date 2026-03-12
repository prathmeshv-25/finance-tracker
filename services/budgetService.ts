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
};
