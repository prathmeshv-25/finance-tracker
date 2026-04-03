"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Shield, Key, Eye } from "lucide-react";
import toast from "react-hot-toast";

const securitySchema = z.object({
  currentPassword: z.string().min(1, "Required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Required"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SecurityValues = z.infer<typeof securitySchema>;

export function SecuritySettings() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SecurityValues>({
    resolver: zodResolver(securitySchema),
  });

  const onSubmit = async (data: SecurityValues) => {
    try {
      const res = await fetch("/api/user/security", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "change-password",
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      });

      if (res.ok) {
        toast.success("Password updated successfully");
        reset();
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to update password");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleLogoutAll = async () => {
    if (!confirm("Are you sure you want to log out from all devices?")) return;
    try {
      const res = await fetch("/api/user/security", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout-all" }),
      });
      if (res.ok) {
        toast.success("Logged out from all devices");
        window.location.href = "/login";
      }
    } catch (error) {
      toast.error("Failed to invalidate sessions");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-bold tracking-tight">Security Settings</h3>
        <p className="text-slate-500 text-sm mt-1">Keep your account secure by managing your password and access.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            {...register("currentPassword")}
            error={errors.currentPassword?.message}
          />
          <Input
            label="New Password"
            type="password"
            {...register("newPassword")}
            error={errors.newPassword?.message}
          />
          <Input
            label="Confirm New Password"
            type="password"
            {...register("confirmPassword")}
            error={errors.confirmPassword?.message}
          />
          <div className="pt-2">
            <Button type="submit" loading={isSubmitting} className="w-full">
              Update Password
            </Button>
          </div>
        </form>

        <div className="space-y-4">
          <div className="p-4 border border-indigo-100 bg-indigo-50/30 rounded-2xl flex gap-4">
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
              <Shield size={20} />
            </div>
            <div>
              <p className="text-sm font-bold">Two-Factor Authentication</p>
              <p className="text-xs text-slate-500 mt-0.5">Add an extra layer of security to your account.</p>
              <button disabled className="text-indigo-600 text-xs font-bold mt-2 opacity-50 cursor-not-allowed">Enable 2FA</button>
            </div>
          </div>

          <div className="p-4 border border-slate-100 bg-slate-50/30 rounded-2xl flex gap-4">
            <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center shrink-0">
              <Key size={20} />
            </div>
            <div>
              <p className="text-sm font-bold">Active Sessions</p>
              <p className="text-xs text-slate-500 mt-0.5">Manage and sign out of other active sessions.</p>
              <button 
                onClick={handleLogoutAll}
                className="text-indigo-600 text-xs font-bold mt-2 hover:underline"
              >
                Logout from all devices
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
