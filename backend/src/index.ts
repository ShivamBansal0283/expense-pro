import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "./prisma";
import { z } from "zod";
import { requireAuth } from "./middleware/auth";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Auth: register
app.post("/api/auth/register", async (req, res) => {
  const schema = z.object({
    // allow either a strict email or a more permissive identifier (e.g. demo@local)
    email: z.union([z.string().email(), z.string().min(1)]),
    password: z.string().min(6),
    name: z.string().optional()
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    const msg = parsed.error.errors.map((e) => e.message).join("; ");
    return res.status(400).json({ error: msg });
  }
  const { email, password, name } = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(400).json({ error: "Email already in use" });
  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, password: hashed, name } });
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
});

// Auth: login
app.post("/api/auth/login", async (req, res) => {
  // login: accept either a strict email or permissive identifier for demo users
  const schema = z.object({ email: z.union([z.string().email(), z.string().min(1)]), password: z.string() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    const msg = parsed.error.errors.map((e) => e.message).join("; ");
    return res.status(400).json({ error: msg });
  }
  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
});

// Expenses CRUD (protected)
app.post("/api/expenses", requireAuth, async (req, res) => {
  const schema = z.object({ amount: z.number(), description: z.string().optional(), date: z.string(), categoryId: z.string().optional() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    const msg = parsed.error.errors.map((e) => e.message).join("; ");
    return res.status(400).json({ error: msg });
  }
  const { amount, description, date, categoryId } = parsed.data;
  const parsedDate = new Date(date);

  // Try to find existing expense for same user, date (exact match) and category
  const existing = await prisma.expense.findFirst({ where: { userId: req.userId, date: parsedDate, categoryId } });
  if (existing) {
    const updated = await prisma.expense.update({ where: { id: existing.id }, data: { amount, description } });
    return res.json(updated);
  }

  const expense = await prisma.expense.create({ data: { amount, description, date: parsedDate, userId: req.userId!, categoryId } });
  res.json(expense);
});

app.get("/api/expenses", requireAuth, async (req, res) => {
  const expenses = await prisma.expense.findMany({ where: { userId: req.userId }, orderBy: { date: "desc" } });
  res.json(expenses);
});

app.put("/api/expenses/:id", requireAuth, async (req, res) => {
  const id = req.params.id;
  const schema = z.object({ amount: z.number().optional(), description: z.string().optional(), date: z.string().optional(), categoryId: z.string().optional() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    const msg = parsed.error.errors.map((e) => e.message).join("; ");
    return res.status(400).json({ error: msg });
  }
  const expense = await prisma.expense.updateMany({ where: { id, userId: req.userId }, data: { ...parsed.data, date: parsed.data.date ? new Date(parsed.data.date) : undefined } });
  if (expense.count === 0) return res.status(404).json({ error: "Not found" });
  res.json({ success: true });
});

app.delete("/api/expenses/:id", requireAuth, async (req, res) => {
  const id = req.params.id;
  await prisma.expense.deleteMany({ where: { id, userId: req.userId } });
  res.json({ success: true });
});

// Categories
app.get("/api/categories", requireAuth, async (req, res) => {
  // Categories are global/fixed; return all categories
  const cats = await prisma.category.findMany();
  res.json(cats);
});

app.post("/api/categories", requireAuth, async (req, res) => {
  const schema = z.object({ name: z.string() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    const msg = parsed.error.errors.map((e) => e.message).join("; ");
    return res.status(400).json({ error: msg });
  }
  // Create a global category (no per-user categories)
  const cat = await prisma.category.create({ data: { name: parsed.data.name } });
  res.json(cat);
});

const PORT = Number(process.env.PORT || 4000);
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
