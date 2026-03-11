import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api";

// GET /api/dashboard/summary
export async function GET() {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;

  const userId = auth.user.userId;

  const [incomeAgg, expenseAgg, recentTransactions, categories] =
    await Promise.all([
      prisma.transaction.aggregate({
        where: { userId, type: "income" },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: { userId, type: "expense" },
        _sum: { amount: true },
      }),
      prisma.transaction.findMany({
        where: { userId },
        include: { category: true },
        orderBy: { transactionDate: "desc" },
        take: 5,
      }),
      prisma.category.findMany({ orderBy: { name: "asc" } }),
    ]);

  const totalIncome = Number(incomeAgg._sum.amount ?? 0);
  const totalExpenses = Number(expenseAgg._sum.amount ?? 0);
  const balance = totalIncome - totalExpenses;

  return NextResponse.json({
    totalIncome,
    totalExpenses,
    balance,
    recentTransactions,
    categories,
  });
}
