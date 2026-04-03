import { NextResponse } from "next/server";
import { notificationService } from "@/services/notificationService";
import { getAuthUser } from "@/services/authService";
import { subscriptionService } from "@/services/subscriptionService";
import { reminderService } from "@/services/reminderService";
import { transactionService } from "@/services/transactionService";

export async function GET(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const notifications = await notificationService.getNotifications(user.userId);

    // Trigger lazy background checks (don't await them to keep API responsive)
    subscriptionService.checkAndNotifyUpcomingSubscriptions(user.userId).catch(console.error);
    reminderService.processDueReminders(user.userId).catch(console.error);
    transactionService.checkLowBalanceAlert(user.userId).catch(console.error);

    return NextResponse.json(notifications);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id, markAll } = await request.json();

    if (markAll) {
      await notificationService.markAllAsRead(user.userId);
      return NextResponse.json({ success: true });
    }

    if (id) {
      await notificationService.markAsRead(id, user.userId);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
