import { MonthData, ExpenseCategory, createEmptyMonth } from "./expense-types";

type RemoteExpense = { id: string; amount: number; description?: string | null; date: string; categoryId?: string | null };
type RemoteCategory = { id: string; name: string };

function ensureMonth(map: Record<string, MonthData>, date: Date) {
  const key = `${date.getFullYear()}-${date.getMonth()}`;
  if (!map[key]) map[key] = createEmptyMonth(date.getMonth(), date.getFullYear());
  return { key, month: map[key] };
}

export function mapRemoteToMonthData(expenses: RemoteExpense[], categories: RemoteCategory[]) {
  const map: Record<string, MonthData> = {};
  const catById: Record<string, string> = {};
  categories.forEach((c) => (catById[c.id] = c.name));

  expenses.forEach((e) => {
    const d = new Date(e.date);
    const { month } = ensureMonth(map, d);
    const dayIndex = d.getDate() - 1;
    const catName = e.categoryId ? catById[e.categoryId] ?? "Uncategorized" : "Uncategorized";
    const prev = month.days[dayIndex].expenses[catName as ExpenseCategory] ?? 0;
    month.days[dayIndex].expenses[catName as ExpenseCategory] = prev + e.amount;
  });

  return map;
}
