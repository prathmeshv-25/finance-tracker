"use client";

import { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import {
  ArrowUpRight, ArrowDownRight, Pencil, Trash2, X, Check, Filter,
} from "lucide-react";
import clsx from "clsx";

interface Category { id: string; name: string; type: string; }
interface Transaction {
  id: string;
  amount: string;
  type: "income" | "expense";
  description: string | null;
  transactionDate: string;
  category: Category;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export default function HistoryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<"" | "income" | "expense">("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDesc, setEditDesc] = useState("");

  const buildQuery = useCallback(() => {
    const p = new URLSearchParams();
    if (filterType) p.set("type", filterType);
    if (filterCategory) p.set("categoryId", filterCategory);
    if (filterFrom) p.set("from", filterFrom);
    if (filterTo) p.set("to", filterTo);
    p.set("limit", "50");
    return p.toString();
  }, [filterType, filterCategory, filterFrom, filterTo]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [txRes, catRes] = await Promise.all([
        fetch(`/api/transactions?${buildQuery()}`),
        fetch("/api/categories"),
      ]);
      if (txRes.ok) {
        const data = await txRes.json();
        setTransactions(data.transactions);
      }
      if (catRes.ok) setCategories(await catRes.json());
    } finally { setLoading(false); }
  }, [buildQuery]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this transaction?")) return;
    const res = await fetch(`/api/transactions/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Transaction deleted");
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } else toast.error("Failed to delete");
  };

  const handleEditSave = async (t: Transaction) => {
    const res = await fetch(`/api/transactions/${t.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: editDesc }),
    });
    if (res.ok) {
      toast.success("Updated!");
      setTransactions((prev) => prev.map((tx) => tx.id === t.id ? { ...tx, description: editDesc } : tx));
      setEditingId(null);
    } else toast.error("Failed to update");
  };

  const clearFilters = () => {
    setFilterType(""); setFilterCategory(""); setFilterFrom(""); setFilterTo("");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-title">Transaction History</h1>
        <p className="text-text-secondary text-sm mt-1">{transactions.length} transaction{transactions.length !== 1 ? "s" : ""} found</p>
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-text-secondary" />
          <span className="text-sm font-medium text-text-secondary">Filters</span>
          <button onClick={clearFilters} className="ml-auto text-xs text-text-muted hover:text-primary transition-colors">Clear all</button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <select
            className="input-field text-sm"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as typeof filterType)}
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select
            className="input-field text-sm"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input
            type="date"
            className="input-field text-sm"
            value={filterFrom}
            onChange={(e) => setFilterFrom(e.target.value)}
            placeholder="From"
          />
          <input
            type="date"
            className="input-field text-sm"
            value={filterTo}
            onChange={(e) => setFilterTo(e.target.value)}
            placeholder="To"
          />
        </div>
      </div>

      {/* Transaction List */}
      <div className="glass-card divide-y divide-border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-16 text-text-secondary">
            <p className="text-lg font-medium">No transactions found</p>
            <p className="text-sm mt-1">Try adjusting your filters or add a new transaction.</p>
          </div>
        ) : (
          transactions.map((t) => (
            <div key={t.id} className="flex items-center gap-4 px-4 py-3.5 hover:bg-surface-2 transition-colors">
              {/* Icon */}
              <div className={clsx(
                "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0",
                t.type === "income" ? "bg-income/15" : "bg-expense/15"
              )}>
                {t.type === "income"
                  ? <ArrowUpRight className="w-4 h-4 text-income" />
                  : <ArrowDownRight className="w-4 h-4 text-expense" />
                }
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                {editingId === t.id ? (
                  <input
                    className="input-field text-sm py-1.5 px-2"
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    autoFocus
                  />
                ) : (
                  <p className="text-sm font-medium text-text-primary truncate">
                    {t.description || t.category.name}
                  </p>
                )}
                <p className="text-xs text-text-muted mt-0.5">
                  {t.category.name} · {format(new Date(t.transactionDate), "d MMM yyyy")}
                </p>
              </div>

              {/* Amount */}
              <span className={clsx("font-semibold text-sm flex-shrink-0", t.type === "income" ? "text-income" : "text-expense")}>
                {t.type === "income" ? "+" : "-"}{fmt(Number(t.amount))}
              </span>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                {editingId === t.id ? (
                  <>
                    <button onClick={() => handleEditSave(t)} className="p-1.5 text-income hover:bg-income/10 rounded-lg transition-colors" title="Save">
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={() => setEditingId(null)} className="p-1.5 text-text-muted hover:bg-surface-3 rounded-lg transition-colors" title="Cancel">
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => { setEditingId(t.id); setEditDesc(t.description ?? ""); }}
                      className="p-1.5 text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="p-1.5 text-text-muted hover:text-expense hover:bg-expense/10 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
