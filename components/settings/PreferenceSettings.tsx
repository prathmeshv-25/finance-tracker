"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";

const preferenceSchema = z.object({
  currency: z.string(),
});

type PreferenceValues = z.infer<typeof preferenceSchema>;

interface PreferenceSettingsProps {
  profile: any;
  onUpdate: () => void;
}

export function PreferenceSettings({ profile, onUpdate }: PreferenceSettingsProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<PreferenceValues>({
    resolver: zodResolver(preferenceSchema),
    defaultValues: {
      currency: profile?.currency || "INR",
    },
  });

  const onSubmit = async (data: PreferenceValues) => {
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success("Preferences saved");
        onUpdate();
      } else {
        toast.error("Failed to save preferences");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const currencies = [
    { code: "INR", label: "Indian Rupee (₹)", symbol: "₹" },
    { code: "USD", label: "US Dollar ($)", symbol: "$" },
    { code: "EUR", label: "Euro (€)", symbol: "€" },
    { code: "GBP", label: "British Pound (£)", symbol: "£" },
    { code: "JPY", label: "Japanese Yen (¥)", symbol: "¥" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-bold tracking-tight">Financial Preferences</h3>
        <p className="text-slate-500 text-sm mt-1">Set your default currency and display options.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Primary Currency</label>
          <select
            {...register("currency")}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
          >
            {currencies.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-slate-400">This will be used for all balances and summaries.</p>
        </div>

        <div className="pt-4">
          <Button type="submit" loading={isSubmitting} className="w-full md:w-auto px-8">
            Save Preferences
          </Button>
        </div>
      </form>

      <div className="pt-8 border-t border-slate-100">
        <h3 className="text-lg font-bold tracking-tight text-slate-800">Interface Settings</h3>
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
            <div>
              <p className="text-sm font-bold">Dark Mode</p>
              <p className="text-xs text-slate-500">Enable dark theme for the application.</p>
            </div>
            <div className="w-12 h-6 bg-slate-200 rounded-full relative p-1 cursor-not-allowed opacity-50">
              <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
            <div>
              <p className="text-sm font-bold">Compact Mode</p>
              <p className="text-xs text-slate-500">Show more information with less spacing.</p>
            </div>
            <div className="w-12 h-6 bg-slate-200 rounded-full relative p-1 cursor-not-allowed opacity-50">
              <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
