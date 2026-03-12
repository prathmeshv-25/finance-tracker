"use client";

import { useState } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

interface SavingsGoalFormProps {
  onSuccess: () => void;
}

export const SavingsGoalForm = ({ onSuccess }: SavingsGoalFormProps) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title"),
      targetAmount: parseFloat(formData.get("targetAmount") as string),
      deadline: formData.get("deadline"),
    };

    try {
      const res = await fetch("/api/savings-goals", {
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
        <label className="block text-sm font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">Goal Title</label>
        <Input name="title" placeholder="e.g. Emergency Fund" required />
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">Target Amount</label>
        <Input type="number" name="targetAmount" placeholder="0.00" required min="0.01" step="0.01" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">Target Date</label>
        <Input type="date" name="deadline" required />
      </div>
      <Button type="submit" disabled={loading} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-200">
        {loading ? "Creating Goal..." : "Create Savings Goal"}
      </Button>
    </form>
  );
};
