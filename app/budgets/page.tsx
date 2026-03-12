"use client";

import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Budget } from "@/types";
import { BudgetCard } from "@/components/budgets/BudgetCard";
import { BudgetForm } from "@/components/budgets/BudgetForm";
import { Card } from "@/components/ui/Card";
import { getCurrentMonthInfo, getMonthName } from "@/utils/dateHelpers";

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const { month, year } = getCurrentMonthInfo();

  const fetchBudgets = async () => {
    try {
      const res = await fetch(`/api/budgets?month=${month}&year=${year}`);
      if (res.ok) {
        const data = await res.json();
        setBudgets(data.budgets);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Budgets</h1>
        <p className="text-slate-500 font-medium mt-1">Plan your spending for {getMonthName(month)} {year}.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading ? (
              <div className="col-span-2 py-12 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              </div>
            ) : budgets.length > 0 ? (
              budgets.map((budget) => (
                <BudgetCard key={budget.id} budget={budget} />
              ))
            ) : (
              <Card className="col-span-2 p-12 text-center text-slate-400 font-medium italic">
                No budgets set for this month.
              </Card>
            )}
          </div>
        </div>

        <div>
          <Card className="p-8 border-none shadow-2xl shadow-indigo-100 sticky top-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6 uppercase tracking-tight">Set Category Budget</h2>
            <BudgetForm onSuccess={fetchBudgets} />
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
