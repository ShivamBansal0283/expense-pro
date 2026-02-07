import { useState, useRef, useCallback } from "react";
import {
  MonthData,
  ExpenseCategory,
  EXPENSE_CATEGORIES,
  getDailyTotal,
  getCategoryTotal,
  getMonthlyTotal,
  CATEGORY_SHORT,
} from "@/lib/expense-types";

interface ExpenseTableProps {
  data: MonthData;
  onUpdateExpense: (day: number, category: ExpenseCategory, value: number) => void;
}

function ExpenseCell({
  value,
  onSave,
}: {
  value: number;
  onSave: (v: number) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [localVal, setLocalVal] = useState(value.toString());
  const inputRef = useRef<HTMLInputElement>(null);

  const handleBlur = useCallback(() => {
    setEditing(false);
    const num = parseInt(localVal) || 0;
    if (num !== value) onSave(num);
  }, [localVal, value, onSave]);

  const handleClick = () => {
    setEditing(true);
    setLocalVal(value === 0 ? "" : value.toString());
    setTimeout(() => inputRef.current?.select(), 0);
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        type="number"
        value={localVal}
        onChange={(e) => setLocalVal(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleBlur();
          if (e.key === "Escape") setEditing(false);
        }}
        className="expense-input"
        autoFocus
      />
    );
  }

  return (
    <div
      onClick={handleClick}
      className="text-right text-sm font-mono px-2 py-1.5 cursor-pointer rounded-md hover:bg-muted/50 transition-colors min-h-[32px] flex items-center justify-end"
    >
      {value > 0 ? (
        <span>{value}</span>
      ) : (
        <span className="text-muted-foreground/30">—</span>
      )}
    </div>
  );
}

export function ExpenseTable({ data, onUpdateExpense }: ExpenseTableProps) {
  return (
    <div className="bg-card rounded-xl border overflow-hidden animate-fade-in">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/30">
              <th className="text-left px-3 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground sticky left-0 bg-muted/30 z-10 w-14">
                Day
              </th>
              {EXPENSE_CATEGORIES.map((cat) => (
                <th
                  key={cat}
                  className="text-right px-2 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground whitespace-nowrap min-w-[80px]"
                >
                  {CATEGORY_SHORT[cat]}
                </th>
              ))}
              <th className="text-right px-3 py-3 font-bold text-xs uppercase tracking-wider text-primary min-w-[80px]">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {data.days.map((day) => {
              const total = getDailyTotal(day);
              return (
                <tr
                  key={day.day}
                  className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                >
                  <td className="px-3 py-0.5 font-medium text-muted-foreground sticky left-0 bg-card z-10 text-sm">
                    {day.day}
                  </td>
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <td key={cat} className="px-1 py-0.5">
                      <ExpenseCell
                        value={day.expenses[cat]}
                        onSave={(v) => onUpdateExpense(day.day, cat, v)}
                      />
                    </td>
                  ))}
                  <td className="px-3 py-0.5 text-right font-bold font-mono text-sm">
                    {total > 0 ? (
                      <span className="text-primary">₹{total.toLocaleString("en-IN")}</span>
                    ) : (
                      <span className="text-muted-foreground/30">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-muted/40 border-t-2 border-primary/20">
              <td className="px-3 py-3 font-bold text-xs uppercase tracking-wider sticky left-0 bg-muted/40 z-10">
                Total
              </td>
              {EXPENSE_CATEGORIES.map((cat) => {
                const catTotal = getCategoryTotal(data, cat);
                return (
                  <td key={cat} className="px-2 py-3 text-right font-bold font-mono text-sm">
                    {catTotal > 0 ? `₹${catTotal.toLocaleString("en-IN")}` : "—"}
                  </td>
                );
              })}
              <td className="px-3 py-3 text-right font-bold font-mono text-base text-primary">
                ₹{getMonthlyTotal(data).toLocaleString("en-IN")}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
