import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/services/db";
import { apiError } from "@/utils/api";

const CATEGORIES = [
  { id: "Food", name: "Food", type: "expense" },
  { id: "Transport", name: "Transport", type: "expense" },
  { id: "Shopping", name: "Shopping", type: "expense" },
  { id: "Bills", name: "Bills", type: "expense" },
  { id: "Entertainment", name: "Entertainment", type: "expense" },
  { id: "Health", name: "Health", type: "expense" },
  { id: "Salary", name: "Salary", type: "income" },
  { id: "Freelance", name: "Freelance", type: "income" },
  { id: "Investment", name: "Investment", type: "income" },
  { id: "Gifts", name: "Gifts", type: "income" },
  { id: "Other", name: "Other", type: "both" },
];

// GET /api/categories
export async function GET() {
  return NextResponse.json(CATEGORIES);
}
