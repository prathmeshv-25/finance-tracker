"use client";

import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { ExpenseChart } from "@/components/dashboard/ExpenseChart";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { DashboardSummary } from "@/types";
import { formatCurrency } from "@/utils/formatCurrency";
import { Wallet, ArrowUpCircle, ArrowDownCircle, Plus } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSummary = async () => {
    try {
      const res = await fetch("/api/dashboard/summary");
      if (res.ok) {
        const data = await res.json();
        setSummary(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Financial Overview</h1>
          <p className="text-slate-500 font-medium mt-1">Welcome back! Here's what's happening with your money.</p>
        </div>
        <Link href="/transactions/add">
          <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-200">
            <Plus size={20} />
            Add Transaction
          </button>
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Total Balance" 
          value={formatCurrency(summary?.totalBalance || 0)} 
          icon={<Wallet size={24} />}
          className="border-b-4 border-b-indigo-500"
        />
        <StatCard 
          title="Total Income" 
          value={formatCurrency(summary?.totalIncome || 0)} 
          icon={<ArrowDownCircle size={24} className="text-emerald-500" />}
          trend={{ value: 12, isPositive: true }}
          className="border-b-4 border-b-emerald-500"
        />
        <StatCard 
          title="Total Expenses" 
          value={formatCurrency(summary?.totalExpense || 0)} 
          icon={<ArrowUpCircle size={24} className="text-rose-500" />}
          trend={{ value: 8, isPositive: false }}
          className="border-b-4 border-b-rose-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <ExpenseChart 
          title="Spending by Category" 
          data={summary?.categoryBreakdown || []} 
        />
        <RecentTransactions 
          transactions={summary?.recentTransactions || []} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Budget Quick View */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Active Budgets</h3>
            <Link href="/budgets" className="text-sm font-bold text-indigo-600">Manage</Link>
          </div>
          <div className="space-y-6">
            {summary?.budgets.length ? (
              summary.budgets.slice(0, 3).map(budget => (
                <div key={budget.id}>
                  <div className="flex justify-between text-sm font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                    <span>{budget.category}</span>
                    <span>{Math.round(((budget.spent || 0) / budget.monthlyLimit) * 100)}%</span>
                  </div>
                  <ProgressBar value={budget.spent || 0} max={budget.monthlyLimit} color="indigo" />
                </div>
              ))
            ) : (
              <p className="text-slate-400 py-4 text-center">No active budgets</p>
            )}
          </div>
        </Card>

        {/* Savings Quick View */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Savings Progress</h3>
            <Link href="/savings" className="text-sm font-bold text-indigo-600">View All</Link>
          </div>
          <div className="space-y-6">
            {summary?.savingsGoals.length ? (
              summary.savingsGoals.slice(0, 3).map(goal => (
                <div key={goal.id}>
                  <div className="flex justify-between text-sm font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                    <span>{goal.title}</span>
                    <span className="text-emerald-600 font-extrabold">{Math.round((goal.currentAmount / goal.targetAmount) * 100)}%</span>
                  </div>
                  <ProgressBar value={goal.currentAmount} max={goal.targetAmount} color="emerald" />
                </div>
              ))
            ) : (
              <p className="text-slate-400 py-4 text-center">No savings goals</p>
            )}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
