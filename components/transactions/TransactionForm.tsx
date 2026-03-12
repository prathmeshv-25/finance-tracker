"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Category } from "@/types";
import toast from "react-hot-toast";

const transactionSchema = z.object({
  amount: z.preprocess((val) => Number(val), z.number().positive("Amount must be positive")),
  categoryId: z.string().min(1, "Please select a category"),
  type: z.enum(["income", "expense"]),
  description: z.string().optional(),
  transactionDate: z.string().min(1, "Date is required"),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  onSubmit: (data: TransactionFormData) => Promise<void>;
  loading?: boolean;
}

export const TransactionForm = ({ onSubmit, loading }: TransactionFormProps) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "expense",
      transactionDate: new Date().toISOString().split("T")[0],
    },
  });

  const type = watch("type");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="flex p-1 bg-surface-2 rounded-xl border border-border">
        {["expense", "income"].map((t) => (
          <label
            key={t}
            className={`flex-1 text-center py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-all capitalize ${
              type === t
                ? t === "income"
                  ? "bg-income/20 text-income border border-income/30"
                  : "bg-expense/20 text-expense border border-expense/30"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            <input type="radio" value={t} {...register("type")} className="hidden" />
            {t}
          </label>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input
          label="Amount (₹)"
          type="number"
          placeholder="0.00"
          error={errors.amount?.message}
          {...register("amount")}
        />
        <div className="space-y-1.5">
          <label className="label">Category</label>
          <select
            className={`input-field ${errors.categoryId ? "border-expense text-expense" : ""}`}
            {...register("categoryId")}
          >
            <option value="">Select Category</option>
            {categories
              .filter((c) => c.type === type || c.type === "both")
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
          </select>
          {errors.categoryId && <p className="text-expense text-xs mt-1">{errors.categoryId.message}</p>}
        </div>
      </div>

      <Input
        label="Date"
        type="date"
        error={errors.transactionDate?.message}
        {...register("transactionDate")}
      />

      <Input
        label="Description (Optional)"
        placeholder="What was this for?"
        error={errors.description?.message}
        {...register("description")}
      />

      <Button type="submit" className="w-full h-12 text-base" loading={loading}>
        Add {type}
      </Button>
    </form>
  );
};
