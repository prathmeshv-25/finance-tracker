"use client";
import { memo, useMemo } from "react";

import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip 
} from "recharts";

interface ExpenseChartProps {
  data: { name: string; value: number }[];
  title?: string;
}

const COLORS = ["#4f46e5", "#f59e0b", "#10b981", "#cbd5e1", "#8b5cf6", "#06b6d4"];

export const ExpenseChart = memo(function ExpenseChart({ data, title }: ExpenseChartProps) {
  const totalValue = useMemo(() => data.reduce((acc, curr) => acc + curr.value, 0), [data]);

  return (
    <div className="relative w-full h-[300px] flex flex-col items-center justify-center">
      {title && <h3 className="text-lg font-bold font-headline text-slate-900 mb-6">{title}</h3>}
      <div className="relative w-full h-full">
        {data.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={85}
                  outerRadius={105}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                  strokeLinecap="round"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: '1px solid #f1f5f9', 
                    boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.1)',
                    padding: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: '#0f172a'
                  }}
                  itemStyle={{ color: '#475569' }}
                  cursor={{ fill: 'transparent' }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label for Donut */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Value</p>
              <p className="text-2xl font-black font-headline text-slate-900">
                ₹{(totalValue / 1000).toFixed(1)}k
              </p>
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400 font-medium italic">
            No spending data
          </div>
        )}
      </div>
      
      {/* Legend */}
      <div className="w-full mt-6 grid grid-cols-2 gap-4">
        {data.slice(0, 4).map((entry, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div 
                className="w-2.5 h-2.5 rounded-full" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></div>
              <span className="text-[11px] font-semibold text-slate-600 truncate max-w-[80px]">
                {entry.name}
              </span>
            </div>
            <span className="text-[11px] font-bold text-slate-900">
              {Math.round((entry.value / (totalValue || 1)) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});
