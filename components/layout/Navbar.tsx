import Link from "next/link";
import { Menu, Search, User, Bell } from "lucide-react";
import { NotificationBell } from "@/components/automation/NotificationBell";
import { useUser } from "@/context/UserContext";

interface NavbarProps {
  onMenuClick: () => void;
  userName?: string;
}

export const Navbar = ({ onMenuClick, userName }: NavbarProps) => {
  const { user } = useUser();
  const name = user?.name || userName || "Guest";

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 flex justify-between items-center px-4 lg:px-8 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
      {/* Search - Left side (visible on desktop) */}
      <div className="hidden md:flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-1.5 w-96 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
        <Search className="text-slate-400 w-4 h-4" />
        <input 
          className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-slate-400 ml-2" 
          placeholder="Search transactions, assets..." 
          type="text"
        />
      </div>

      {/* Mobile Menu Button */}
      <button onClick={onMenuClick} className="lg:hidden p-2 text-slate-500 hover:text-indigo-600">
        <Menu className="w-5 h-5" />
      </button>

      {/* Brand - Center (mobile only) */}
      <div className="lg:hidden font-black text-slate-900 tracking-tight font-headline">
        FinTrack
      </div>

      {/* Actions - Right side */}
      <div className="flex items-center gap-4 lg:gap-6">
        <div className="relative">
          <NotificationBell />
        </div>
        
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-bold text-slate-900 font-headline leading-none">
              {name}
            </p>
            <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mt-1">Gold Member</p>
          </div>
          <Link href="/profile" className="w-9 h-9 rounded-full bg-slate-200 border border-slate-200 overflow-hidden flex items-center justify-center">
             {user?.profileImage ? (
               <img 
                 alt={name} 
                 className="w-full h-full object-cover" 
                 src={user.profileImage} 
               />
             ) : (
               <div className="w-full h-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs uppercase">
                 {name.charAt(0)}
               </div>
             )}
          </Link>
        </div>
      </div>
    </header>
  );
};

