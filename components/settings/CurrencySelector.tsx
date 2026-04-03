"use client";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface CurrencySelectorProps {
  profile: any;
  onUpdate: () => void;
}

export function CurrencySelector({ profile, onUpdate }: CurrencySelectorProps) {
  const currencies = [
    { code: "INR", label: "Indian Rupee (₹)", symbol: "₹" },
    { code: "USD", label: "US Dollar ($)", symbol: "$" },
    { code: "EUR", label: "Euro (€)", symbol: "€" },
    { code: "GBP", label: "British Pound (£)", symbol: "£" },
    { code: "JPY", label: "Japanese Yen (¥)", symbol: "¥" },
  ];

  const { register, handleSubmit } = useForm({
    defaultValues: {
      currency: profile?.currency || "INR",
    },
  });

  const onChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currency: value }),
      });

      if (res.ok) {
        toast.success("Currency updated");
        onUpdate();
      }
    } catch (error) {
      toast.error("Failed to update currency");
    }
  };

  return (
    <div className="space-y-4">
      <label className="text-sm font-bold text-slate-700">Primary Currency</label>
      <select
        value={profile?.currency || "INR"}
        onChange={onChange}
        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all appearance-none cursor-pointer"
      >
        {currencies.map((c) => (
          <option key={c.code} value={c.code}>
            {c.label}
          </option>
        ))}
      </select>
      <p className="text-xs text-slate-400">Your total balance and reports will be displayed in this currency.</p>
    </div>
  );
}
