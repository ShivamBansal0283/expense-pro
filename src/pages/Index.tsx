import { ExpenseHeader } from "@/components/ExpenseHeader";
import { StatCards } from "@/components/StatCards";
import { ExpenseTable } from "@/components/ExpenseTable";
import { ExpenseChart } from "@/components/ExpenseChart";
import { useExpenseData } from "@/hooks/useExpenseData";
import { getMonthlyTotal } from "@/lib/expense-types";

const Index = () => {
  const {
    currentData,
    currentMonth,
    currentYear,
    updateExpense,
    goToPrevMonth,
    goToNextMonth,
  } = useExpenseData();

  return (
    <div className="min-h-screen bg-background">
      <ExpenseHeader
        month={currentMonth}
        year={currentYear}
        monthlyTotal={getMonthlyTotal(currentData)}
        onPrevMonth={goToPrevMonth}
        onNextMonth={goToNextMonth}
      />

      <main className="container mx-auto px-4 py-6 space-y-6">
        <StatCards data={currentData} />
        <ExpenseChart data={currentData} />
        <ExpenseTable data={currentData} onUpdateExpense={updateExpense} />
      </main>
    </div>
  );
};

export default Index;
