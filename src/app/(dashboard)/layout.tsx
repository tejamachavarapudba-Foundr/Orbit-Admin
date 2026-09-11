import { redirect } from "next/navigation";

import { Sidebar } from "@/components/Sidebar";
import { getSession } from "@/lib/session";
import { isAdminTierRole } from "@/lib/roleLabels";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  const role = session?.role?.toUpperCase();

  if (!session || session.expired || !isAdminTierRole(role)) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar email={session.email} isSuperUser={role === "SUPER_USER"} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
