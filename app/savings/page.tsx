"use client";

import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SavingsGoal } from "@/types";
import { SavingsGoalCard } from "@/components/savings/SavingsGoalCard";
import { SavingsGoalForm } from "@/components/savings/SavingsGoalForm";
import { Card } from "@/components/ui/Card";

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
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Savings Goals</h1>
        <p className="text-slate-500 font-medium mt-1">Track your progress toward your financial dreams.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading ? (
              <div className="col-span-2 py-12 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
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
              <Card className="col-span-2 p-12 text-center text-slate-400 font-medium italic">
                No savings goals created yet.
              </Card>
            )}
          </div>
        </div>

        <div>
          <Card className="p-8 border-none shadow-2xl shadow-emerald-100 sticky top-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6 uppercase tracking-tight">Create New Goal</h2>
            <SavingsGoalForm onSuccess={fetchGoals} />
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
