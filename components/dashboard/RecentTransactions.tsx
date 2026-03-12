import { Transaction } from "@/types";
import { Card } from "../ui/Card";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/dateHelpers";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export const RecentTransactions = ({ transactions }: RecentTransactionsProps) => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900">Recent Transactions</h3>
        <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors">View All</button>
      </div>
      
      <div className="space-y-4">
        {transactions.length > 0 ? (
          transactions.map((t) => (
            <div key={t.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  t.type === "income" 
                    ? "bg-emerald-100 text-emerald-600" 
                    : "bg-rose-100 text-rose-600"
                }`}>
                  {t.type === "income" ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                </div>
                <div>
                  <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{t.description || t.category}</p>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{t.category} • {formatDate(t.transactionDate, "MMM d, yyyy")}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${t.type === "income" ? "text-emerald-600" : "text-rose-600"}`}>
                  {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-slate-400 font-medium">No recent transactions</div>
        )}
      </div>
    </Card>
  );
};
