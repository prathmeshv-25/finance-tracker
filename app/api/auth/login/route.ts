import { NextResponse } from "next/server";
import { comparePassword, signToken, setAuthCookie } from "@/services/authService";
import { notificationService } from "@/services/notificationService";
import { prisma } from "@/services/db";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await comparePassword(password, user.passwordHash))) {
      if (user) {
        try {
            await notificationService.createNotification(
                user.id,
                "Security Alert: A failed login attempt was detected for your account.",
                "system"
            );
        } catch {}
      }
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    try {
        await notificationService.createNotification(
            user.id,
            "Security Alert: New successful login detected.",
            "system"
        );
    } catch {}

    const token = await signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    await setAuthCookie(token);

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
