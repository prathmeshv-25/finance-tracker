import { NextResponse } from "next/server";
import { getAuthUser } from "@/services/authService";
import { subscriptionService } from "@/services/subscriptionService";

export async function GET() {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const subscriptions = await subscriptionService.getSubscriptions(user.userId);
    return NextResponse.json({ subscriptions });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch subscriptions" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();
    const sub = await subscriptionService.createSubscription(user.userId, data);
    return NextResponse.json(sub);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 });
  }
}
