"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Clock, AlertCircle } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/utils/dateHelpers";

interface Reminder {
  id: string;
  title: string;
  dueDate: string;
  isCompleted: boolean;
}

export function ReminderWidget() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reminders?upcoming=3")
      .then(res => res.json())
      .then(data => {
        setReminders(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <Card className="p-4 animate-pulse h-32"><div></div></Card>;

  const activeReminders = reminders.filter(r => !r.isCompleted);

  return (
    <Card className="p-4 border-l-4 border-l-blue-500">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-sm flex items-center gap-2">
          <Clock className="h-4 w-4 text-blue-500" />
          Reminder Alerts
        </h3>
        <Link href="/reminders" className="text-[10px] text-blue-500 hover:underline font-bold">Manage</Link>
      </div>

      {activeReminders.length === 0 ? (
        <p className="text-xs text-slate-500">No urgent reminders.</p>
      ) : (
        <div className="space-y-3">
          {activeReminders.map(r => (
            <div key={r.id} className="flex items-start gap-2">
              <AlertCircle className="h-3 w-3 text-orange-500 mt-0.5" />
              <div>
                <p className="text-xs font-medium">{r.title}</p>
                <p className="text-[10px] text-slate-500">Due: {formatDate(r.dueDate, "dd/MM/yyyy")}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
