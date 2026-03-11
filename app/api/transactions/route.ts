import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/services/db";
import { requireAuth, apiError } from "@/utils/api";
import { z } from "zod";

const transactionSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  categoryId: z.string().uuid("Invalid category"),
  type: z.enum(["income", "expense"]),
  description: z.string().optional(),
  transactionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
});

// GET /api/transactions
export async function GET(req: NextRequest) {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;

  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get("categoryId");
  const type = searchParams.get("type") as "income" | "expense" | null;
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "20");

  const where: Record<string, unknown> = { userId: auth.user.userId };
  if (categoryId) where.categoryId = categoryId;
  if (type) where.type = type;
  if (from || to) {
    where.transactionDate = {
      ...(from ? { gte: new Date(from) } : {}),
      ...(to ? { lte: new Date(to) } : {}),
    };
  }

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      include: { category: true },
      orderBy: { transactionDate: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.transaction.count({ where }),
  ]);

  return NextResponse.json({ transactions, total, page, limit });
}

// POST /api/transactions
export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;

  try {
    const body = await req.json();
    const result = transactionSchema.safeParse(body);
    if (!result.success) return apiError(result.error.errors[0].message);

    const { amount, categoryId, type, description, transactionDate } = result.data;

    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) return apiError("Category not found", 404);

    const transaction = await prisma.transaction.create({
      data: {
        userId: auth.user.userId,
        amount,
        categoryId,
        type,
        description,
        transactionDate: new Date(transactionDate),
      },
      include: { category: true },
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error("[POST /api/transactions]", error);
    return apiError("Internal server error", 500);
  }
}
