import { NextResponse } from "next/server";
import { getAuthUser } from "@/services/authService";
import { transactionService } from "@/services/transactionService";

export async function GET(req: Request) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const filters = {
    category: searchParams.get("category") || undefined,
    type: searchParams.get("type") || undefined,
    startDate: searchParams.get("startDate") || undefined,
    endDate: searchParams.get("endDate") || undefined,
    minAmount: searchParams.get("minAmount") ? parseFloat(searchParams.get("minAmount")!) : undefined,
    maxAmount: searchParams.get("maxAmount") ? parseFloat(searchParams.get("maxAmount")!) : undefined,
  };

  try {
    const transactions = await transactionService.getUserTransactions(user.userId, filters);
    return NextResponse.json({ transactions });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();
    const transaction = await transactionService.createTransaction(user.userId, data);
    return NextResponse.json(transaction);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 });
  }
}
