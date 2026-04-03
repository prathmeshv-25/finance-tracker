import { NextResponse } from "next/server";
import { AnalyticsService } from "@/services/analyticsService";
import { getAuthUser } from "@/services/authService";

export async function GET(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (user as any).id || (user as any).userId;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [categoryBreakdown, monthlyTrends, summaryStats, anomalies, budgetAdherence] = await Promise.all([
      AnalyticsService.getCategoryBreakdown(userId),
      AnalyticsService.getMonthlyTrends(userId),
      AnalyticsService.getSummaryStats(userId),
      AnalyticsService.getAnomalies(userId),
      AnalyticsService.getBudgetAdherence(userId),
    ]);

    return NextResponse.json({
      categoryBreakdown,
      monthlyTrends,
      summaryStats,
      anomalies,
      budgetAdherence,
    });
  } catch (error) {
    console.error("Analytics Error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
