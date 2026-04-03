"use client";

import { Card } from "@/components/ui/Card";
import { RefreshCw } from "lucide-react";

export function SubscriptionList() {
  // Simple version using data from recurring transactions for now
  return (
    <Card className="p-4">
      <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
        <RefreshCw className="h-4 w-4 text-emerald-500" />
        Active Subscriptions
      </h3>
      <p className="text-xs text-slate-500 text-center py-4 italic">
        Subscription management coming soon. Use Recurring Transactions for now.
      </p>
    </Card>
  );
}
