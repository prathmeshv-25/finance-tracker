"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";

import { useEffect } from "react";
import { useUser } from "@/context/UserContext";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
  country: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  profile: any;
  onUpdate: () => void;
}

export function ProfileForm({ profile, onUpdate }: ProfileFormProps) {
  const { refreshProfile } = useUser();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.name || "",
      phone: profile?.phone || "",
      country: profile?.country || "",
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name || "",
        phone: profile.phone || "",
        country: profile.country || "",
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success("Profile updated successfully");
        await refreshProfile();
        onUpdate();
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
        <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl font-bold">
          {profile?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 className="text-lg font-bold">{profile?.name}</h3>
          <p className="text-slate-500 text-sm">{profile?.email}</p>
          <button type="button" className="text-indigo-600 text-xs font-bold mt-1 hover:underline">
            Change Profile Image
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Full Name"
          {...register("name")}
          error={errors.name?.message}
        />
        <Input
          label="Email Address"
          value={profile?.email}
          disabled
          className="bg-slate-50 opacity-70"
        />
        <Input
          label="Phone Number"
          {...register("phone")}
          error={errors.phone?.message}
          placeholder="+1 234 567 890"
        />
        <Input
          label="Country"
          {...register("country")}
          error={errors.country?.message}
          placeholder="e.g. India, USA"
        />
      </div>

      <div className="pt-4">
        <Button type="submit" loading={isSubmitting} className="w-full md:w-auto px-8">
          Save Changes
        </Button>
      </div>
    </form>
  );
}
