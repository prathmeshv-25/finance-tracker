"use client";

import { Transaction } from "@/types";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/dateHelpers";
import { Trash2, ArrowUpRight, ArrowDownLeft } from "lucide-react";

interface TransactionTableProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  loading?: boolean;
}

export const TransactionTable = ({ transactions, onDelete, loading }: TransactionTableProps) => {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-surface-2 animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 px-4 border-2 border-dashed border-border rounded-2xl">
        <p className="text-text-secondary">No transactions found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto -mx-4 lg:mx-0">
      <table className="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr className="border-b border-border">
            <th className="px-4 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Date</th>
            <th className="px-4 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Category</th>
            <th className="px-4 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Description</th>
            <th className="px-4 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider text-right">Amount</th>
            <th className="px-4 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {transactions.map((t) => (
            <tr key={t.id} className="group hover:bg-surface-hover transition-colors">
              <td className="px-4 py-4 text-sm text-text-secondary whitespace-nowrap">
                {formatDate(t.transactionDate)}
              </td>
              <td className="px-4 py-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-2 text-text-primary border border-border">
                  {t.category || "Uncategorized"}
                </span>
              </td>
              <td className="px-4 py-4 text-sm text-text-primary">
                {t.description || "-"}
              </td>
              <td className="px-4 py-4 text-right whitespace-nowrap">
                <span className={`text-sm font-bold flex items-center justify-end gap-1 ${
                  t.type === "income" ? "text-income" : "text-expense"
                }`}>
                  {t.type === "income" ? (
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowDownLeft className="w-3.5 h-3.5" />
                  )}
                  {t.type === "income" ? "+" : "-"}
                  {formatCurrency(t.amount)}
                </span>
              </td>
              <td className="px-4 py-4 text-right">
                <button
                  onClick={() => onDelete(t.id)}
                  className="p-2 text-text-muted hover:text-expense hover:bg-expense/10 rounded-lg transition-all"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
