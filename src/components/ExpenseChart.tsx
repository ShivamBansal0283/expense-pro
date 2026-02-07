import {
  MonthData,
  EXPENSE_CATEGORIES,
  getCategoryTotal,
  getDailyTotal,
  CATEGORY_SHORT,
  CATEGORY_COLORS,
} from "@/lib/expense-types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface ExpenseChartProps {
  data: MonthData;
}

export function ExpenseChart({ data }: ExpenseChartProps) {
  // Category breakdown for pie chart
  const pieData = EXPENSE_CATEGORIES.map((cat) => ({
    name: CATEGORY_SHORT[cat],
    value: getCategoryTotal(data, cat),
    color: CATEGORY_COLORS[cat],
  })).filter((d) => d.value > 0);

  // Daily totals for bar chart
  const barData = data.days
    .map((d) => ({
      day: d.day,
      total: getDailyTotal(d),
    }))
    .filter((d) => d.total > 0);

  if (pieData.length === 0) {
    return (
      <div className="bg-card rounded-xl border p-8 text-center text-muted-foreground">
        No expenses recorded this month. Click on cells to add expenses.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Daily Bar Chart */}
      <div className="bg-card rounded-xl border p-4 animate-fade-in">
        <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider">
          Daily Spending
        </h3>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                tickFormatter={(v) => `₹${v}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={(value: number) => [`₹${value.toLocaleString("en-IN")}`, "Total"]}
                labelFormatter={(label) => `Day ${label}`}
              />
              <Bar
                dataKey="total"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
                maxBarSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Pie Chart */}
      <div className="bg-card rounded-xl border p-4 animate-fade-in">
        <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider">
          Category Breakdown
        </h3>
        <div className="h-[220px] flex items-center">
          <div className="w-1/2 h-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  formatter={(value: number) => [`₹${value.toLocaleString("en-IN")}`]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-1/2 space-y-1.5">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center gap-2 text-xs">
                <div
                  className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: d.color }}
                />
                <span className="text-muted-foreground truncate">{d.name}</span>
                <span className="ml-auto font-mono font-medium">
                  ₹{d.value.toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
