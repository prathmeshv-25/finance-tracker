"use client";

import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Budget } from "@/types";
import { BudgetCard } from "@/components/budgets/BudgetCard";
import { BudgetForm } from "@/components/budgets/BudgetForm";
import { Card } from "@/components/ui/Card";
import { getCurrentMonthInfo, getMonthName } from "@/utils/dateHelpers";
import { PieChart, Plus } from "lucide-react";

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
  }, [month, year]); // Added month and year dependency

  return (
    <AppLayout>
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight font-headline">Budget Control</h1>
            <p className="text-slate-500 font-medium mt-1">Allocation strategies for {getMonthName(month)} {year}</p>
          </div>
          <div className="flex gap-3">
             <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-50 transition-all">
                Previous Month
             </button>
             <button className="indigo-gradient text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-indigo-100">
                <PieChart size={18} /> View Analytics
             </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-10">
          <div className="col-span-12 lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {loading ? (
                <div className="col-span-2 py-20 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                </div>
              ) : budgets.length > 0 ? (
                budgets.map((budget) => (
                  <BudgetCard key={budget.id} budget={budget} />
                ))
              ) : (
                <div className="col-span-2 p-12 text-center bg-white rounded-3xl border border-slate-100 text-slate-400 font-medium italic">
                  No budget allocations defined for this period.
                </div>
              )}
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                 <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Plus size={20} />
                 </div>
                 <h2 className="text-xl font-bold text-slate-900 font-headline">New Allocation</h2>
              </div>
              <BudgetForm onSuccess={fetchBudgets} />
              
              <div className="mt-8 pt-8 border-t border-slate-100">
                 <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Budgeting Tip</h4>
                 <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-2xl">
                    <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                      The 50/30/20 rule: Allocate 50% to needs, 30% to wants, and 20% to savings or debt.
                    </p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
