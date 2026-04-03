import { prisma } from "./db";

export class AnalyticsService {
  static async getCategoryBreakdown(userId: string) {
    const categories = await prisma.transaction.groupBy({
      by: ["category"],
      where: { 
        userId,
        type: "expense" 
      },
      _sum: {
        amount: true,
      },
    });

    return categories.map((c) => ({
      name: c.category || "Others",
      value: Number(c._sum.amount || 0),
    }));
  }

  static async getMonthlyTrends(userId: string) {
    // Get transactions from the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        transactionDate: {
          gte: sixMonthsAgo,
        },
      },
      select: {
        amount: true,
        type: true,
        transactionDate: true,
      },
      orderBy: {
        transactionDate: "asc",
      },
    });

    const monthlyData: Record<string, { month: string; income: number; expense: number }> = {};

    transactions.forEach((t) => {
      const monthStr = t.transactionDate.toLocaleString("default", { month: "short" });
      if (!monthlyData[monthStr]) {
        monthlyData[monthStr] = { month: monthStr, income: 0, expense: 0 };
      }
      
      const amount = Number(t.amount);
      if (t.type === "income") {
        monthlyData[monthStr].income += amount;
      } else {
        monthlyData[monthStr].expense += amount;
      }
    });

    return Object.values(monthlyData);
  }

  static async getSummaryStats(userId: string) {
    const stats = await prisma.transaction.groupBy({
      by: ["type"],
      where: { userId },
      _sum: { amount: true },
    });

    const income = Number(stats.find(s => s.type === "income")?._sum.amount || 0);
    const expense = Number(stats.find(s => s.type === "expense")?._sum.amount || 0);

    return {
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense,
      expenseRatio: income > 0 ? (expense / income) * 100 : 0,
    };
  }

  static async getAnomalies(userId: string) {
    // Look at last 30 days of transactions
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentTransactions = await prisma.transaction.findMany({
      where: {
        userId,
        transactionDate: { gte: thirtyDaysAgo },
      },
    });

    // Get historical averages per category (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const historicalData = await prisma.transaction.groupBy({
      by: ["category"],
      where: {
        userId,
        transactionDate: { gte: sixMonthsAgo, lt: thirtyDaysAgo },
        type: "expense",
      },
      _avg: {
        amount: true,
      },
    });

    const categoryAverages: Record<string, number> = {};
    historicalData.forEach(h => {
      categoryAverages[h.category] = Number(h._avg.amount || 0);
    });

    const anomalies = recentTransactions
      .filter(t => {
        const avg = categoryAverages[t.category];
        const amount = Number(t.amount);
        // Flag if > 2.5x the average AND > 500 (to avoid small noise)
        return avg > 0 && amount > avg * 2.5 && amount > 500;
      })
      .map(t => ({
        id: t.id,
        amount: Number(t.amount),
        category: t.category,
        description: t.description,
        date: t.transactionDate,
        averageInCategory: categoryAverages[t.category],
        message: `This ${t.category} expense is ${(Number(t.amount) / categoryAverages[t.category]).toFixed(1)}x higher than your usual average.`,
      }));

    return anomalies;
  }

  static async getBudgetAdherence(userId: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const budgets = await prisma.budget.findMany({
      where: { 
        userId,
        month: now.getMonth() + 1, // Prisma months are 1-indexed in our schema? Let's check seed/existing logic.
        year: now.getFullYear(),
      },
    });

    const expenses = await prisma.transaction.groupBy({
      by: ["category"],
      where: {
        userId,
        type: "expense",
        transactionDate: { gte: startOfMonth },
      },
      _sum: {
        amount: true,
      },
    });

    const expenseMap: Record<string, number> = {};
    expenses.forEach(e => {
      expenseMap[e.category] = Number(e._sum.amount || 0);
    });

    return budgets.map(b => {
      const spent = expenseMap[b.category] || 0;
      const limit = Number(b.monthlyLimit);
      return {
        category: b.category,
        limit,
        spent,
        percent: limit > 0 ? (spent / limit) * 100 : 0,
        remaining: Math.max(0, limit - spent),
        isOver: spent > limit,
      };
    });
  }
}
