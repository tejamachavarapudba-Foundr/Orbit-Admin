import { apiFetch } from "@/lib/api";
import { PageHeader } from "@/components/PageHeader";
import type { AuditLogResponse } from "@/lib/types";

export const dynamic = "force-dynamic";

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value));

const actionLabel = (action: string) =>
  action
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");

export default async function AuditLogsPage() {
  const log = await apiFetch<AuditLogResponse>("/admin/audit-logs");

  return (
    <>
      <PageHeader title="Audit log" description="The last 50 administrative actions taken on the platform." />

      <div className="p-8">
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted-bg/60 text-xs font-semibold uppercase tracking-wide text-muted">
                <th className="px-5 py-3">Action</th>
                <th className="px-5 py-3">Details</th>
                <th className="px-5 py-3">By</th>
                <th className="px-5 py-3">When</th>
              </tr>
            </thead>
            <tbody>
              {log.recentSystemActions.map((entry) => (
                <tr key={entry.id} className="border-b border-border last:border-0 align-top">
                  <td className="px-5 py-3.5">
                    <span className="rounded-full bg-muted-bg px-2.5 py-1 text-xs font-bold text-text">{actionLabel(entry.action)}</span>
                  </td>
                  <td className="max-w-md px-5 py-3.5 text-muted">{entry.details}</td>
                  <td className="px-5 py-3.5 text-muted">{entry.performedBy.name}</td>
                  <td className="px-5 py-3.5 whitespace-nowrap text-muted">{formatDateTime(entry.timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {log.recentSystemActions.length === 0 ? <p className="p-8 text-center text-sm text-muted">No actions logged yet.</p> : null}
        </div>
      </div>
    </>
  );
}
