import { Transaction } from "@/types";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/dateHelpers";
import { Receipt, ArrowUpRight, ArrowDownLeft } from "lucide-react";

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export const RecentTransactions = ({ transactions }: RecentTransactionsProps) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/50">
            <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">Entity / Description</th>
            <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">Asset Type</th>
            <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">Timestamp</th>
            <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] text-right">Value</th>
            <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">Execution</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {transactions.length > 0 ? (
            transactions.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50/80 transition-colors group">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      t.type === "income" ? "bg-emerald-50 text-emerald-600" : "bg-indigo-50 text-indigo-600"
                    }`}>
                      <Receipt className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{t.description || t.category}</p>
                      <p className="text-[11px] text-slate-500 font-medium">HDFC Bank</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-bold uppercase">{t.category}</span>
                </td>
                <td className="px-8 py-5 text-[12px] font-medium text-slate-500">
                  {formatDate(t.transactionDate, "MMM dd, yyyy")}
                </td>
                <td className={`px-8 py-5 text-sm font-bold text-right ${
                  t.type === "income" ? "text-emerald-600" : "text-rose-500"
                }`}>
                  {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span className="text-[11px] font-bold text-slate-600 uppercase">Settled</span>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="px-8 py-10 text-center text-slate-400 font-medium italic">
                No recent transactions found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
