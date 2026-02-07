import {
  MonthData,
  EXPENSE_CATEGORIES,
  getCategoryTotal,
  getMonthlyTotal,
  getDailyTotal,
  CATEGORY_SHORT,
} from "@/lib/expense-types";
import {
  UtensilsCrossed,
  Car,
  ShoppingCart,
  Gamepad2,
  CreditCard,
  TrendingUp,
} from "lucide-react";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Food: <UtensilsCrossed className="h-4 w-4" />,
  "Travel to Office": <Car className="h-4 w-4" />,
  Grocery: <ShoppingCart className="h-4 w-4" />,
  Entertainment: <Gamepad2 className="h-4 w-4" />,
  Subscription: <CreditCard className="h-4 w-4" />,
};

interface StatCardsProps {
  data: MonthData;
}

export function StatCards({ data }: StatCardsProps) {
  const total = getMonthlyTotal(data);
  const activeDays = data.days.filter((d) => getDailyTotal(d) > 0).length;
  const avgPerDay = activeDays > 0 ? Math.round(total / activeDays) : 0;

  // Top 3 categories
  const catTotals = EXPENSE_CATEGORIES.map((cat) => ({
    category: cat,
    total: getCategoryTotal(data, cat),
  }))
    .filter((c) => c.total > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, 4);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      <div className="stat-card animate-fade-in">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          <span className="text-xs text-muted-foreground">Avg / Day</span>
        </div>
        <p className="text-xl font-bold font-mono">₹{avgPerDay.toLocaleString("en-IN")}</p>
        <p className="text-xs text-muted-foreground mt-1">{activeDays} active days</p>
      </div>

      <div className="stat-card animate-fade-in">
        <div className="flex items-center gap-2 mb-2">
          <CreditCard className="h-4 w-4 text-primary" />
          <span className="text-xs text-muted-foreground">Total</span>
        </div>
        <p className="text-xl font-bold font-mono text-primary">₹{total.toLocaleString("en-IN")}</p>
      </div>

      {catTotals.map((ct) => (
        <div key={ct.category} className="stat-card animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            {CATEGORY_ICONS[ct.category] ?? <CreditCard className="h-4 w-4 text-muted-foreground" />}
            <span className="text-xs text-muted-foreground">{CATEGORY_SHORT[ct.category]}</span>
          </div>
          <p className="text-lg font-bold font-mono">₹{ct.total.toLocaleString("en-IN")}</p>
          {total > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((ct.total / total) * 100)}%
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
