import { NextResponse } from "next/server";
import { getAuthUser } from "@/services/authService";
import { transactionService } from "@/services/transactionService";
import { budgetService } from "@/services/budgetService";
import { savingsService } from "@/services/savingsService";
import { getCurrentMonthInfo } from "@/utils/dateHelpers";

export async function GET() {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { month, year } = getCurrentMonthInfo();

  try {
    const [transactions, budgets, savingsGoals, totals] = await Promise.all([
      transactionService.getUserTransactions(user.userId),
      budgetService.getBudgets(user.userId, month, year),
      savingsService.getGoals(user.userId),
      transactionService.calculateTotals(user.userId),
    ]);

    // Calculate category breakdown for chart
    const categoryTotals = transactions.reduce((acc: any, t) => {
      if (t.type === "expense") {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
      }
      return acc;
    }, {});

    const categoryBreakdown = Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value,
    }));

    return NextResponse.json({
      totalBalance: totals.balance,
      totalIncome: totals.income,
      totalExpense: totals.expense,
      recentTransactions: transactions.slice(0, 5),
      budgets,
      savingsGoals,
      categoryBreakdown,
    });
  } catch (error) {
    console.error("Dashboard summary error:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard summary" }, { status: 500 });
  }
}
