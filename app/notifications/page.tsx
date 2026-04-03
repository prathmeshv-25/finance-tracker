"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Bell, CheckCircle, Info, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { formatDate } from "@/utils/dateHelpers";
import { AppLayout } from "@/components/layout/AppLayout";

interface Notification {
  id: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

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
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    try {
      const response = await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAll: true }),
      });
      if (response.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        toast.success("All marked as read");
      }
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "reminder": return <AlertCircle className="h-5 w-5 text-orange-500" />;
      case "transaction": return <CheckCircle className="h-5 w-5 text-green-500" />;
      default: return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto p-6 max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
          <p className="text-slate-500">Stay updated on your financial automation events.</p>
        </div>
        <Button variant="secondary" onClick={markAllRead}>Mark All as Read</Button>
      </div>

      <div className="space-y-3">
        {loading ? (
          <p>Loading notifications...</p>
        ) : notifications.length === 0 ? (
          <Card className="p-12 text-center text-slate-500 flex flex-col items-center gap-4">
            <Bell className="h-12 w-12 text-slate-200" />
            No notifications yet
          </Card>
        ) : (
          notifications.map(n => (
            <Card key={n.id} className={`p-4 flex items-start gap-4 ${!n.isRead ? "border-l-4 border-l-blue-500" : ""}`}>
              {getTypeIcon(n.type)}
              <div className="flex-1">
                <p className={`text-sm ${!n.isRead ? "font-semibold" : ""}`}>{n.message}</p>
                <p className="text-xs text-slate-500 mt-1">{formatDate(n.createdAt, "dd/MM/yyyy HH:mm")}</p>
              </div>
            </Card>
          ))
        )}
      </div>
      </div>
    </AppLayout>
  );
}
