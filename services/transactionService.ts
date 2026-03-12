import { prisma } from "./db";
import { Transaction } from "@/types";
import { Prisma } from "@prisma/client";

export const transactionService = {
  async getUserTransactions(userId: string): Promise<Transaction[]> {
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { transactionDate: "desc" },
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
    }));
  },

  async createTransaction(userId: string, data: {
    amount: number;
    category: string;
    type: string;
    description?: string;
    date?: string;
  }): Promise<Transaction> {
    const transaction = await prisma.transaction.create({
      data: {
        userId,
        amount: new Prisma.Decimal(data.amount),
        category: data.category,
        type: data.type,
        description: data.description,
        transactionDate: data.date ? new Date(data.date) : new Date(),
      },
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
    };
  },

  async deleteTransaction(id: string, userId: string): Promise<void> {
    await prisma.transaction.delete({
      where: { id, userId },
    });
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
};
