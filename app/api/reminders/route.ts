import { NextResponse } from "next/server";
import { reminderService } from "@/services/reminderService";
import { getAuthUser } from "@/services/authService";

export async function GET(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const upcoming = searchParams.get("upcoming");

    if (upcoming) {
      const reminders = await reminderService.getUpcomingReminders(user.userId, parseInt(upcoming) || 7);
      return NextResponse.json(reminders);
    }

    const reminders = await reminderService.getUserReminders(user.userId);
    return NextResponse.json(reminders);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await request.json();
    const reminder = await reminderService.createReminder(user.userId, data);
    return NextResponse.json(reminder);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await request.json();
    await reminderService.markReminderComplete(id, user.userId);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
