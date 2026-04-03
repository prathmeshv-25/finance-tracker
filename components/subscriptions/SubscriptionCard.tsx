"use client";

import { Card } from "../ui/Card";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/dateHelpers";
import { Calendar, CreditCard, Trash2 } from "lucide-react";

interface Subscription {
  id: string;
  name: string;
  amount: number;
  billingCycle: string;
  nextBillingDate: string;
  category: string;
  isActive: boolean;
}

interface SubscriptionCardProps {
  subscription: Subscription;
  onDelete: (id: string) => void;
}

export const SubscriptionCard = ({ subscription, onDelete }: SubscriptionCardProps) => {
  return (
    <Card className={`p-6 border-2 transition-all ${subscription.isActive ? 'border-transparent' : 'border-slate-100 opacity-60'}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-600`}>
            <CreditCard size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">{subscription.name}</h3>
            <p className="text-xs font-bold text-slate-400 tracking-wider uppercase mt-1">{subscription.category}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-slate-900">
            {formatCurrency(subscription.amount)}
          </p>
          <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">
            /{subscription.billingCycle === "monthly" ? "mo" : "yr"}
          </p>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-slate-400" />
          <p className="text-xs font-bold text-slate-500 tracking-wide">
            Next: {formatDate(subscription.nextBillingDate, "MMM d, yyyy")}
          </p>
        </div>
        <button
          onClick={() => onDelete(subscription.id)}
          className="p-1.5 text-slate-300 hover:text-rose-500 transition-colors"
          title="Delete Subscription"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </Card>
  );
};
