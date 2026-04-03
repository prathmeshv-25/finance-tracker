import { NextResponse } from "next/server";
import { ProfileService } from "@/services/profileService";
import { getAuthUser } from "@/services/authService";

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const profile = await ProfileService.getUserProfile(user.userId);
    return NextResponse.json(profile);
  } catch (error) {
    console.error("[GET /api/user/profile]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await request.json();
    const updatedProfile = await ProfileService.updateUserProfile(user.userId, data);
    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error("[PUT /api/user/profile]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
