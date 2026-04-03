import { prisma } from "./db";
import { Transaction, TransactionFilters } from "@/types";
import { Prisma } from "@prisma/client";
import { AIService } from "./aiService";
import { budgetService } from "./budgetService";
import { savingsService } from "./savingsService";

export const transactionService = {
  async getUserTransactions(userId: string, filters?: TransactionFilters & { take?: number; skip?: number }): Promise<Transaction[]> {
    const where: Prisma.TransactionWhereInput = { userId };

    if (filters) {
      if (filters.category) where.category = filters.category;
      if (filters.type) where.type = filters.type;
      
      if (filters.startDate || filters.endDate) {
        where.transactionDate = {};
        if (filters.startDate) where.transactionDate.gte = new Date(filters.startDate);
        if (filters.endDate) where.transactionDate.lte = new Date(filters.endDate);
      }

      if (filters.minAmount !== undefined || filters.maxAmount !== undefined) {
        where.amount = {};
        if (filters.minAmount !== undefined) where.amount.gte = new Prisma.Decimal(filters.minAmount);
        if (filters.maxAmount !== undefined) where.amount.lte = new Prisma.Decimal(filters.maxAmount);
      }
    }

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: { transactionDate: "desc" },
      take: filters?.take,
      skip: filters?.skip,
    });

    return transactions.map(t => ({
      id: t.id,
      amount: Number(t.amount),
      category: t.category,
      type: t.type as "income" | "expense",
      description: t.description,
      transactionDate: t.transactionDate.toISOString(),
      userId: t.userId,
      createdAt: t.createdAt.toISOString(),
      savingsGoalId: t.savingsGoalId,
    }));
  },

  async createTransaction(userId: string, data: {
    amount: number;
    category: string;
    type: string;
    description?: string;
    date?: string;
    savingsGoalId?: string;
  }): Promise<Transaction> {
    const description = data.description || "";
    const category = (data.category === "Others" || !data.category) 
      ? AIService.classifyTransaction(description) 
      : data.category;

    // Check for potential duplicate transactions (same amount, category, date within 1 day)
    const possibleDuplicate = await prisma.transaction.findFirst({
        where: {
            userId,
            amount: new Prisma.Decimal(data.amount),
            category: category,
            transactionDate: {
                gte: new Date(data.date ? new Date(data.date).getTime() - 86400000 : new Date().getTime() - 86400000),
                lte: new Date(data.date ? new Date(data.date).getTime() + 86400000 : new Date().getTime() + 86400000),
            }
        }
    });

    if (possibleDuplicate) {
        await notificationService.createNotification(
            userId,
            `Suspicious activity: A duplicate transaction for ₹${data.amount} in ${category} was detected.`,
            "system",
            { duplicateId: possibleDuplicate.id }
        );
    }

    const transaction = await prisma.transaction.create({
      data: {
        userId,
        amount: new Prisma.Decimal(data.amount),
        category: category,
        type: data.type,
        description: description,
        transactionDate: data.date ? new Date(data.date) : new Date(),
        savingsGoalId: data.savingsGoalId,
      },
    });

    if (data.savingsGoalId && data.type === "expense") {
      // If it's an expense towards a savings goal, it goes INTO the savings goal.
      await prisma.savingsGoal.update({
        where: { id: data.savingsGoalId },
        data: {
          currentAmount: {
            increment: new Prisma.Decimal(data.amount),
          },
        },
      });

      // Check savings goal progress for notifications
      savingsService.checkAndNotifyGoalProgress(userId, data.savingsGoalId, data.amount).catch((err: any) => {
        console.error("Failed to check goal notification for transaction:", err);
      });
    }

    // Also check budget limit for expenses
    if (data.type === "expense") {
        const date = data.date ? new Date(data.date) : new Date();
        budgetService.checkAndNotifyBudgetExceeded(userId, category, date, data.amount).catch((err: any) => {
          console.error("Failed to check budget notification:", err);
        });
        
        this.checkSpendingPattern(userId, category).catch((err: any) => {
            console.error("Failed to check spending pattern:", err);
        });
    }

    return {
      id: transaction.id,
      amount: Number(transaction.amount),
      category: transaction.category,
      type: transaction.type as "income" | "expense",
      description: transaction.description,
      transactionDate: transaction.transactionDate.toISOString(),
      userId: transaction.userId,
      createdAt: transaction.createdAt.toISOString(),
      savingsGoalId: transaction.savingsGoalId,
    };
  },

  async deleteTransaction(id: string, userId: string): Promise<void> {
    // Get details before deletion for notification re-evaluation logic if needed in future
    const t = await prisma.transaction.findFirst({
      where: { id, userId },
    });

    if (t && t.savingsGoalId && t.type === "expense") {
      // Revert savings goal progress
      await prisma.savingsGoal.update({
        where: { id: t.savingsGoalId },
        data: {
          currentAmount: {
            decrement: t.amount,
          },
        },
      });
    }

    await prisma.transaction.deleteMany({
      where: { id, userId },
    });

    // Check low balance again after deletion
    this.checkLowBalanceAlert(userId).catch((err: any) => {
      console.error("Failed to check low balance (delete):", err);
    });
  },

  async getTransactionById(id: string, userId: string): Promise<Transaction | null> {
    const t = await prisma.transaction.findFirst({
      where: { id, userId },
    });
    if (!t) return null;
    return {
      id: t.id,
      amount: Number(t.amount),
      category: t.category,
      type: t.type as "income" | "expense",
      description: t.description,
      transactionDate: t.transactionDate.toISOString(),
      userId: t.userId,
      createdAt: t.createdAt.toISOString(),
      savingsGoalId: t.savingsGoalId,
    };
  },

  async updateTransaction(id: string, userId: string, data: {
    amount?: number;
    category?: string;
    type?: string;
    description?: string;
    date?: string;
    savingsGoalId?: string | null;
  }): Promise<Transaction | null> {
    const updateData: any = {};
    if (data.amount !== undefined) updateData.amount = new Prisma.Decimal(data.amount);
    if (data.category) updateData.category = data.category;
    if (data.type) updateData.type = data.type;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.date) updateData.transactionDate = new Date(data.date);

    const exists = await prisma.transaction.findFirst({
      where: { id, userId },
    });
    if (!exists) return null;

    const transaction = await prisma.transaction.update({
      where: { id },
      data: updateData,
    });

    if (!transaction) return null;

    // Trigger notification checks on update
    if (transaction.type === "expense") {
      budgetService.checkAndNotifyBudgetExceeded(userId, transaction.category, transaction.transactionDate, Number(transaction.amount)).catch((err: any) => {
        console.error("Failed to check budget notification (update):", err);
      });
    }

    if (transaction.savingsGoalId && transaction.type === "expense") {
      savingsService.checkAndNotifyGoalProgress(userId, transaction.savingsGoalId, Number(transaction.amount)).catch((err: any) => {
        console.error("Failed to check goal notification (update):", err);
      });
    }

    // Check low balance
    this.checkLowBalanceAlert(userId).catch((err: any) => {
      console.error("Failed to check low balance (update):", err);
    });

    return {
      id: transaction.id,
      amount: Number(transaction.amount),
      category: transaction.category,
      type: transaction.type as "income" | "expense",
      description: transaction.description,
      transactionDate: transaction.transactionDate.toISOString(),
      userId: transaction.userId,
      createdAt: transaction.createdAt.toISOString(),
      savingsGoalId: transaction.savingsGoalId,
    };
  },

  async calculateTotals(userId: string) {
    const totals = await prisma.transaction.groupBy({
      by: ["type"],
      where: { userId },
      _sum: { amount: true },
    });

    const income = Number(totals.find(t => t.type === "income")?._sum.amount || 0);
    const expense = Number(totals.find(t => t.type === "expense")?._sum.amount || 0);

    return {
      balance: income - expense,
      income,
      expense,
    };
  },

  async checkLowBalanceAlert(userId: string) {
    const { balance } = await this.calculateTotals(userId);
    const { lowBalanceLimit } = await notificationService.getAlertSettings(userId);

    if (balance < 0) {
        await notificationService.notifyIfThresholdCrossed({
            userId,
            message: `CRITICAL: Negative balance! Current balance: ₹${balance.toLocaleString()}.`,
            type: "system",
            threshold: 0,
            identifier: "balance:negative"
        });
    } else if (balance < lowBalanceLimit) {
        await notificationService.notifyIfThresholdCrossed({
            userId,
            message: `Low balance warning! Current balance: ₹${balance.toLocaleString()}. Threshold: ₹${lowBalanceLimit.toLocaleString()}`,
            type: "system",
            threshold: lowBalanceLimit,
            identifier: "balance:low"
        });
    }
  },

  async checkSpendingPattern(userId: string, category: string) {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonth = lastMonthDate.getMonth() + 1;
    const lastYear = lastMonthDate.getFullYear();

    const [currentSpent, lastMonthSpent] = await Promise.all([
        prisma.transaction.aggregate({
            where: {
                userId,
                category,
                type: "expense",
                transactionDate: {
                    gte: new Date(currentYear, currentMonth - 1, 1),
                    lt: new Date(currentYear, currentMonth, 1),
                }
            },
            _sum: { amount: true }
        }),
        prisma.transaction.aggregate({
            where: {
                userId,
                category,
                type: "expense",
                transactionDate: {
                    gte: new Date(lastYear, lastMonth - 1, 1),
                    lt: new Date(lastYear, lastMonth, 1),
                }
            },
            _sum: { amount: true }
        })
    ]);

    const curr = Number(currentSpent._sum.amount || 0);
    const prev = Number(lastMonthSpent._sum.amount || 0);

    // Rule: if current_month > last_month * 1.2
    if (prev > 0 && curr > prev * 1.2) {
        await notificationService.notifyIfThresholdCrossed({
            userId,
            message: `Spending spike! Your ${category} spending is 20%+ higher than last month. Current: ₹${curr.toLocaleString()}, Last month: ₹${prev.toLocaleString()}`,
            type: "system",
            threshold: 120,
            identifier: `spike:${category}:${currentYear}-${currentMonth}`
        });
    }
  },
};


import { notificationService } from "./notificationService";

