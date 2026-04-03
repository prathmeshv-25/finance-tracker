"use client";

import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SavingsGoal } from "@/types";
import { SavingsGoalCard } from "@/components/savings/SavingsGoalCard";
import { SavingsGoalForm } from "@/components/savings/SavingsGoalForm";
import { Card } from "@/components/ui/Card";
import { Plus, Target, TrendingUp } from "lucide-react";

export default function SavingsPage() {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGoals = async () => {
    try {
      const res = await fetch("/api/savings-goals");
      if (res.ok) {
        const data = await res.json();
        setGoals(data.goals);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProgress = async (id: string) => {
    const amount = prompt("Enter amount to add:");
    if (!amount || isNaN(parseFloat(amount))) return;

    try {
      const res = await fetch(`/api/savings-goals/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: parseFloat(amount) }),
      });
      if (res.ok) fetchGoals();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  return (
    <AppLayout>
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight font-headline">Capital Goals</h1>
            <p className="text-slate-500 font-medium mt-1">Strategic accumulation and wealth building</p>
          </div>
          <div className="flex gap-3">
             <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-50 transition-all">
                Active Goals
             </button>
             <button className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-emerald-100 transition-all">
                <Target size={18} /> Goal Simulator
             </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-10">
          <div className="col-span-12 lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {loading ? (
                <div className="col-span-2 py-20 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                </div>
              ) : goals.length > 0 ? (
                goals.map((goal) => (
                  <SavingsGoalCard 
                    key={goal.id} 
                    goal={goal} 
                    onAddProgress={handleAddProgress} 
                  />
                ))
              ) : (
                <div className="col-span-2 p-12 text-center bg-white rounded-3xl border border-slate-100 text-slate-400 font-medium italic">
                  No capital goals initiated yet.
                </div>
              )}
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                 <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <Plus size={20} />
                 </div>
                 <h2 className="text-xl font-bold text-slate-900 font-headline">New Capital Goal</h2>
              </div>
              <SavingsGoalForm onSuccess={fetchGoals} />

              <div className="mt-8 pt-8 border-t border-slate-100">
                 <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Investment Insight</h4>
                 <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-2xl flex items-start gap-3">
                    <TrendingUp className="text-emerald-600 shrink-0 mt-0.5" size={16} />
                    <p className="text-[11px] text-emerald-800 leading-relaxed font-medium">
                      Compounding works best with consistency. Automate your monthly contributions to reach goals 15% faster.
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
