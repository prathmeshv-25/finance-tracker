import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding categories...");

  const categories = [
    // Income
    { name: "Salary", type: "income" as const },
    { name: "Freelance", type: "income" as const },
    { name: "Investments", type: "income" as const },
    { name: "Other Income", type: "income" as const },
    // Expense
    { name: "Food & Dining", type: "expense" as const },
    { name: "Transport", type: "expense" as const },
    { name: "Bills & Utilities", type: "expense" as const },
    { name: "Entertainment", type: "expense" as const },
    { name: "Shopping", type: "expense" as const },
    { name: "Healthcare", type: "expense" as const },
    { name: "Education", type: "expense" as const },
    { name: "Other Expense", type: "expense" as const },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
  }

  console.log("✅ Seeded", categories.length, "categories");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
