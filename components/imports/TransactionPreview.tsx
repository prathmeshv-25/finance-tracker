"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Check, Trash2, ArrowRight, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { NormalizedTransaction } from "@/services/importService";

interface TransactionPreviewProps {
  transactions: NormalizedTransaction[];
  onConfirm: () => void;
  onCancel: () => void;
}

export function TransactionPreview({ transactions, onConfirm, onCancel }: TransactionPreviewProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [items, setItems] = useState(transactions);

  const handleRemove = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleConfirm = async () => {
    if (items.length === 0) {
      toast.error("No transactions to import");
      return;
    }

    setIsConfirming(true);
    try {
      const res = await fetch("/api/imports/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactions: items }),
      });

      if (res.ok) {
        toast.success(`Successfully imported ${items.length} transactions`);
        onConfirm();
      } else {
        toast.error("Failed to save transactions");
      }
    } catch (error) {
      toast.error("An error occurred during save");
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">Preview Transactions</h3>
          <p className="text-slate-500 text-sm mt-1">Review the extracted data before saving to your records.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onCancel} disabled={isConfirming}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isConfirming || items.length === 0}>
            {isConfirming ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Check className="mr-2 h-4 w-4" />
            )}
            Confirm Import ({items.length})
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden border-slate-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-bottom border-slate-100">
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Description</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Amount</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                <th className="p-4 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((t, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-4 text-sm font-medium text-slate-700 whitespace-nowrap">
                    {new Date(t.date).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-sm text-slate-900 font-bold max-w-xs truncate">
                    {t.description}
                  </td>
                  <td className={`p-4 text-sm font-bold text-right ${t.type === "income" ? "text-emerald-600" : "text-slate-900"}`}>
                    {t.type === "income" ? "+" : "-"}{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(t.amount)}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      t.type === "income" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"
                    }`}>
                      {t.type}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => handleRemove(idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      
      <div className="text-center py-4 text-xs text-slate-400">
        All amounts are processed as absolute values. Type is determined by the bank sign logic.
      </div>
    </div>
  );
}
