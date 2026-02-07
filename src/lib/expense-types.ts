export const EXPENSE_CATEGORIES = [
  "Food",
  "Travel to Office",
  "Travel from Office",
  "Misc Travelling",
  "Grocery",
  "Entertainment",
  "Subscription",
  "Misc Eating",
  "Misc Shopping",
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export interface DailyExpense {
  day: number;
  expenses: Record<ExpenseCategory, number>;
}

export interface MonthData {
  month: number; // 0-11
  year: number;
  days: DailyExpense[];
}

export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  "Food": "hsl(var(--chart-food))",
  "Travel to Office": "hsl(var(--chart-travel))",
  "Travel from Office": "hsl(210, 60%, 70%)",
  "Misc Travelling": "hsl(200, 50%, 50%)",
  "Grocery": "hsl(var(--chart-grocery))",
  "Entertainment": "hsl(var(--chart-entertainment))",
  "Subscription": "hsl(var(--chart-subscription))",
  "Misc Eating": "hsl(var(--chart-misc))",
  "Misc Shopping": "hsl(330, 60%, 55%)",
};

export const CATEGORY_SHORT: Record<ExpenseCategory, string> = {
  "Food": "Food",
  "Travel to Office": "To Office",
  "Travel from Office": "From Office",
  "Misc Travelling": "Misc Travel",
  "Grocery": "Grocery",
  "Entertainment": "Fun",
  "Subscription": "Subs",
  "Misc Eating": "Misc Eat",
  "Misc Shopping": "Misc Shop",
};

export function getDaysInMonth(month: number, year: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function createEmptyMonth(month: number, year: number): MonthData {
  const numDays = getDaysInMonth(month, year);
  const days: DailyExpense[] = [];
  for (let d = 1; d <= numDays; d++) {
    const expenses = {} as Record<ExpenseCategory, number>;
    EXPENSE_CATEGORIES.forEach((cat) => (expenses[cat] = 0));
    days.push({ day: d, expenses });
  }
  return { month, year, days };
}

export function getDailyTotal(day: DailyExpense): number {
  return Object.values(day.expenses).reduce((sum, v) => sum + v, 0);
}

export function getMonthlyTotal(data: MonthData): number {
  return data.days.reduce((sum, d) => sum + getDailyTotal(d), 0);
}

export function getCategoryTotal(data: MonthData, category: ExpenseCategory): number {
  return data.days.reduce((sum, d) => sum + d.expenses[category], 0);
}

export function formatCurrency(amount: number): string {
  if (amount === 0) return "—";
  return `₹${amount.toLocaleString("en-IN")}`;
}
