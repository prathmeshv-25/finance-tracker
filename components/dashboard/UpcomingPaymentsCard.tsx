"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { CreditCard, ArrowRight } from "lucide-react";
import { formatDate } from "@/utils/dateHelpers";

interface RecurringTransaction {
  id: string;
  amount: number;
  description: string | null;
  nextExecutionDate: string;
  type: string;
}

export function UpcomingPaymentsCard() {
  const [payments, setPayments] = useState<RecurringTransaction[]>([]);

  useEffect(() => {
    fetch("/api/recurring")
      .then(res => res.json())
      .then(data => {
        const sorted = data.sort((a: any, b: any) => 
          new Date(a.nextExecutionDate).getTime() - new Date(b.nextExecutionDate).getTime()
        ).slice(0, 3);
        setPayments(sorted);
      });
  }, []);

  return (
    <Card className="p-4">
      <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
        <CreditCard className="h-4 w-4 text-indigo-500" />
        Upcoming Payments
      </h3>
      
      <div className="space-y-4">
        {payments.length === 0 ? (
          <p className="text-xs text-slate-500">No scheduled payments.</p>
        ) : (
          payments.map(p => (
            <div key={p.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
              <div>
                <p className="text-xs font-bold">{p.description || "Recurring Payment"}</p>
                <p className="text-[10px] text-slate-500">{formatDate(p.nextExecutionDate, "dd/MM/yyyy")}</p>
              </div>
              <div className="text-right text-xs font-bold text-red-500">
                -₹{Number(p.amount).toFixed(2)}
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
