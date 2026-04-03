"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";
import { useEffect } from "react";

interface NotificationSettingsProps {
  profile: any;
  onUpdate: () => void;
}

export function NotificationSettings({ profile, onUpdate }: NotificationSettingsProps) {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    defaultValues: {
      emailNotifications: profile?.emailNotifications ?? true,
      appNotifications: profile?.appNotifications ?? true,
      reminderNotifications: profile?.reminderNotifications ?? true,
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        emailNotifications: profile.emailNotifications ?? true,
        appNotifications: profile.appNotifications ?? true,
        reminderNotifications: profile.reminderNotifications ?? true,
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: any) => {
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success("Notification preferences updated");
        onUpdate();
      } else {
        toast.error("Failed to update preferences");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const options = [
    { id: "emailNotifications", label: "Email Notifications", description: "Receive transaction summaries and alerts via email." },
    { id: "appNotifications", label: "App Notifications", description: "Get real-time push notifications on your device." },
    { id: "reminderNotifications", label: "Reminder Notifications", description: "Stay updated on upcoming payment deadlines." },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-bold tracking-tight">Notification Preferences</h3>
        <p className="text-slate-500 text-sm mt-1">Choose how you want to be notified about your financial activities.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          {options.map((option) => (
            <div key={option.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100/50 hover:bg-slate-100 transition-colors">
              <div className="flex-1 pr-4">
                <p className="text-sm font-bold text-slate-800">{option.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{option.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" {...register(option.id as any)} />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          ))}
        </div>

        <div className="pt-4">
          <Button type="submit" loading={isSubmitting} className="w-full md:w-auto px-8">
            Save Notification Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
