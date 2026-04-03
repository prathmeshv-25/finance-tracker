"use client";

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  color?: "blue" | "green" | "emerald" | "rose" | "indigo";
}

export const ProgressBar = ({ value, max, label, color = "blue" }: ProgressBarProps) => {
  const percentage = Math.min(Math.round((value / max) * 100), 100);
  
  const colors = {
    blue: "bg-blue-600",
    green: "bg-green-600",
    emerald: "bg-emerald-500",
    rose: "bg-rose-500",
    indigo: "bg-indigo-600",
  };

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between mb-1.5 uppercase tracking-wider">
          <span className="text-[10px] font-bold text-slate-500">{label}</span>
          <span className="text-[10px] font-bold text-slate-900">{percentage}%</span>
        </div>
      )}
      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-500 ease-out ${colors[color]}`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
