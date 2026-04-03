import { prisma } from "./db";
import { Prisma } from "@prisma/client";
import { addDays, addWeeks, addMonths, addYears, isBefore, isSameDay } from "date-fns";
import { budgetService } from "./budgetService";

export const recurringService = {
  async createRecurringTransaction(userId: string, data: {
    amount: number;
    category: string;
    type: string;
    description?: string;
    frequency: "daily" | "weekly" | "monthly" | "yearly";
    startDate: string;
  }) {
    const startDate = new Date(data.startDate);
    
    return await prisma.recurringTransaction.create({
      data: {
        userId,
        amount: new Prisma.Decimal(data.amount),
        category: data.category,
        type: data.type,
        description: data.description,
        frequency: data.frequency,
        startDate: startDate,
        nextExecutionDate: startDate,
      },
    });
  },

  async getRecurringTransactions(userId: string) {
    return await prisma.recurringTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },

  async deleteRecurringTransaction(id: string, userId: string) {
    return await prisma.recurringTransaction.deleteMany({
      where: { id, userId },
    });
  },

  async processRecurringTransactions() {
    const today = new Date();
    
    const dueTransactions = await prisma.recurringTransaction.findMany({
      where: {
        isActive: true,
        nextExecutionDate: {
          lte: today,
        },
      },
    });

    const results = [];

    for (const rt of dueTransactions) {
      // Create new transaction
      const transaction = await prisma.transaction.create({
        data: {
          userId: rt.userId,
          amount: rt.amount,
          category: rt.category,
          type: rt.type,
          description: `Auto-generated: ${rt.description || ""}`,
          transactionDate: rt.nextExecutionDate,
        },
      });

      // Update next execution date
      const nextDate = this.calculateNextDate(rt.nextExecutionDate, rt.frequency as any);
      
      await prisma.recurringTransaction.update({
        where: { id: rt.id },
        data: {
          nextExecutionDate: nextDate,
        },
      });

      results.push(transaction);

      // Create notification for the user
      await prisma.notification.create({
        data: {
          userId: rt.userId,
          message: `Recurring ${rt.type} of ${rt.amount} for ${rt.category} has been processed.`,
          type: "transaction",
        },
      });

      // Check budget limit
      if (rt.type === "expense") {
        budgetService.checkAndNotifyBudgetExceeded(rt.userId, rt.category, rt.nextExecutionDate).catch(err => {
          console.error("Failed to check budget notification for recurring:", err);
        });
      }
    }

    return results;
  },

  calculateNextDate(currentDate: Date, frequency: "daily" | "weekly" | "monthly" | "yearly"): Date {
    switch (frequency) {
      case "daily":
        return addDays(currentDate, 1);
      case "weekly":
        return addWeeks(currentDate, 1);
      case "monthly":
        return addMonths(currentDate, 1);
      case "yearly":
        return addYears(currentDate, 1);
      default:
        return addMonths(currentDate, 1);
    }
  },
};
