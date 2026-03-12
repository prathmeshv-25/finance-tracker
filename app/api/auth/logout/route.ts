import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/services/authService";

export async function POST() {
  clearAuthCookie();
  return NextResponse.json({ message: "Logged out" });
}
