import { MonitorSmartphone } from "lucide-react";

import { apiFetch } from "@/lib/api";
import { PageHeader } from "@/components/PageHeader";
import { getSession } from "@/lib/session";
import type { AdminSession } from "@/lib/types";

import { SessionRow } from "./SessionRow";

export const dynamic = "force-dynamic";

export default async function SessionsPage() {
  const [sessions, currentSession] = await Promise.all([
    apiFetch<AdminSession[]>("/admin/security/sessions"),
    getSession()
  ]);

  return (
    <>
      <PageHeader
        title="Active sessions"
        description="Signed-in admin devices. Super Admins see every admin's sessions; everyone else sees only their own."
        icon={MonitorSmartphone}
      />

      <div className="p-8">
        <div className="glass overflow-hidden rounded-2xl">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border/60 text-xs font-semibold uppercase tracking-wide text-muted">
                <th className="px-5 py-3.5">Account</th>
                <th className="px-5 py-3.5">IP address</th>
                <th className="px-5 py-3.5">Device</th>
                <th className="px-5 py-3.5">Last active</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <SessionRow key={session.id} session={session} isCurrentUser={session.userId === currentSession?.userId} />
              ))}
            </tbody>
          </table>

          {sessions.length === 0 ? <p className="p-10 text-center text-sm text-muted">No active sessions.</p> : null}
        </div>
      </div>
    </>
  );
}
