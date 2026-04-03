"use client";

import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Transaction } from "@/types";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/dateHelpers";
import { 
  Trash2, 
  ShoppingBag, 
  Utensils, 
  Car, 
  Receipt, 
  Briefcase, 
  HelpCircle, 
  Plus,
  Filter,
  Download,
  Pencil
} from "lucide-react";
import Link from "next/link";

const iconMap: Record<string, any> = {
  Shopping: ShoppingBag,
  Food: Utensils,
  Transport: Car,
  Bills: Receipt,
  Salary: Briefcase,
  Other: HelpCircle,
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter State
  const [filters, setFilters] = useState({
    category: "",
    type: "",
    startDate: "",
    endDate: "",
    minAmount: "",
    maxAmount: "",
  });

  const categories = ["Food", "Transport", "Shopping", "Bills", "Entertainment", "Health", "Salary", "Freelance", "Investment", "Gifts", "Other"];

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (filters.category) query.append("category", filters.category);
      if (filters.type) query.append("type", filters.type);
      if (filters.startDate) query.append("startDate", filters.startDate);
      if (filters.endDate) query.append("endDate", filters.endDate);
      if (filters.minAmount) query.append("minAmount", filters.minAmount);
      if (filters.maxAmount) query.append("maxAmount", filters.maxAmount);

      const res = await fetch(`/api/transactions?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setTransactions(data.transactions);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/transactions/${id}`, { method: "DELETE" });
      if (res.ok) fetchTransactions();
    } catch (error) {
      console.error(error);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetFilters = () => {
    setFilters({
      category: "",
      type: "",
      startDate: "",
      endDate: "",
      minAmount: "",
      maxAmount: "",
    });
  };

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  return (
    <AppLayout>
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight font-headline">Transaction Registry</h1>
            <p className="text-slate-500 font-medium mt-1">Real-time ledger of your financial activities</p>
          </div>
          <div className="flex gap-3">
             <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all border ${
                  showFilters 
                    ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200" 
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
             >
                <Filter size={16} /> {showFilters ? "Hide Filters" : "Filter"}
             </button>
             <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-50 transition-all">
                <Download size={16} /> Export
             </button>
             <Link href="/transactions/add">
                <button className="indigo-gradient text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-indigo-100">
                  <Plus size={18} /> Add Transaction
                </button>
             </Link>
          </div>
        </div>

        {/* Filter Section */}
        {showFilters && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 mb-8 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center justify-between mb-6">
               <h3 className="text-lg font-bold text-slate-900">Search Filters</h3>
               <button 
                  onClick={resetFilters}
                  className="text-xs font-bold text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors"
               >
                  Reset All
               </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Category</label>
                <select 
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Type</label>
                <select 
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                >
                  <option value="">All Types</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Start Date</label>
                <input 
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">End Date</label>
                <input 
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Min Amount</label>
                <input 
                  type="number"
                  name="minAmount"
                  placeholder="0.00"
                  value={filters.minAmount}
                  onChange={handleFilterChange}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Max Amount</label>
                <input 
                  type="number"
                  name="maxAmount"
                  placeholder="Any"
                  value={filters.maxAmount}
                  onChange={handleFilterChange}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">Entity / Description</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">Asset Type</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">Timestamp</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] text-right">Value</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] text-right">Execution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-24 text-center text-slate-400">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Querying Ledger...</p>
                  </td>
                </tr>
              ) : transactions.length > 0 ? (
                transactions.map((t) => {
                  const Icon = iconMap[t.category] || HelpCircle;
                  return (
                    <tr key={t.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            t.type === "income" ? "bg-emerald-50 text-emerald-600" : "bg-indigo-50 text-indigo-600"
                          }`}>
                            <Icon size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                              {t.description || t.category}
                            </p>
                            <p className="text-[11px] text-slate-500 font-medium">HDFC Bank • UPI</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wide">
                          {t.category}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-[12px] font-medium text-slate-500">
                        {formatDate(t.transactionDate, "MMM dd, yyyy")}
                        <span className="ml-2 opacity-50">10:24 AM</span>
                      </td>
                      <td className={`px-8 py-5 text-right text-sm font-bold ${
                        t.type === "income" ? "text-emerald-600" : "text-rose-500"
                      }`}>
                        {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-4">
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            <span className="text-[10px] font-bold text-slate-600 uppercase">Settled</span>
                          </div>
                          <Link 
                            href={`/transactions/edit/${t.id}`}
                            className="p-2 text-slate-200 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Pencil size={16} />
                          </Link>
                          <button 
                            onClick={() => handleDelete(t.id)}
                            className="p-2 text-slate-200 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-8 py-24 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 text-slate-300 mb-4">
                      <Filter size={32} />
                    </div>
                    <p className="text-slate-900 font-bold mb-1">No transactions found</p>
                    <p className="text-slate-400 text-sm font-medium">Try adjusting your filters to find what you're looking for</p>
                    {(filters.category || filters.type || filters.startDate || filters.endDate || filters.minAmount || filters.maxAmount) && (
                       <button 
                        onClick={resetFilters}
                        className="mt-6 text-indigo-600 font-bold text-sm hover:underline"
                       >
                        Clear all filters
                       </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
