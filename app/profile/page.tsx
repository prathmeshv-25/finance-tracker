"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { ThemeToggle } from "@/components/settings/ThemeToggle";
import { CurrencySelector } from "@/components/settings/CurrencySelector";
import { SecuritySettings } from "@/components/settings/SecuritySettings";
import { Settings, Shield, Bell, User, Layout } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/user/profile");
      if (res.ok) {
        setProfile(await res.json());
      }
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="max-w-5xl mx-auto py-20 px-8">
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-[1000px] mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight font-headline">Account Protocol</h1>
            <p className="text-slate-500 font-medium mt-1">Identity and preference configurations</p>
          </div>
          <div className="flex gap-3">
             <Link href="/settings">
                <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
                  <Settings size={18} /> Global Settings
                </button>
             </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10">
          {/* Core Profile Section */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
             <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex items-center gap-2">
                <User size={18} className="text-indigo-600" />
                <h3 className="font-bold text-slate-900">Personal Identity</h3>
             </div>
             <div className="p-8">
                <ProfileCard profile={profile} onUpdate={fetchProfile} />
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
             {/* Notifications */}
             <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex items-center gap-2">
                   <Bell size={18} className="text-indigo-600" />
                   <h3 className="font-bold text-slate-900">Communication</h3>
                </div>
                <div className="p-8 flex-1">
                   <NotificationSettings profile={profile} onUpdate={fetchProfile} />
                </div>
             </div>

             {/* Appearance */}
             <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex items-center gap-2">
                   <Layout size={18} className="text-indigo-600" />
                   <h3 className="font-bold text-slate-900">Environment</h3>
                </div>
                <div className="p-8 flex-1 space-y-8">
                   <div className="space-y-6">
                      <ThemeToggle />
                      <CurrencySelector profile={profile} onUpdate={fetchProfile} />
                   </div>
                </div>
             </div>
          </div>

          {/* Security */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
             <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex items-center gap-2">
                <Shield size={18} className="text-indigo-600" />
                <h3 className="font-bold text-slate-900">Security Vault</h3>
             </div>
             <div className="p-8">
                <SecuritySettings />
             </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
