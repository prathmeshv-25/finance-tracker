import { NextResponse } from "next/server";
import { getAuthUser, changePassword, logoutAllSessions, clearAuthCookie } from "@/services/authService";

export async function POST(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { action, currentPassword, newPassword } = await request.json();

    if (action === "change-password") {
      try {
        await changePassword(user.userId, currentPassword, newPassword);
        return NextResponse.json({ message: "Password updated successfully" });
      } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 400 });
      }
    }

    if (action === "logout-all") {
      await logoutAllSessions(user.userId);
      clearAuthCookie(); // Optional: also log out current session
      return NextResponse.json({ message: "All sessions invalidated" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("[POST /api/user/security]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
