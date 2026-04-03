"use client";

import { useEffect, useState } from "react";
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area 
} from "recharts";
import { 
  TrendingUp, TrendingDown, PieChart as PieIcon, 
  ArrowUpRight, ArrowDownRight, Target, AlertCircle, Sparkles, Zap, Download, Share2
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";

const COLORS = ["#4f46e5", "#f59e0b", "#10b981", "#cbd5e1", "#8b5cf6", "#06b6d4"];

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <AppLayout>
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    </AppLayout>
  );

  return (
    <AppLayout>
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight font-headline">Intelligence Ledger</h1>
            <p className="text-slate-500 font-medium mt-1">Deep-layer analytics of your economic patterns</p>
          </div>
          <div className="flex gap-3">
             <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-100 transition-all">
                <Download size={16} /> Export Reports
             </button>
             <button className="indigo-gradient text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-indigo-100">
                <Share2 size={18} /> Share Insights
             </button>
          </div>
        </div>

        {/* Top Intelligence Row */}
        <div className="grid grid-cols-12 gap-8 mb-10">
           <div className="col-span-12 lg:col-span-8">
              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group">
                <div className="flex items-center justify-between mb-10">
                   <div>
                      <h3 className="text-xl font-bold font-headline text-slate-900">Resource Trajectory</h3>
                      <p className="text-xs text-slate-500 font-medium">Income vs Expenditure Flow (6 Months)</p>
                   </div>
                   <div className="flex gap-4">
                      <div className="flex items-center gap-2">
                         <div className="w-2.5 h-2.5 rounded-full bg-indigo-600"></div>
                         <span className="text-[10px] font-bold text-slate-600 uppercase">Inflow</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                         <span className="text-[10px] font-bold text-slate-600 uppercase">Outflow</span>
                      </div>
                   </div>
                </div>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data?.monthlyTrends}>
                      <defs>
                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dy={15} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.1)', padding: '12px' }}
                      />
                      <Area type="monotone" dataKey="income" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                      <Area type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
           </div>

           <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
              <div className="bg-slate-900 p-8 rounded-[2rem] text-white flex-1 relative overflow-hidden group shadow-xl">
                 <div className="relative z-10 h-full flex flex-col justify-between">
                    <div>
                       <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold tracking-wider uppercase border border-white/5 mb-6">
                          <Sparkles size={12} className="text-indigo-400" /> AI Intelligence
                       </div>
                       
                       {data?.anomalies?.[0] ? (
                         <>
                           <h3 className="text-2xl font-bold tracking-tight font-headline mb-3">Anomaly Detected</h3>
                           <p className="text-slate-400 text-sm leading-relaxed mb-6">
                             Unexpected surge in <span className="text-white font-bold">{data.anomalies[0].category}</span> spending by 
                             <span className="text-rose-400 font-bold ml-1">₹{data.anomalies[0].amount.toLocaleString()}</span>.
                           </p>
                           <button className="w-full bg-white text-slate-900 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-100 transition-all">
                              Review Root Cause <ArrowUpRight size={16} />
                           </button>
                         </>
                       ) : (
                         <>
                           <h3 className="text-2xl font-bold tracking-tight font-headline mb-3">System Optimized</h3>
                           <p className="text-slate-400 text-sm leading-relaxed">
                             Allocations are within predicted tolerance zones. Financial health is currently <span className="text-emerald-400 font-bold">Stable</span>.
                           </p>
                         </>
                       )}
                    </div>
                    
                    <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                          <Zap size={20} />
                       </div>
                       <div>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none mb-1">Health Score</p>
                          <p className="text-lg font-bold">92.4 / 100</p>
                       </div>
                    </div>
                 </div>
                 {/* Background Accent */}
                 <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/20 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2 opacity-50"></div>
              </div>
           </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard 
            title="Avg. Burn Monthly" 
            value={`₹${(data?.summaryStats?.totalExpense / 6 || 0).toLocaleString()}`}
            icon={<TrendingDown className="text-rose-500" size={18} />}
            trend={{ value: 12.4, isPositive: false }}
            description="L6M Average"
          />
          <StatCard 
            title="Savings Velocity" 
            value={`${(100 - (data?.summaryStats?.expenseRatio || 0)).toFixed(1)}%`}
            icon={<Target className="text-emerald-500" size={18} />}
            trend={{ value: 2.4, isPositive: true }}
            description="Net Accumulation"
          />
          <StatCard 
            title="Primary Expense" 
            value={data?.categoryBreakdown?.[0]?.name || "None"}
            icon={<PieIcon className="text-indigo-500" size={18} />}
            description="Largest Sector"
          />
          <StatCard 
            title="Burn Rate Ratio" 
            value={`${(data?.summaryStats?.expenseRatio || 0).toFixed(1)}%`}
            icon={<AlertCircle className="text-amber-500" size={18} />}
            trend={{ value: 4.1, isPositive: false }}
            description="Inflow Utilization"
          />
        </div>

        {/* Lower Detail Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           <div className="col-span-12 lg:col-span-4">
              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm h-full">
                 <h3 className="text-xl font-bold font-headline text-slate-900 mb-8">Asset Allocation</h3>
                 <div className="h-[280px] relative mb-10">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data?.categoryBreakdown}
                          innerRadius={80}
                          outerRadius={105}
                          paddingAngle={8}
                          dataKey="value"
                          stroke="none"
                        >
                          {data?.categoryBreakdown?.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                           contentStyle={{ borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.1)' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aggregate</span>
                      <span className="text-2xl font-black text-slate-900">₹{(data?.summaryStats?.totalExpense / 1000).toFixed(1)}k</span>
                    </div>
                 </div>

                 <div className="space-y-4">
                    {data?.categoryBreakdown?.slice(0, 5).map((item: any, index: number) => (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: COLORS[index % COLORS.length]}}></div>
                          <span className="text-sm font-bold text-slate-600">{item.name}</span>
                        </div>
                        <span className="text-sm font-black text-slate-900">₹{item.value.toLocaleString()}</span>
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           <div className="col-span-12 lg:col-span-8">
              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm h-full">
                 <div className="flex items-center justify-between mb-10">
                    <h3 className="text-xl font-bold font-headline text-slate-900">Budget Adherence Compliance</h3>
                    <Target size={20} className="text-indigo-600" />
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {data?.budgetAdherence?.length > 0 ? data.budgetAdherence.slice(0, 4).map((budget: any) => (
                      <div key={budget.category} className="p-5 rounded-2xl bg-slate-50/50 border border-slate-100">
                        <div className="flex justify-between items-end mb-4">
                           <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{budget.category}</p>
                              <p className={`text-xl font-black ${budget.isOver ? 'text-rose-600' : 'text-slate-900'}`}>
                                 {Math.round(budget.percent)}%
                              </p>
                           </div>
                           <div className="text-right">
                              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Limit</p>
                              <p className="text-sm font-bold text-slate-600">₹{budget.limit.toLocaleString()}</p>
                           </div>
                        </div>
                        <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ${
                              budget.isOver ? "bg-rose-500" : budget.percent > 85 ? "bg-amber-500" : "bg-indigo-600"
                            }`}
                            style={{ width: `${Math.min(100, budget.percent)}%` }}
                          />
                        </div>
                      </div>
                    )) : (
                      <div className="col-span-2 py-20 text-center text-slate-400 font-medium italic border-2 border-dashed border-slate-100 rounded-3xl">
                        No budget compliance records found.
                      </div>
                    )}
                 </div>
              </div>
           </div>
        </div>
      </div>
    </AppLayout>
  );
}

function StatCard({ title, value, icon, trend, description }: any) {
  return (
    <div className="bg-white p-6 rounded-[1.5rem] border border-slate-200 shadow-sm transition-all hover:shadow-md group">
      <div className="flex justify-between items-start mb-6">
        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
          {icon}
        </div>
        {trend && (
           <div className={`text-[10px] font-bold px-2 py-1 rounded-lg ${trend.isPositive ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
              {trend.isPositive ? '↑' : '↓'} {trend.value}%
           </div>
        )}
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-2xl font-black text-slate-900 tracking-tight font-headline">{value}</h3>
        <p className="text-[11px] text-slate-500 font-medium mt-1 uppercase tracking-wider">{description}</p>
      </div>
    </div>
  );
}
