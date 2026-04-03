"use client";

import { RecurringTransactionForm } from "@/components/automation/RecurringTransactionForm";
import { RecurringTransactionList } from "@/components/automation/RecurringTransactionList";
import { SubscriptionForm } from "@/components/subscriptions/SubscriptionForm";
import { SubscriptionList } from "@/components/subscriptions/SubscriptionList";
import { AppLayout } from "@/components/layout/AppLayout";
import { RefreshCcw, Plus, CreditCard, Repeat } from "lucide-react";
import { useState } from "react";

export default function RecurringPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState<"subscriptions" | "recurring">("subscriptions");

  return (
    <AppLayout>
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight font-headline">Automated Cycles</h1>
            <p className="text-slate-500 font-medium mt-1">Managed recurring financial protocols</p>
          </div>
          <div className="flex gap-3">
             <div className="bg-slate-100 p-1 rounded-xl flex items-center">
               <button 
                 onClick={() => setActiveTab("subscriptions")}
                 className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${activeTab === "subscriptions" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
               >
                 <CreditCard size={16} /> Subscriptions
               </button>
               <button 
                 onClick={() => setActiveTab("recurring")}
                 className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${activeTab === "recurring" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
               >
                 <Repeat size={16} /> Recurring
               </button>
             </div>
             <button 
                onClick={() => setRefreshKey(prev => prev + 1)}
                className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-indigo-100 transition-all transition-all"
             >
                <RefreshCcw size={16} /> Sync
             </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-10">
          <div className="col-span-12 lg:col-span-4">
             <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm sticky top-24">
                <div className="flex items-center gap-2 mb-6">
                   <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <Plus size={20} />
                   </div>
                   <h2 className="text-xl font-bold text-slate-900 font-headline">
                     {activeTab === "subscriptions" ? "Add Subscription" : "Initialize Cycle"}
                   </h2>
                </div>
                {activeTab === "subscriptions" ? (
                  <SubscriptionForm onSuccess={() => setRefreshKey(prev => prev + 1)} />
                ) : (
                  <RecurringTransactionForm onSuccess={() => setRefreshKey(prev => prev + 1)} />
                )}
             </div>
          </div>
          
          <div className="col-span-12 lg:col-span-8">
             <div className="space-y-6">
                {activeTab === "subscriptions" ? (
                  <SubscriptionList key={`sub-${refreshKey}`} />
                ) : (
                  <RecurringTransactionList key={`rec-${refreshKey}`} />
                )}
             </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
