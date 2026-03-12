import { Budget } from "@/types";
import { Card } from "../ui/Card";
import { ProgressBar } from "../ui/ProgressBar";
import { formatCurrency } from "@/utils/formatCurrency";

interface BudgetCardProps {
  budget: Budget;
}

export const BudgetCard = ({ budget }: BudgetCardProps) => {
  const spent = budget.spent || 0;
  const isOverBudget = spent > budget.monthlyLimit;

  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">{budget.category}</h3>
          <p className="text-sm text-slate-500 mt-0.5">Monthly Budget</p>
        </div>
        <div className="text-right">
          <p className={`text-lg font-bold ${isOverBudget ? 'text-rose-600' : 'text-slate-900'}`}>
            {formatCurrency(spent)}
          </p>
          <p className="text-sm text-slate-500">of {formatCurrency(budget.monthlyLimit)}</p>
        </div>
      </div>
      
      <ProgressBar 
        value={spent} 
        max={budget.monthlyLimit} 
        color={isOverBudget ? "rose" : "indigo"}
      />
      
      <div className="mt-4 flex justify-between text-xs font-semibold uppercase tracking-wider">
        <span className={isOverBudget ? "text-rose-600" : "text-slate-500"}>
          {isOverBudget ? "Over budget" : "Remaining"}
        </span>
        <span className={isOverBudget ? "text-rose-600" : "text-emerald-600"}>
          {isOverBudget 
            ? `-${formatCurrency(spent - budget.monthlyLimit)}` 
            : formatCurrency(budget.monthlyLimit - spent)
          }
        </span>
      </div>
    </Card>
  );
};
