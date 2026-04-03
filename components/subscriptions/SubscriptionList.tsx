"use client";

import { useEffect, useState } from "react";
import { SubscriptionCard } from "./SubscriptionCard";
import { CreditCard } from "lucide-react";

export const SubscriptionList = () => {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubscriptions = async () => {
    try {
      const res = await fetch("/api/subscriptions");
      if (res.ok) {
        const data = await res.json();
        setSubscriptions(data.subscriptions);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this subscription?")) return;
    try {
      const res = await fetch(`/api/subscriptions/${id}`, { method: "DELETE" });
      if (res.ok) fetchSubscriptions();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  if (loading) {
    return <div className="p-10 text-center text-slate-400">Loading Subscriptions...</div>;
  }

  if (subscriptions.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 mx-auto mb-4">
          <CreditCard size={32} />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">No Active Subscriptions</h3>
        <p className="text-sm font-medium text-slate-500">Track your recurring monthly obligations here.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {subscriptions.map(sub => (
        <SubscriptionCard key={sub.id} subscription={sub} onDelete={handleDelete} />
      ))}
    </div>
  );
};
