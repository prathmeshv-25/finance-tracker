import { NextResponse } from "next/server";
import { getAuthUser } from "@/services/authService";
import { budgetService } from "@/services/budgetService";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await budgetService.deleteBudget(params.id, user.userId);
    return NextResponse.json({ message: "Budget deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete budget" }, { status: 500 });
  }
}
