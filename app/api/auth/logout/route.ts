import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/services/authService";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out" });
  response.cookies.set(clearAuthCookie());
  return response;
}
