import { NextResponse } from "next/server";
import { getAuthUser } from "@/services/authService";
import { ImportService } from "@/services/importService";
import { notificationService } from "@/services/notificationService";

export async function POST(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { transactions } = await request.json();

    if (!transactions || !Array.isArray(transactions)) {
      return NextResponse.json({ error: "No transactions provided" }, { status: 400 });
    }

    // Convert string dates back to Date objects
    const formattedTransactions = transactions.map(t => ({
      ...t,
      date: new Date(t.date),
      amount: parseFloat(t.amount)
    }));

    await ImportService.saveImportedTransactions(user.userId, formattedTransactions);

    await notificationService.createNotification(
        user.userId,
        `Import system Alert: ${formattedTransactions.length} transactions processed and added successfully.`,
        "system"
    );

    return NextResponse.json({ message: "Transactions imported successfully" });
  } catch (error) {
    console.error("[POST /api/imports/confirm]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
