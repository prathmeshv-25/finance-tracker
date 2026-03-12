import { ReactNode } from "react";
import { Card } from "../ui/Card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const StatCard = ({ title, value, icon, trend, className = "" }: StatCardProps) => {
  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold mt-1 text-slate-900">{value}</h3>
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${trend.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
              <span className="font-semibold">{trend.isPositive ? '+' : '-'}{trend.value}%</span>
              <span className="ml-1 text-slate-400">vs last month</span>
            </div>
          )}
        </div>
        <div className="p-3 bg-slate-50 rounded-xl text-slate-600 border border-slate-100">
          {icon}
        </div>
      </div>
    </Card>
  );
};
