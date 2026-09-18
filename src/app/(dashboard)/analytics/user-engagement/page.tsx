import Link from "next/link";
import { Clock } from "lucide-react";

import { apiFetch } from "@/lib/api";
import { PageHeader } from "@/components/PageHeader";
import type { UserEngagementSummaryResponse } from "@/lib/types";

export const dynamic = "force-dynamic";

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value));

const formatMinutes = (minutes: number) => {
  if (minutes < 1) return "< 1m";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
};

const todayKey = () => new Date().toISOString().slice(0, 10);
const daysAgoKey = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

type UserEngagementPageProps = {
  searchParams: Promise<{ from?: string; to?: string; page?: string }>;
};

export default async function UserEngagementPage({ searchParams }: UserEngagementPageProps) {
  const params = await searchParams;
  const from = params.from ?? daysAgoKey(6);
  const to = params.to ?? todayKey();
  const page = Number(params.page ?? 1) || 1;
  const limit = 50;

  const summary = await apiFetch<UserEngagementSummaryResponse>(
    `/admin/analytics/engagement-summary?from=${from}&to=${to}&page=${page}&limit=${limit}`
  );

  return (
    <>
      <PageHeader
        title="User engagement"
        description="Day-wise login activity and time spent per user, for a chosen date range."
        icon={Clock}
      />

      <div className="p-8">
        <form className="glass mb-4 flex flex-wrap items-end gap-3 rounded-2xl p-4" method="GET">
          <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-muted">
            From
            <input
              type="date"
              name="from"
              defaultValue={from}
              max={to}
              className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-muted">
            To
            <input
              type="date"
              name="to"
              defaultValue={to}
              max={todayKey()}
              className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text"
            />
          </label>
          <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary hover:opacity-90">
            Apply range
          </button>
        </form>

        <div className="glass overflow-hidden rounded-2xl">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border/60 text-xs font-semibold uppercase tracking-wide text-muted">
                <th className="px-5 py-3.5">User</th>
                <th className="px-5 py-3.5">Logins in range</th>
                <th className="px-5 py-3.5">Engaged time</th>
                <th className="px-5 py-3.5">Last login</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody>
              {summary.items.map((item) => (
                <tr key={item.userId} className="border-b border-border/60 align-top transition last:border-0 hover:bg-white/30">
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-text">{item.fullName}</div>
                    <div className="text-xs text-muted">{item.email}</div>
                  </td>
                  <td className="px-5 py-3.5 text-text">{item.loginCount}</td>
                  <td className="px-5 py-3.5 text-text">{formatMinutes(item.engagedMinutes)}</td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-muted">{formatDateTime(item.lastLoginAt)}</td>
                  <td className="px-5 py-3.5">
                    <Link
                      href={`/analytics/user-engagement/${item.userId}?from=${from}&to=${to}`}
                      className="font-semibold text-primary hover:underline"
                    >
                      Day-wise view
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {summary.items.length === 0 ? (
            <p className="p-10 text-center text-sm text-muted">No logins recorded in this range.</p>
          ) : null}
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-muted">
          <span>
            Page {summary.meta.currentPage} of {Math.max(summary.meta.totalPages, 1)} · {summary.meta.totalItems} user(s) active in
            range
          </span>
          <div className="flex gap-2">
            {page > 1 ? (
              <Link
                href={`/analytics/user-engagement?from=${from}&to=${to}&page=${page - 1}`}
                className="rounded-lg border border-border px-3 py-1.5 font-semibold text-text hover:bg-muted-bg"
              >
                Previous
              </Link>
            ) : null}
            {page < summary.meta.totalPages ? (
              <Link
                href={`/analytics/user-engagement?from=${from}&to=${to}&page=${page + 1}`}
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
