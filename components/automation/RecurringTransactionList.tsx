"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Trash2, Calendar, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { formatDate } from "@/utils/dateHelpers";

interface RecurringTransaction {
  id: string;
  amount: number;
  category: string;
  type: "income" | "expense";
  description: string | null;
  frequency: string;
  nextExecutionDate: string;
  isActive: boolean;
}

export function RecurringTransactionList() {
  const [items, setItems] = useState<RecurringTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch("/api/recurring");
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (error) {
      toast.error("Failed to fetch recurring transactions");
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this recurring transaction?")) return;
    
    try {
      const response = await fetch(`/api/recurring/${id}`, { method: "DELETE" });
      if (response.ok) {
        setItems(prev => prev.filter(item => item.id !== id));
        toast.success("Deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase text-xs">
            <tr>
              <th className="px-6 py-4 font-medium">Description</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Amount</th>
              <th className="px-6 py-4 font-medium">Frequency</th>
              <th className="px-6 py-4 font-medium">Next Run</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                  No recurring transactions found.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">
                      {item.description || "No description"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full bg-slate-100 text-[10px] font-medium text-slate-600">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={item.type === "income" ? "text-green-600" : "text-red-600"}>
                      {item.type === "income" ? "+" : "-"}₹{Number(item.amount).toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 capitalize flex items-center gap-1.5">
                    <RefreshCw className="h-3 w-3 text-slate-400" />
                    {item.frequency}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Calendar className="h-3 w-3" />
                      {formatDate(item.nextExecutionDate, "dd/MM/yyyy")}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-400 hover:text-red-500"
                      onClick={() => deleteItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
