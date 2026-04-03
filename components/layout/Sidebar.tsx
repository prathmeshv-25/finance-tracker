"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Receipt, 
  Wallet,
  Target, 
  Repeat, 
  Upload, 
  User,
  Settings,
  LogOut,
  PieChart
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Receipt, label: "Transactions", href: "/transactions" },
  { icon: Wallet, label: "Budgets", href: "/budgets" },
  { icon: Target, label: "Savings", href: "/savings" },
  { icon: Repeat, label: "Recurring", href: "/recurring" },
  { icon: PieChart, label: "Analytics", href: "/analytics" },
  { icon: Upload, label: "Imports", href: "/imports" },
  { icon: User, label: "Profile", href: "/profile" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export const Sidebar = () => {
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 flex flex-col py-6 px-4 bg-slate-50 border-r border-slate-200 z-50">
      <div className="mb-10 px-2">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight font-headline">FinTrack</h1>
        <p className="text-[10px] font-bold font-headline uppercase tracking-[0.2em] text-slate-500 mt-1 opacity-70">
          Premium Finance
        </p>
      </div>

      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group ${
                isActive
                  ? "text-indigo-700 font-bold border-r-4 border-indigo-700 bg-indigo-50/50"
                  : "text-slate-500 hover:text-indigo-600 hover:bg-slate-200/50"
              }`}
            >
              <item.icon
                size={20}
                className={isActive ? "text-indigo-700" : "text-slate-400 group-hover:text-indigo-600 transition-colors"}
              />
              <span className="text-sm font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-2 space-y-4">

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all duration-200 group"
        >
          <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
          <span className="text-sm font-semibold">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
