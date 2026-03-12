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
  const progressPercentage = Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100);

  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">{goal.title}</h3>
          <p className="text-sm text-slate-500 mt-0.5">Deadline: {formatDate(goal.deadline, "MMM d, yyyy")}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-indigo-600">
            {formatCurrency(goal.currentAmount)}
          </p>
          <p className="text-sm text-slate-500 font-medium">of {formatCurrency(goal.targetAmount)}</p>
        </div>
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
