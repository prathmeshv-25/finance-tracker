import { redirect } from "next/navigation";
import { getAuthUser } from "@/services/authService";
import AppLayout from "@/components/layout/AppLayout";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getAuthUser();
  if (!user) redirect("/login");

  return <AppLayout userName={user.name}>{children}</AppLayout>;
}
