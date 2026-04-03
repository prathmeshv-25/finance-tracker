"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, Circle, Clock, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { formatDate } from "@/utils/dateHelpers";

interface Reminder {
  id: string;
  title: string;
  description: string | null;
  dueDate: string;
  isCompleted: boolean;
}

export function ReminderList() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      const response = await fetch("/api/reminders");
      if (response.ok) {
        const data = await response.json();
        setReminders(data);
      }
    } catch (error) {
      toast.error("Failed to fetch reminders");
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = async (id: string, currentlyCompleted: boolean) => {
    if (currentlyCompleted) return; // For simplified demo, only allow marking complete

    try {
      const response = await fetch("/api/reminders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (response.ok) {
        setReminders(prev =>
          prev.map(r => (r.id === id ? { ...r, isCompleted: true } : r))
        );
        toast.success("Reminder completed!");
      }
    } catch (error) {
      toast.error("Failed to update reminder");
    }
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;

  return (
    <div className="space-y-4">
      {reminders.length === 0 ? (
        <Card className="p-8 text-center text-slate-500">
          No reminders set up yet.
        </Card>
      ) : (
        reminders.map((reminder) => (
          <Card
            key={reminder.id}
            className={`p-4 flex items-center justify-between transition-opacity ${
              reminder.isCompleted ? "opacity-60" : ""
            }`}
          >
            <div className="flex items-start gap-3">
              <button
                onClick={() => toggleComplete(reminder.id, reminder.isCompleted)}
                className={`mt-1 transition-colors ${
                  reminder.isCompleted ? "text-green-500" : "text-slate-300 hover:text-blue-500"
                }`}
              >
                {reminder.isCompleted ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <Circle className="h-5 w-5" />
                )}
              </button>
              <div>
                <h4
                  className={`font-medium text-sm text-slate-900 ${
                    reminder.isCompleted ? "line-through" : ""
                  }`}
                >
                  {reminder.title}
                </h4>
                {reminder.description && (
                  <p className="text-xs text-slate-500 mt-0.5">{reminder.description}</p>
                )}
                <div className="flex items-center gap-1.5 mt-2 text-[10px] font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full w-fit">
                  <Clock className="h-3 w-3" />
                  Due: {formatDate(reminder.dueDate, "dd/MM/yyyy")}
                </div>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}
