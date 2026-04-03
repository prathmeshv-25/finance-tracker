"use client";

import { ReminderForm } from "@/components/automation/ReminderForm";
import { ReminderList } from "@/components/automation/ReminderList";
import { AppLayout } from "@/components/layout/AppLayout";
import { Bell, Plus, RefreshCcw } from "lucide-react";
import { useState } from "react";

export default function RemindersPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <AppLayout>
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight font-headline">Alert Protocols</h1>
            <p className="text-slate-500 font-medium mt-1">Managed notifications for upcoming liabilities</p>
          </div>
          <div className="flex gap-3">
             <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
                Active Alerts
             </button>
             <button 
                onClick={() => setRefreshKey(prev => prev + 1)}
                className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-indigo-100 transition-all"
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
                   <h2 className="text-xl font-bold text-slate-900 font-headline">Initialize Alert</h2>
                </div>
                <ReminderForm onSuccess={() => setRefreshKey(prev => prev + 1)} />
             </div>
          </div>
          
          <div className="col-span-12 lg:col-span-8">
             <div className="space-y-6">
                <ReminderList key={refreshKey} />
             </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
