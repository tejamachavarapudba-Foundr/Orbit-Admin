import { redirect } from "next/navigation";

import { Sidebar } from "@/components/Sidebar";
import { getSession } from "@/lib/session";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session || session.expired || session.role.toUpperCase() !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar email={session.email} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
