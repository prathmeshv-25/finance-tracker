"use client";

import { Camera, User, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useRef, useState } from "react";
import { useUser } from "@/context/UserContext";

interface ProfileAvatarProps {
  profile: any;
  onUpdate: () => void;
}

export function ProfileAvatar({ profile, onUpdate }: ProfileAvatarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { refreshProfile } = useUser();

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must be less than 2MB");
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      
      try {
        const res = await fetch("/api/user/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profileImage: base64String }),
        });

        if (res.ok) {
          toast.success("Profile picture updated!");
          await refreshProfile();
          onUpdate();
        } else {
          toast.error("Failed to update profile picture");
        }
      } catch (error) {
        toast.error("An error occurred during upload");
      } finally {
        setIsUploading(false);
      }
    };

    reader.onerror = () => {
      toast.error("Failed to read file");
      setIsUploading(false);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="relative group">
      <div className="w-24 h-24 rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-50 to-indigo-100 border-4 border-white shadow-xl flex items-center justify-center text-indigo-600 font-extrabold text-3xl">
        {isUploading ? (
          <Loader2 className="animate-spin text-indigo-600" size={32} />
        ) : profile?.profileImage ? (
          <img src={profile.profileImage} alt={profile.name} className="w-full h-full object-cover" />
        ) : (
          profile?.name?.charAt(0).toUpperCase() || <User size={40} />
        )}
      </div>
      
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/*"
      />

      <button 
        onClick={handleUploadClick}
        disabled={isUploading}
        className="absolute -bottom-1 -right-1 w-9 h-9 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg border-2 border-white group-hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Camera size={18} />
      </button>
    </div>
  );
}
