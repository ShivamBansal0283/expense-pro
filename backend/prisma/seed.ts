import dotenv from "dotenv";
dotenv.config();

import prisma from "../src/prisma";
import bcrypt from "bcrypt";

async function main() {
  const pass = await bcrypt.hash("password123", 10);
  const user = await prisma.user.upsert({
    where: { email: "demo@local" },
    update: {},
    create: { email: "demo@local", password: pass, name: "Demo User" }
  });

  // Create all the categories from frontend
  const categories = [
    "Food",
    "Travel to Office",
    "Travel from Office",
    "Misc Travelling",
    "Grocery",
    "Entertainment",
    "Subscription",
    "Misc Eating",
    "Misc Shopping",
  ];

  const createdCats = [];
  for (let i = 0; i < categories.length; i++) {
    const catName = categories[i];
    const cat = await prisma.category.upsert({
      where: { id: `cat-${i}` }, // Use fixed ID for upsert
      update: {},
      create: { id: `cat-${i}`, name: catName }
    });
    createdCats.push(cat);
  }

  // Create some sample expenses
  if (createdCats.length > 0) {
    await prisma.expense.createMany({
      data: [
        { amount: 12.5, description: "Lunch", date: new Date(), userId: user.id, categoryId: createdCats[0].id }, // Food
        { amount: 45.0, description: "Taxi fare", date: new Date(), userId: user.id, categoryId: createdCats[1].id }, // Travel to Office
        { amount: 50.0, description: "Groceries", date: new Date(), userId: user.id, categoryId: createdCats[4].id }, // Grocery
      ]
    });
  }

  console.log("Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
