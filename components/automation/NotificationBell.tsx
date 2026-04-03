"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { formatDate } from "@/utils/dateHelpers";

interface Notification {
  id: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notifications");
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error("Failed to fetch notifications");
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (response.ok) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      }
    } catch (error) {
      console.error("Failed to mark as read");
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5 text-slate-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white ring-2 ring-white">
            {unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 z-50">
          <Card className="border shadow-lg p-0 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h4 className="font-semibold text-sm">Notifications</h4>
              <Link
                href="/notifications"
                className="text-xs text-blue-500 hover:underline"
                onClick={() => setIsOpen(false)}
              >
                View All
              </Link>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  No notifications yet
                </div>
              ) : (
                notifications.slice(0, 5).map(notification => {
                  const Icon = notification.type === "budget" ? "🔴" : 
                               notification.type === "savings" ? "🎯" : 
                               notification.type === "reminder" ? "⏰" : "🔔";
                  
                  return (
                    <div
                      key={notification.id}
                      className={`p-4 border-b flex gap-3 cursor-pointer transition-hover hover:bg-slate-50 ${
                        !notification.isRead ? "bg-blue-50/50" : "bg-white"
                      }`}
                      onClick={() => !notification.isRead && markAsRead(notification.id)}
                    >
                      <div className="mt-0.5 text-base flex-shrink-0">{Icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs text-slate-800 leading-normal ${!notification.isRead ? "font-semibold" : ""}`}>
                          {notification.message}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-1">
                          {formatDate(notification.createdAt, "dd/MM/yyyy HH:mm")}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
