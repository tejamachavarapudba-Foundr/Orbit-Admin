import Link from "next/link";
import { History } from "lucide-react";

import { apiFetch } from "@/lib/api";
import { PageHeader } from "@/components/PageHeader";
import type { LoginHistoryResponse } from "@/lib/types";

export const dynamic = "force-dynamic";

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value));

const reasonLabel: Record<string, string> = {
  invalid_password: "Wrong password"
};

type LoginHistoryPageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function LoginHistoryPage({ searchParams }: LoginHistoryPageProps) {
  const params = await searchParams;
  const page = Number(params.page ?? 1) || 1;
  const limit = 50;

  const history = await apiFetch<LoginHistoryResponse>(`/admin/security/login-history?limit=${limit}&page=${page}`);

  return (
    <>
      <PageHeader
        title="Login history"
        description="Every sign-in attempt on admin-tier accounts (Content Admin and above) — successful and failed."
        icon={History}
      />

      <div className="p-8">
        <div className="glass overflow-hidden rounded-2xl">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border/60 text-xs font-semibold uppercase tracking-wide text-muted">
                <th className="px-5 py-3.5">Account</th>
                <th className="px-5 py-3.5">Result</th>
                <th className="px-5 py-3.5">IP address</th>
                <th className="px-5 py-3.5">Device</th>
                <th className="px-5 py-3.5">When</th>
              </tr>
            </thead>
            <tbody>
              {history.events.map((event) => (
                <tr key={event.id} className="border-b border-border/60 align-top transition last:border-0 hover:bg-white/30">
                  <td className="px-5 py-3.5 text-text">{event.email}</td>
                  <td className="px-5 py-3.5">
                    {event.success ? (
                      <span className="rounded-full bg-success-bg px-2.5 py-1 text-xs font-bold text-success">Success</span>
                    ) : (
                      <span className="rounded-full bg-danger-bg px-2.5 py-1 text-xs font-bold text-danger">
                        {event.reason ? (reasonLabel[event.reason] ?? event.reason) : "Failed"}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-muted">{event.ipAddress ?? "—"}</td>
                  <td className="max-w-xs truncate px-5 py-3.5 text-muted" title={event.userAgent ?? undefined}>
                    {event.userAgent ?? "—"}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-muted">{formatDateTime(event.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {history.events.length === 0 ? <p className="p-10 text-center text-sm text-muted">No login attempts recorded yet.</p> : null}
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-muted">
          <span>
            Page {history.meta.currentPage} of {Math.max(history.meta.totalPages, 1)} · {history.meta.totalItems} total attempts
          </span>
          <div className="flex gap-2">
            {page > 1 ? (
              <Link
                href={`/security/login-history?page=${page - 1}`}
                className="rounded-lg border border-border px-3 py-1.5 font-semibold text-text hover:bg-muted-bg"
              >
                Previous
              </Link>
            ) : null}
            {page < history.meta.totalPages ? (
              <Link
                href={`/security/login-history?page=${page + 1}`}
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
