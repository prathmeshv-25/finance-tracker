import { NextResponse } from "next/server";
import { recurringService } from "@/services/recurringService";
import { getAuthUser } from "@/services/authService";

export async function GET(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const items = await recurringService.getRecurringTransactions(user.userId);
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await request.json();
    const item = await recurringService.createRecurringTransaction(user.userId, data);
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
