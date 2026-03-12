import { NextResponse } from "next/server";
import { getAuthUser } from "@/services/authService";
import { budgetService } from "@/services/budgetService";
import { getCurrentMonthInfo } from "@/utils/dateHelpers";

export async function GET(req: Request) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const now = getCurrentMonthInfo();
  const month = parseInt(searchParams.get("month") || now.month.toString());
  const year = parseInt(searchParams.get("year") || now.year.toString());

  try {
    const budgets = await budgetService.getBudgets(user.userId, month, year);
    return NextResponse.json({ budgets });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch budgets" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();
    const budget = await budgetService.createBudget(user.userId, data);
    return NextResponse.json(budget);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create budget" }, { status: 500 });
  }
}
