import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  description?: string;
}

export const StatCard = ({ title, value, icon, trend, className = "", description }: StatCardProps) => {
  return (
    <div className={`bg-white p-6 rounded-3xl border border-slate-200 flex flex-col justify-between shadow-sm transition-all hover:shadow-md ${className}`}>
      <div>
        <div className="flex justify-between items-center mb-2">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{title}</p>
          <div className="text-slate-400">
            {icon}
          </div>
        </div>
        <h3 className="text-2xl font-bold font-headline text-slate-900 tracking-tight">{value}</h3>
      </div>
      
      <div className="mt-4 flex items-center justify-between">
        <p className="text-[10px] text-slate-400 font-medium">{description || "Status"}</p>
        {trend && (
          <div className={`flex items-center gap-0.5 text-[10px] font-bold ${trend.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
            {trend.isPositive ? '↑' : '↓'} {trend.value}%
          </div>
        )}
      </div>
    </div>
  );
};
