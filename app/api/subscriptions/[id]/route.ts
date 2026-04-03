import { NextResponse } from "next/server";
import { getAuthUser } from "@/services/authService";
import { subscriptionService } from "@/services/subscriptionService";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();
    const sub = await subscriptionService.updateSubscription(params.id, user.userId, data);
    return NextResponse.json(sub);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update subscription" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await subscriptionService.deleteSubscription(params.id, user.userId);
    return NextResponse.json({ message: "Subscription deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete subscription" }, { status: 500 });
  }
}
