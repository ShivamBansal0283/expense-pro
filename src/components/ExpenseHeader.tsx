import { ChevronLeft, ChevronRight, IndianRupee, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MONTHS } from "@/lib/expense-types";

interface ExpenseHeaderProps {
  month: number;
  year: number;
  monthlyTotal: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export function ExpenseHeader({
  month,
  year,
  monthlyTotal,
  onPrevMonth,
  onNextMonth,
}: ExpenseHeaderProps) {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
            <IndianRupee className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">Expense Tracker</h1>
            <p className="text-xs text-muted-foreground">Daily expense management</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onPrevMonth} className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="min-w-[140px] text-center">
            <span className="text-sm font-semibold">{MONTHS[month]} {year}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onNextMonth} className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Monthly Total</p>
            <p className="text-lg font-bold font-mono text-primary">
              ₹{monthlyTotal.toLocaleString("en-IN")}
            </p>
          </div>
          <div>
            <Button variant="ghost" size="icon" onClick={() => { localStorage.removeItem('api_token'); localStorage.removeItem('expense-tracker-data'); window.location.href = '/'; }}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
