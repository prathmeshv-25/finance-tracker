"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/Card";
import { User, Lock, Settings as SettingsIcon, Bell } from "lucide-react";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { SecuritySettings } from "@/components/settings/SecuritySettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { ThemeToggle } from "@/components/settings/ThemeToggle";
import { CurrencySelector } from "@/components/settings/CurrencySelector";
import toast from "react-hot-toast";

type SettingsTab = "profile" | "appearance" | "security" | "notifications";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
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

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "appearance", label: "Appearance", icon: SettingsIcon },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  if (loading) {
    return (
      <AppLayout>
        <div className="p-8 animate-pulse space-y-4 max-w-5xl mx-auto">
          <div className="h-8 w-48 bg-slate-200 rounded"></div>
          <div className="h-64 bg-slate-100 rounded-2xl"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto p-4 lg:p-8 max-w-5xl space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Settings</h1>
          <p className="text-slate-500 mt-1">Manage your account preferences and security.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 flex flex-row lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as SettingsTab)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </aside>

          <div className="flex-1">
            <Card className="p-6 lg:p-10">
              {activeTab === "profile" && (
                <ProfileForm profile={profile} onUpdate={fetchProfile} />
              )}
              {activeTab === "appearance" && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-bold tracking-tight">Visual appearance</h3>
                    <p className="text-slate-500 text-sm mt-1">Customize how the application looks for you.</p>
                  </div>
                  <ThemeToggle />
                  <CurrencySelector profile={profile} onUpdate={fetchProfile} />
                </div>
              )}
              {activeTab === "security" && (
                <SecuritySettings />
              )}
              {activeTab === "notifications" && (
                <NotificationSettings profile={profile} onUpdate={fetchProfile} />
              )}
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
