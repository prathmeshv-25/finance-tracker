"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CategoryName } from "@/types";
import { DatePicker } from "@/components/ui/DatePicker";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const categories: CategoryName[] = ["Food", "Transport", "Shopping", "Bills", "Salary", "Other"];

export default function AddTransactionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<"expense" | "income">("expense");
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState<string>("");
  const [category, setCategory] = useState<string>("Food");
  const [description, setDescription] = useState<string>("");

  const categoriesByType = {
    expense: ["Food", "Transport", "Shopping", "Bills", "Entertainment", "Health", "Other"],
    income: ["Salary", "Freelance", "Investment", "Gifts", "Other"],
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const data = {
      amount: parseFloat(amount),
      category,
      type,
      description,
      date,
    };

    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push("/transactions");
        router.refresh();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <Link href="/transactions" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold mb-6 transition-colors uppercase tracking-wider text-xs">
          <ArrowLeft size={16} />
          Back to Transactions
        </Link>
        
        <h1 className="text-3xl font-extrabold text-slate-900 mb-8 tracking-tight">Add New Transaction</h1>
        
        <Card className="p-8 border-none shadow-2xl shadow-indigo-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Type</label>
                <select 
                  name="type" 
                  required 
                  value={type}
                  onChange={(e) => {
                    const newType = e.target.value as "expense" | "income";
                    setType(newType);
                    setCategory(categoriesByType[newType][0]);
                  }}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-semibold"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Category</label>
                <select 
                  name="category" 
                  required 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-semibold"
                >
                  {categoriesByType[type].map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Amount</label>
              <Input 
                type="number" 
                name="amount" 
                placeholder="0.00" 
                required 
                min="0.01" 
                step="0.01" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-lg font-bold py-6 px-4 bg-slate-50" 
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Description</label>
              <Input 
                name="description" 
                placeholder="What was this for?" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="py-3 px-4 bg-slate-50" 
              />
            </div>

            <div>
              <DatePicker 
                label="Date"
                value={date}
                onChange={setDate}
                required
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-lg rounded-xl transition-all shadow-xl shadow-indigo-200 mt-4">
              {loading ? "Saving Transaction..." : "Save Transaction"}
            </Button>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}
