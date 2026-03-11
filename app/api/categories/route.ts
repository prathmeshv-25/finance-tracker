import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/services/db";
import { apiError } from "@/utils/api";

// GET /api/categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: [{ type: "asc" }, { name: "asc" }],
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("[GET /api/categories]", error);
    return apiError("Internal server error", 500);
  }
}
