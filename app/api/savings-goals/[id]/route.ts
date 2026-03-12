import { NextResponse } from "next/server";
import { getAuthUser } from "@/services/authService";
import { savingsService } from "@/services/savingsService";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { amount } = await req.json();
    const goal = await savingsService.updateSavingsProgress(params.id, user.userId, amount);
    return NextResponse.json(goal);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update savings goal" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await savingsService.deleteGoal(params.id, user.userId);
    return NextResponse.json({ message: "Savings goal deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete savings goal" }, { status: 500 });
  }
}
