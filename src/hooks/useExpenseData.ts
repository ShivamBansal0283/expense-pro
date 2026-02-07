import { useState, useCallback, useEffect } from "react";
import {
  MonthData,
  ExpenseCategory,
  createEmptyMonth,
  EXPENSE_CATEGORIES,
} from "@/lib/expense-types";

const STORAGE_KEY = "expense-tracker-data";

// Sample data from the uploaded spreadsheet (January)
function getSampleData(): Record<string, MonthData> {
  const jan = createEmptyMonth(0, 2025);
  const sampleEntries: Record<number, Partial<Record<ExpenseCategory, number>>> = {
    15: { Grocery: 354 },
    16: { Food: 155, "Travel to Office": 60, "Travel from Office": 58 },
    17: { Food: 610 },
    18: { Food: 384 },
    19: { Food: 154, "Travel to Office": 52, "Travel from Office": 67 },
    20: { Food: 196, "Travel to Office": 65, "Travel from Office": 50 },
    21: { Food: 174, "Travel to Office": 80, "Travel from Office": 59 },
    22: { Food: 115, "Travel to Office": 62, "Travel from Office": 39 },
    23: { Food: 174, "Travel to Office": 65, "Travel from Office": 35, "Misc Shopping": 130 },
    24: { Food: 383, Grocery: 223 },
    25: { Food: 458, "Misc Travelling": 60, "Misc Eating": 50, "Misc Shopping": 141 },
    26: { Food: 305, "Misc Shopping": 102 },
    27: { "Travel to Office": 66, "Travel from Office": 45, "Misc Travelling": 59 },
    28: { Food: 156, "Travel to Office": 70 },
    29: { Food: 153, "Travel to Office": 65, "Travel from Office": 82, Grocery: 314 },
    30: { Food: 424, "Travel to Office": 61, "Travel from Office": 57, "Misc Travelling": 38 },
    31: { Food: 283, "Misc Travelling": 202, "Misc Eating": 190, "Misc Shopping": 200 },
  };

  Object.entries(sampleEntries).forEach(([day, cats]) => {
    const idx = parseInt(day) - 1;
    if (jan.days[idx]) {
      Object.entries(cats).forEach(([cat, val]) => {
        jan.days[idx].expenses[cat as ExpenseCategory] = val as number;
      });
    }
  });

  const feb = createEmptyMonth(1, 2025);
  const febEntries: Record<number, Partial<Record<ExpenseCategory, number>>> = {
    1: { Food: 283, Grocery: 106 },
    2: { Food: 153, "Travel to Office": 74, "Travel from Office": 42, "Misc Eating": 197 },
    3: { Food: 128, "Travel to Office": 62, "Travel from Office": 46 },
    4: { Food: 142, "Travel to Office": 69, "Travel from Office": 65 },
    5: { Food: 283, "Travel to Office": 57, "Travel from Office": 63 },
    6: { Food: 307, "Travel to Office": 60, "Travel from Office": 160 },
    7: { Food: 306 },
  };

  Object.entries(febEntries).forEach(([day, cats]) => {
    const idx = parseInt(day) - 1;
    if (feb.days[idx]) {
      Object.entries(cats).forEach(([cat, val]) => {
        feb.days[idx].expenses[cat as ExpenseCategory] = val as number;
      });
    }
  });

  return {
    "2025-0": jan,
    "2025-1": feb,
  };
}

function getKey(month: number, year: number) {
  return `${year}-${month}`;
}

export function useExpenseData() {
  const [allData, setAllData] = useState<Record<string, MonthData>>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // ignore
      }
    }
    return getSampleData();
  });

  const [currentMonth, setCurrentMonth] = useState(() => new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
  }, [allData]);

  const currentData = allData[getKey(currentMonth, currentYear)] ?? createEmptyMonth(currentMonth, currentYear);

  const updateExpense = useCallback(
    (day: number, category: ExpenseCategory, value: number) => {
      const key = getKey(currentMonth, currentYear);
      setAllData((prev) => {
        const existing = prev[key] ?? createEmptyMonth(currentMonth, currentYear);
        const newDays = existing.days.map((d) =>
          d.day === day
            ? { ...d, expenses: { ...d.expenses, [category]: value } }
            : d
        );
        return { ...prev, [key]: { ...existing, days: newDays } };
      });
    },
    [currentMonth, currentYear]
  );

  const goToPrevMonth = useCallback(() => {
    setCurrentMonth((m) => {
      if (m === 0) {
        setCurrentYear((y) => y - 1);
        return 11;
      }
      return m - 1;
    });
  }, []);

  const goToNextMonth = useCallback(() => {
    setCurrentMonth((m) => {
      if (m === 11) {
        setCurrentYear((y) => y + 1);
        return 0;
      }
      return m + 1;
    });
  }, []);

  return {
    currentData,
    currentMonth,
    currentYear,
    updateExpense,
    goToPrevMonth,
    goToNextMonth,
    setCurrentMonth,
    setCurrentYear,
    allData,
  };
}
