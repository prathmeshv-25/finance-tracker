const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: "Food", type: "expense" },
    { name: "Transport", type: "expense" },
    { name: "Shopping", type: "expense" },
    { name: "Bills", type: "expense" },
    { name: "Salary", type: "income" },
    { name: "Other", type: "both" },
  ];

  console.log("Seeding categories...");

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: { type: cat.type },
      create: cat,
    });
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
