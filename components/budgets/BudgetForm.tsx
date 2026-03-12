"use client";

import { useState } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { CategoryName } from "@/types";
import { getCurrentMonthInfo } from "@/utils/dateHelpers";

interface BudgetFormProps {
  onSuccess: () => void;
}

const categories: CategoryName[] = ["Food", "Transport", "Shopping", "Bills", "Salary", "Other"];

export const BudgetForm = ({ onSuccess }: BudgetFormProps) => {
  const [loading, setLoading] = useState(false);
  const { month, year } = getCurrentMonthInfo();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      category: formData.get("category"),
      monthlyLimit: parseFloat(formData.get("monthlyLimit") as string),
      month,
      year,
    };

    try {
      const res = await fetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        onSuccess();
        (e.target as HTMLFormElement).reset();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">Category</label>
        <select 
          name="category" 
          required 
          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-slate-900"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">Monthly Limit</label>
        <Input 
          type="number" 
          name="monthlyLimit" 
          placeholder="0.00" 
          required 
          min="0.01" 
          step="0.01" 
        />
      </div>
      <Button type="submit" disabled={loading} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-200">
        {loading ? "Setting Budget..." : "Set Budget"}
      </Button>
    </form>
  );
};
