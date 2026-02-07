"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const prisma_1 = __importDefault(require("../src/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
async function main() {
    const pass = await bcrypt_1.default.hash("password123", 10);
    const user = await prisma_1.default.user.upsert({
        where: { email: "demo@local" },
        update: {},
        create: { email: "demo@local", password: pass, name: "Demo User" }
    });
    const cat = await prisma_1.default.category.upsert({
        where: { id: "demo-cat-1" },
        update: {},
        create: { id: "demo-cat-1", name: "General", userId: user.id }
    });
    await prisma_1.default.expense.createMany({
        data: [
            { amount: 12.5, description: "Lunch", date: new Date(), userId: user.id, categoryId: cat.id },
            { amount: 45.0, description: "Office supplies", date: new Date(), userId: user.id, categoryId: cat.id }
        ]
    });
    console.log("Seed complete");
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma_1.default.$disconnect();
});
