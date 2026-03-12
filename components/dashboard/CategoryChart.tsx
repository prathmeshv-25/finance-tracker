"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface CategoryChartProps {
  data: { name: string; value: number }[];
  loading?: boolean;
}

const COLORS = ["#00d4aa", "#ff6b6b", "#4dabff", "#ffb84d", "#b388ff", "#90a4ae"];

export const CategoryChart = ({ data, loading = false }: CategoryChartProps) => {
  return (
    <Card title="Expense Breakdown" subtitle="Spending by category">
      <div className="h-[300px] w-full mt-4">
        {loading ? (
          <div className="w-full h-full bg-surface-2 animate-pulse rounded-xl" />
        ) : data.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-text-muted text-sm">
            No expense data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0.2)" />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "var(--surface)", 
                  borderColor: "var(--border)",
                  borderRadius: "12px",
                  color: "var(--text-primary)"
                }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};
