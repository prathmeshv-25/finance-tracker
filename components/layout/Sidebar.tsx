"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ArrowRightLeft, 
  PieChart, 
  Target, 
  Settings,
  LogOut,
  Wallet
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: ArrowRightLeft, label: "Transactions", href: "/transactions" },
  { icon: PieChart, label: "Budgets", href: "/budgets" },
  { icon: Target, label: "Savings", href: "/savings" },
];

export const Sidebar = () => {
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  return (
    <aside className="w-64 h-screen glass-card !rounded-none border-r border-slate-200/50 flex flex-col fixed left-0 top-0 z-40">
      <div className="p-8 flex items-center gap-3">
        <div className="w-11 h-11 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
          <Wallet size={24} />
        </div>
        <div>
          <span className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-indigo-700 via-indigo-600 to-indigo-400 tracking-tight">
            FinTrack
          </span>
          <div className="h-1 w-8 bg-indigo-600 rounded-full mt-0.5" />
        </div>
      </div>

      <nav className="flex-1 px-4 mt-6 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-300 group ${
                isActive 
                  ? "bg-indigo-600 text-white shadow-xl shadow-indigo-100" 
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <item.icon size={20} className={isActive ? "text-white" : "text-slate-400 group-hover:text-slate-700 transition-colors"} />
              <span className="font-bold text-sm tracking-tight">{item.label}</span>
              {!isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-indigo-400 transition-colors" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-slate-100/50">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-5 py-3.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all duration-300 group"
        >
          <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
          <span className="font-bold text-sm tracking-tight">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
