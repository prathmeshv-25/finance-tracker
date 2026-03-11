"use client";

import { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import {
  TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import clsx from "clsx";

interface Summary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  recentTransactions: Transaction[];
  categories: Category[];
}

interface Transaction {
  id: string;
  amount: string;
  type: "income" | "expense";
  description: string | null;
  transactionDate: string;
  category: Category;
}

interface Category {
  id: string;
  name: string;
  type: string;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export default function DashboardPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSummary = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard/summary");
      if (res.ok) setSummary(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSummary(); }, [fetchSummary]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const stats = [
    {
      label: "Total Income",
      value: fmt(summary?.totalIncome ?? 0),
      icon: TrendingUp,
      gradient: "bg-income-gradient",
      glow: "shadow-glow-accent",
      change: "income",
    },
    {
      label: "Total Expenses",
      value: fmt(summary?.totalExpenses ?? 0),
      icon: TrendingDown,
      gradient: "bg-expense-gradient",
      glow: "",
      change: "expense",
    },
    {
      label: "Net Balance",
      value: fmt(summary?.balance ?? 0),
      icon: Wallet,
      gradient: "bg-primary-gradient",
      glow: "shadow-glow",
      change: (summary?.balance ?? 0) >= 0 ? "income" : "expense",
    },
  ];

  // Build simple chart data from recent transactions
  const chartData = (summary?.recentTransactions ?? [])
    .slice()
    .reverse()
    .map((t) => ({
      date: format(new Date(t.transactionDate), "d MMM"),
      amount: Number(t.amount),
      type: t.type,
    }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-title">Dashboard</h1>
        <p className="text-text-secondary text-sm mt-1">Your financial overview</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon, gradient, glow }) => (
          <div key={label} className="stat-card">
            <div className={`w-10 h-10 ${gradient} rounded-xl flex items-center justify-center ${glow}`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-text-secondary text-sm">{label}</p>
            <p className="text-2xl font-bold text-text-primary">{value}</p>
          </div>
        ))}
      </div>

      {/* Mini Chart */}
      {chartData.length > 1 && (
        <div className="glass-card p-5">
          <h2 className="section-title mb-4">Recent Activity</h2>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="amtGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6c63ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6c63ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a45" />
              <XAxis dataKey="date" tick={{ fill: "#9090bb", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#9090bb", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}`} />
              <Tooltip
                contentStyle={{ background: "#1a1a27", border: "1px solid #2a2a45", borderRadius: "12px", color: "#f0f0ff" }}
                formatter={(v: number) => [fmt(v), "Amount"]}
              />
              <Area type="monotone" dataKey="amount" stroke="#6c63ff" fill="url(#amtGrad)" strokeWidth={2} dot={{ fill: "#6c63ff", r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recent Transactions */}
      <div className="glass-card p-5">
        <h2 className="section-title mb-4">Recent Transactions</h2>
        {(summary?.recentTransactions ?? []).length === 0 ? (
          <div className="text-center py-10">
            <Wallet className="w-10 h-10 text-text-muted mx-auto mb-3" />
            <p className="text-text-secondary">No transactions yet.</p>
            <a href="/dashboard/add" className="text-primary text-sm hover:underline mt-1 inline-block">Add your first →</a>
          </div>
        ) : (
          <div className="space-y-2">
            {summary?.recentTransactions.map((t) => (
              <div key={t.id} className="flex items-center justify-between p-3 bg-surface-2 rounded-xl hover:bg-surface-3 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={clsx(
                    "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0",
                    t.type === "income" ? "bg-income/15" : "bg-expense/15"
                  )}>
                    {t.type === "income"
                      ? <ArrowUpRight className="w-4 h-4 text-income" />
                      : <ArrowDownRight className="w-4 h-4 text-expense" />
                    }
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{t.description || t.category.name}</p>
                    <p className="text-xs text-text-muted">{t.category.name} · {format(new Date(t.transactionDate), "d MMM yyyy")}</p>
                  </div>
                </div>
                <span className={clsx("font-semibold text-sm", t.type === "income" ? "text-income" : "text-expense")}>
                  {t.type === "income" ? "+" : "-"}{fmt(Number(t.amount))}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
