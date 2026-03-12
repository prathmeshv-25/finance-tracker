"use client";

import { Menu, TrendingUp, Search, Bell, User } from "lucide-react";

interface NavbarProps {
  onMenuClick: () => void;
  userName?: string;
}

export const Navbar = ({ onMenuClick, userName }: NavbarProps) => {
  return (
    <header className="flex items-center justify-between px-4 lg:px-8 py-4 bg-surface border-b border-border sticky top-0 z-20">
      {/* Search - Left side (visible on desktop) */}
      <div className="hidden md:flex items-center flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input 
            type="text" 
            placeholder="Search transactions..." 
            className="w-full bg-surface-2 border border-border rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button onClick={onMenuClick} className="lg:hidden p-2 text-text-secondary hover:text-text-primary">
        <Menu className="w-5 h-5" />
      </button>

      {/* Brand - Center (mobile only) */}
      <div className="lg:hidden flex items-center gap-2.5">
        <div className="w-8 h-8 bg-primary-gradient rounded-lg flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-text-primary">FinTrack</span>
      </div>

      {/* Actions - Right side */}
      <div className="flex items-center gap-2 lg:gap-4">
        <button className="p-2 text-text-secondary hover:text-text-primary hover:bg-surface-2 rounded-xl transition-all relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-expense rounded-full border-2 border-surface"></span>
        </button>
        <div className="w-px h-6 bg-border mx-1"></div>
        <button className="flex items-center gap-3 p-1 pl-1 pr-3 hover:bg-surface-2 rounded-xl transition-all border border-transparent hover:border-border">
          <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center font-bold text-xs">
            {userName ? userName.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
          </div>
          <span className="hidden sm:inline text-sm font-medium text-text-primary">{userName || "Profile"}</span>
        </button>
      </div>
    </header>
  );
};

