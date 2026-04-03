"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { DashboardSummary } from "@/types";
import { formatCurrency } from "@/utils/formatCurrency";
import { 
  Wallet, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Plus, 
  Sparkles, 
  AlertCircle, 
  Zap, 
  CheckCircle2,
  TrendingUp,
  Banknote
} from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { DashboardSkeleton } from "@/components/ui/Skeleton";
import dynamic from "next/dynamic";

// Optimization: Dynamic import for heavy chart component
const ExpenseChart = dynamic(() => import("@/components/dashboard/ExpenseChart").then(mod => mod.ExpenseChart), {
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-slate-50 animate-pulse rounded-3xl" />
});

const RecentTransactions = dynamic(() => import("@/components/dashboard/RecentTransactions").then(mod => mod.RecentTransactions), {
  ssr: false,
  loading: () => <div className="h-[200px] w-full bg-white rounded-3xl border border-slate-100 flex items-center justify-center text-slate-400 font-medium italic">Assembling ledger...</div>
});

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSummary = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard/summary", {
        // Cache for 60s on the client, revalidate in background
        next: { revalidate: 60 },
      } as any);
      if (res.ok) {
        const data = await res.json();
        setSummary(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  if (loading) {
    return (
      <AppLayout>
        <DashboardSkeleton />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-[1400px] mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight font-headline">Financial Overview</h1>
            <p className="text-slate-500 font-medium mt-1">Real-time ledger of your financial activities</p>
          </div>
          <div className="flex gap-3">
             <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-slate-50 transition-all">
                Filter
             </button>
             <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-slate-50 transition-all">
                Export
             </button>
          </div>
        </div>

        {/* Hero & Main Stats Section */}
        <div className="grid grid-cols-12 gap-8 mb-10">
          {/* Main Balance Card */}
          <div className="col-span-12 lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 p-8 rounded-3xl indigo-gradient text-white flex flex-col justify-between relative overflow-hidden group shadow-xl shadow-indigo-100 min-h-[240px]">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold uppercase tracking-widest opacity-80">Total Liquidity</p>
                    <Wallet className="opacity-60" size={20} />
                  </div>
                  <h2 className="text-5xl font-extrabold font-headline mb-8 tracking-tight">
                    {formatCurrency(summary?.totalBalance || 0)}
                  </h2>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold">
                      <TrendingUp size={14} />
                      +8.2% <span className="opacity-70 font-medium ml-1">vs last month</span>
                    </div>
                  </div>
                </div>
                {/* Decorative Element */}
                <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/15 transition-all duration-700"></div>
              </div>

              <div className="flex flex-col gap-6">
                {/* Monthly Income Stat */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 flex flex-col justify-between shadow-sm">
                  <div>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Monthly Income</p>
                    <h3 className="text-2xl font-bold font-headline text-slate-900">{formatCurrency(summary?.totalIncome || 0)}</h3>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1.5 uppercase">
                      <span>Stability</span>
                      <span className="text-emerald-500">Excellent</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[100%]"></div>
                    </div>
                  </div>
                </div>

                {/* Total Burn Stat */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 flex flex-col justify-between shadow-sm">
                  <div>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Total Burn</p>
                    <h3 className="text-2xl font-bold font-headline text-slate-900">{formatCurrency(summary?.totalExpense || 0)}</h3>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1.5 uppercase">
                      <span>Budget Utilization</span>
                      <span>{Math.round(((summary?.totalExpense || 0) / (summary?.totalIncome || 1)) * 100)}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-indigo-600 h-full" 
                        style={{ width: `${Math.min(100, Math.round(((summary?.totalExpense || 0) / (summary?.totalIncome || 1)) * 100))}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Smart Insights Section (Integrated) */}
            <div className="mt-8">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2 uppercase tracking-widest">
                <Sparkles className="text-indigo-600" size={16} />
                Smart Insights
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {summary?.insights && summary.insights.length > 0 ? (
                  summary.insights.map((insight: any, index: number) => {
                    const isWarning = insight.type === "warning";
                    const isAlert = insight.type === "alert";
                    
                    const bgColor = isAlert ? "bg-rose-50/50" : isWarning ? "bg-amber-50/50" : "bg-emerald-50/50";
                    const borderColor = isAlert ? "border-rose-100" : isWarning ? "border-amber-100" : "border-emerald-100";
                    const iconBg = isAlert ? "bg-rose-100" : isWarning ? "bg-amber-100" : "bg-emerald-100";
                    const iconColor = isAlert ? "text-rose-600" : isWarning ? "text-amber-600" : "text-emerald-600";
                    const textColor = isAlert ? "text-rose-900" : isWarning ? "text-amber-900" : "text-emerald-900";
                    const subTextColor = isAlert ? "text-rose-800" : isWarning ? "text-amber-800" : "text-emerald-800";
                    const Icon = isAlert ? AlertCircle : isWarning ? Zap : CheckCircle2;

                    return (
                      <div key={index} className={`${bgColor} border ${borderColor} p-5 rounded-2xl flex flex-col gap-3 transition-all hover:shadow-md`}>
                        <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center ${iconColor}`}>
                          <Icon size={16} />
                        </div>
                        <div>
                          <p className={`text-xs font-bold ${textColor} mb-1 leading-tight`}>{insight.title}</p>
                          <p className={`text-[11px] ${subTextColor} opacity-80 leading-relaxed`}>{insight.message}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-3 bg-slate-50 border border-slate-100 p-8 rounded-2xl text-center">
                    <p className="text-sm font-bold text-slate-400">Everything looks great! No critical alerts today.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Side: Allocation Chart */}
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 h-full flex flex-col shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-bold font-headline text-slate-900">Allocation</h3>
                  <p className="text-xs text-slate-500 font-medium">Monthly spending breakdown</p>
                </div>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center py-6">
                <ExpenseChart 
                  title="" 
                  data={summary?.categoryBreakdown || []} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Transactions Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                 <h3 className="font-bold text-slate-900">Recent Transactions</h3>
                 <Link href="/transactions" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">View Registry</Link>
              </div>
              <RecentTransactions 
                transactions={summary?.recentTransactions || []} 
              />
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            {/* Quick Budgets */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900 font-headline">Budget Control</h3>
                <Link href="/budgets" className="text-xs font-bold text-indigo-600">Configure</Link>
              </div>
              <div className="space-y-6">
                {summary?.budgets.slice(0, 3).map(budget => (
                  <div key={budget.id}>
                    <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                      <span>{budget.category}</span>
                      <span className="text-slate-900">{Math.round(((budget.spent || 0) / budget.monthlyLimit) * 100)}%</span>
                    </div>
                    <ProgressBar value={budget.spent || 0} max={budget.monthlyLimit} color="indigo" />
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Savings */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900 font-headline">Savings Goals</h3>
                <Link href="/savings" className="text-xs font-bold text-indigo-600">View All</Link>
              </div>
              <div className="space-y-6">
                {summary?.savingsGoals.slice(0, 2).map(goal => (
                  <div key={goal.id}>
                    <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                      <span>{goal.title}</span>
                      <span className="text-emerald-600">{Math.round((goal.currentAmount / goal.targetAmount) * 100)}%</span>
                    </div>
                    <ProgressBar value={goal.currentAmount} max={goal.targetAmount} color="emerald" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
