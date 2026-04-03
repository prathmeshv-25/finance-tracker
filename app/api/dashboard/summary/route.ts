import { NextResponse } from "next/server";
import { getAuthUser } from "@/services/authService";
import { transactionService } from "@/services/transactionService";
import { budgetService } from "@/services/budgetService";
import { savingsService } from "@/services/savingsService";
import { AnalyticsService } from "@/services/analyticsService";
import { getCurrentMonthInfo } from "@/utils/dateHelpers";
import { notificationService } from "@/services/notificationService";

export async function GET() {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { month, year } = getCurrentMonthInfo();

  // Trigger lazy checks for subscriptions and reminders (non-blocking)
  try {
    notificationService.checkGeneralAlerts(user.userId).catch((err: any) => {
        console.error("Background notify error:", err);
    });
  } catch (err) {
    console.error("Crashed on general alerts:", err);
  }

  try {
    const [transactions, budgets, savingsGoals, totals, anomalies, adherence, categoryBreakdown] = await Promise.all([
      transactionService.getUserTransactions(user.userId, { take: 10 }), // Only fetch recent
      budgetService.getBudgets(user.userId, month, year),
      savingsService.getGoals(user.userId),
      transactionService.calculateTotals(user.userId),
      AnalyticsService.getAnomalies(user.userId),
      AnalyticsService.getBudgetAdherence(user.userId),
      AnalyticsService.getCategoryBreakdown(user.userId), // Explicitly fetch chart data
    ]);

    // Format Smart Insights
    const insights: any[] = [];
    
    // Add anomalies
    anomalies.slice(0, 2).forEach((a: any) => {
      insights.push({
        type: "warning",
        title: "Anomaly Detected",
        message: a.message,
      });
    });

    // Add budget alerts
    adherence.filter((b: any) => b.isOver).slice(0, 1).forEach((b: any) => {
      insights.push({
        type: "alert",
        title: "Over Budget",
        message: `Your ${b.category} spending is ${b.percent.toFixed(1)}% of your limit. Recommend cutting back.`,
      });
    });

    // Add success insight if everything is going well
    if (insights.length === 0) {
      insights.push({
        type: "success",
        title: "Financial Milestone",
        message: "You're staying well within your budget this month. Great job!",
      });
    }

    return NextResponse.json({
      totalBalance: totals.balance,
      totalIncome: totals.income,
      totalExpense: totals.expense,
      recentTransactions: transactions.slice(0, 5),
      budgets,
      savingsGoals,
      categoryBreakdown,
      insights: insights.slice(0, 3), 
    });
  } catch (error) {
    console.error("Dashboard summary error:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard summary" }, { status: 500 });
  }
}
