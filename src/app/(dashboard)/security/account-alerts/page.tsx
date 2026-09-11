import Link from "next/link";
import { ShieldAlert } from "lucide-react";

import { apiFetch } from "@/lib/api";
import { PageHeader } from "@/components/PageHeader";
import type { AccountAlertsResponse } from "@/lib/types";

export const dynamic = "force-dynamic";

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value));

const actionLabel = (action: string) =>
  action
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");

type AccountAlertsPageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function AccountAlertsPage({ searchParams }: AccountAlertsPageProps) {
  const params = await searchParams;
  const page = Number(params.page ?? 1) || 1;
  const limit = 50;

  const result = await apiFetch<AccountAlertsResponse>(`/admin/security/account-alerts?limit=${limit}&page=${page}`);

  return (
    <>
      <PageHeader
        title="Account alerts"
        description="Role changes, bans/unbans, admin creation, and hard-deletes — the same events that email every Super Admin immediately when they happen."
        icon={ShieldAlert}
      />

      <div className="p-8">
        <div className="glass overflow-hidden rounded-2xl">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border/60 text-xs font-semibold uppercase tracking-wide text-muted">
                <th className="px-5 py-3.5">Event</th>
                <th className="px-5 py-3.5">Details</th>
                <th className="px-5 py-3.5">By</th>
                <th className="px-5 py-3.5">IP address</th>
                <th className="px-5 py-3.5">When</th>
              </tr>
            </thead>
            <tbody>
              {result.alerts.map((alert) => (
                <tr key={alert.id} className="border-b border-border/60 align-top transition last:border-0 hover:bg-white/30">
                  <td className="px-5 py-3.5">
                    <span className="rounded-full bg-danger-bg px-2.5 py-1 text-xs font-bold text-danger">{actionLabel(alert.action)}</span>
                  </td>
                  <td className="max-w-md px-5 py-3.5 text-muted">{alert.details}</td>
                  <td className="px-5 py-3.5 text-muted">{alert.performedBy}</td>
                  <td className="px-5 py-3.5 text-muted">{alert.ipAddress ?? "—"}</td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-muted">{formatDateTime(alert.timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {result.alerts.length === 0 ? <p className="p-10 text-center text-sm text-muted">No account-level changes yet.</p> : null}
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-muted">
          <span>
            Page {result.meta.currentPage} of {Math.max(result.meta.totalPages, 1)} · {result.meta.totalItems} total events
          </span>
          <div className="flex gap-2">
            {page > 1 ? (
              <Link
                href={`/security/account-alerts?page=${page - 1}`}
                className="rounded-lg border border-border px-3 py-1.5 font-semibold text-text hover:bg-muted-bg"
              >
                Previous
              </Link>
            ) : null}
            {page < result.meta.totalPages ? (
              <Link
                href={`/security/account-alerts?page=${page + 1}`}
                className="rounded-lg border border-border px-3 py-1.5 font-semibold text-text hover:bg-muted-bg"
              >
                Next
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
