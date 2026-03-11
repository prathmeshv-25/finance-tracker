"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { PlusCircle, Calendar } from "lucide-react";
import { format } from "date-fns";

interface Category { id: string; name: string; type: string; }

const schema = z.object({
  amount: z.string().min(1, "Amount is required").refine((v) => !isNaN(Number(v)) && Number(v) > 0, "Must be a positive number"),
  categoryId: z.string().uuid("Select a category"),
  type: z.enum(["income", "expense"]),
  description: z.string().optional(),
  transactionDate: z.string().min(1, "Date is required"),
});

type FormData = z.infer<typeof schema>;

export default function AddTransactionPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: "expense",
      transactionDate: format(new Date(), "yyyy-MM-dd"),
    },
  });

  const selectedType = watch("type");

  const fetchCategories = useCallback(async () => {
    const res = await fetch("/api/categories");
    if (res.ok) setCategories(await res.json());
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const filteredCategories = categories.filter((c) => c.type === selectedType);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, amount: Number(data.amount) }),
      });
      const json = await res.json();
      if (!res.ok) { toast.error(json.error ?? "Failed to add transaction"); return; }
      toast.success("Transaction added!");
      router.push("/dashboard");
    } catch {
      toast.error("Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="page-title">Add Transaction</h1>
        <p className="text-text-secondary text-sm mt-1">Record a new income or expense</p>
      </div>

      <div className="glass-card p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          {/* Type Toggle */}
          <div>
            <label className="label">Type</label>
            <div className="grid grid-cols-2 gap-3">
              {(["expense", "income"] as const).map((t) => (
                <label
                  key={t}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl border cursor-pointer font-medium text-sm transition-all duration-200 ${
                    selectedType === t
                      ? t === "income"
                        ? "bg-income/15 border-income text-income"
                        : "bg-expense/15 border-expense text-expense"
                      : "border-border text-text-secondary hover:border-border-light"
                  }`}
                >
                  <input type="radio" value={t} {...register("type")} className="sr-only" />
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </label>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="label" htmlFor="amount">Amount (₹)</label>
            <input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g. 1500"
              className={`input-field ${errors.amount ? "border-expense" : ""}`}
              {...register("amount")}
            />
            {errors.amount && <p className="text-expense text-xs mt-1">{errors.amount.message}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="label" htmlFor="categoryId">Category</label>
            <select
              id="categoryId"
              className={`input-field ${errors.categoryId ? "border-expense" : ""}`}
              {...register("categoryId")}
            >
              <option value="">Select a category</option>
              {filteredCategories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {errors.categoryId && <p className="text-expense text-xs mt-1">{errors.categoryId.message}</p>}
          </div>

          {/* Date */}
          <div>
            <label className="label" htmlFor="transactionDate">Date</label>
            <div className="relative">
              <input
                id="transactionDate"
                type="date"
                max={format(new Date(), "yyyy-MM-dd")}
                className={`input-field pl-10 block w-full text-left [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer ${errors.transactionDate ? "border-expense" : ""}`}
                {...register("transactionDate")}
              />
              <Calendar className="w-5 h-5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            {errors.transactionDate && <p className="text-expense text-xs mt-1">{errors.transactionDate.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="label" htmlFor="description">Description <span className="text-text-muted">(optional)</span></label>
            <input
              id="description"
              type="text"
              placeholder="e.g. Grocery shopping"
              className="input-field"
              {...register("description")}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              {loading ? "Saving…" : "Add Transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
