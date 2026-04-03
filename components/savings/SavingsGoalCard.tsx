import { SavingsGoal } from "@/types";
import { Card } from "../ui/Card";
import { ProgressBar } from "../ui/ProgressBar";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/dateHelpers";

interface SavingsGoalCardProps {
  goal: SavingsGoal;
  onAddProgress: (id: string) => void;
}

export const SavingsGoalCard = ({ goal, onAddProgress }: SavingsGoalCardProps) => {
  const truePercentage = ((goal.currentAmount / goal.targetAmount) * 100).toFixed(1);
  const isOverSaving = goal.currentAmount > goal.targetAmount;

  return (
    <Card className={`p-6 border-2 transition-all ${isOverSaving ? 'border-emerald-400 bg-emerald-50/10' : 'border-transparent'}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">{goal.title}</h3>
            {isOverSaving && (
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                Over-saved
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-0.5">Deadline: {formatDate(goal.deadline, "MMM d, yyyy")}</p>
        </div>
        <div className="text-right">
          <p className={`text-lg font-bold ${isOverSaving ? 'text-emerald-600' : 'text-indigo-600'}`}>
            {formatCurrency(goal.currentAmount)}
          </p>
          <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">
            Target: {formatCurrency(goal.targetAmount)}
          </p>
        </div>
      </div>

      <div className="flex justify-between mb-1.5 uppercase tracking-wider mt-6">
        <span className="text-[10px] font-bold text-slate-500">Progress</span>
        <span className={`text-[10px] font-bold ${isOverSaving ? 'text-emerald-700' : 'text-slate-900'}`}>{Number(truePercentage) % 1 === 0 ? parseInt(truePercentage) : truePercentage}%</span>
      </div>
      <ProgressBar 
        value={goal.currentAmount} 
        max={goal.targetAmount} 
        color="emerald" 
      />

      <div className="mt-6">
        <button
          onClick={() => onAddProgress(goal.id)}
          className="w-full py-2.5 px-4 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold rounded-xl transition-all border border-emerald-100 flex items-center justify-center gap-2"
        >
          Add Progress
        </button>
      </div>
    </Card>
  );
};
