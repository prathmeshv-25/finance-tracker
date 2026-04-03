"use client";

import { Card } from "@/components/ui/Card";
import { Mail, Phone, Globe, Wallet } from "lucide-react";
import Link from "next/link";
import { ProfileAvatar } from "./ProfileAvatar";

interface ProfileCardProps {
  profile: any;
  onUpdate: () => void;
}

export function ProfileCard({ profile, onUpdate }: ProfileCardProps) {
  return (
    <Card className="p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 opacity-50" />
      
      {profile?.updatedAt && (
        <div className="absolute top-4 right-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest z-20">
          Last Updated: {new Date(profile.updatedAt).toLocaleDateString()}
        </div>
      )}
      
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
        <ProfileAvatar profile={profile} onUpdate={onUpdate} />
        
        <div className="flex-1 space-y-4 text-center md:text-left">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{profile?.name}</h2>
            <p className="text-slate-500 font-medium">{profile?.email}</p>
            <Link href="/settings?tab=profile">
              <button className="mt-3 inline-flex items-center gap-2 text-indigo-600 text-sm font-bold hover:underline">
                Edit Profile Information
              </button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="flex items-center gap-2.5 text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100/50">
              <Mail size={16} className="text-indigo-500" />
              <span className="text-sm font-bold">{profile?.email}</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100/50">
              <Phone size={16} className="text-indigo-500" />
              <span className="text-sm font-bold">{profile?.phone || "No phone added"}</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100/50">
              <Globe size={16} className="text-indigo-500" />
              <span className="text-sm font-bold">{profile?.country || "Earth"}</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100/50">
              <Wallet size={16} className="text-indigo-500" />
              <span className="text-sm font-bold">Base Currency: {profile?.currency}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
