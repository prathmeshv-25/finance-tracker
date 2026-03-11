import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/services/db";
import { requireAuth, apiError } from "@/utils/api";
import { z } from "zod";

const updateSchema = z.object({
  amount: z.number().positive().optional(),
  categoryId: z.string().uuid().optional(),
  type: z.enum(["income", "expense"]).optional(),
  description: z.string().optional(),
  transactionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

// PUT /api/transactions/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;

  try {
    const existing = await prisma.transaction.findFirst({
      where: { id: params.id, userId: auth.user.userId },
    });
    if (!existing) return apiError("Transaction not found", 404);

    const body = await req.json();
    const result = updateSchema.safeParse(body);
    if (!result.success) return apiError(result.error.errors[0].message);

    const data = result.data;
    const updated = await prisma.transaction.update({
      where: { id: params.id },
      data: {
        ...(data.amount !== undefined && { amount: data.amount }),
        ...(data.categoryId && { categoryId: data.categoryId }),
        ...(data.type && { type: data.type }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.transactionDate && { transactionDate: new Date(data.transactionDate) }),
      },
      include: { category: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[PUT /api/transactions/[id]]", error);
    return apiError("Internal server error", 500);
  }
}

// DELETE /api/transactions/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;

  try {
    const existing = await prisma.transaction.findFirst({
      where: { id: params.id, userId: auth.user.userId },
    });
    if (!existing) return apiError("Transaction not found", 404);

    await prisma.transaction.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Transaction deleted" });
  } catch (error) {
    console.error("[DELETE /api/transactions/[id]]", error);
    return apiError("Internal server error", 500);
  }
}
