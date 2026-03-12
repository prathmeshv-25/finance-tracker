import { NextResponse } from "next/server";
import { getAuthUser } from "@/services/authService";
import { savingsService } from "@/services/savingsService";

export async function GET() {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const goals = await savingsService.getGoals(user.userId);
    return NextResponse.json({ goals });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch savings goals" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();
    const goal = await savingsService.createGoal(user.userId, data);
    return NextResponse.json(goal);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create savings goal" }, { status: 500 });
  }
}
