import Link from "next/link";
import { Clock } from "lucide-react";

import { apiFetch } from "@/lib/api";
import { PageHeader } from "@/components/PageHeader";
import { formatDateTime, formatDayLabel, formatTime } from "@/lib/formatDate";
import type { DailySignupItem, UserEngagementSummaryResponse } from "@/lib/types";

export const dynamic = "force-dynamic";

// Down to the second -- a real 40-second visit is meaningful data (this
// report exists to feed future R&D, not just a glanceable dashboard
// number), so it shows as "40s", never rounds away to "0m".
const formatDuration = (totalSeconds: number) => {
  if (totalSeconds < 1) return "0s";
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (hours === 0 && seconds > 0) parts.push(`${seconds}s`);
  return parts.join(" ") || "0s";
};

const todayKey = () => new Date().toISOString().slice(0, 10);
const daysAgoKey = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

type ViewMode = "signups" | "signins";

type UserEngagementPageProps = {
  searchParams: Promise<{ from?: string; to?: string; page?: string; view?: string }>;
};

export default async function UserEngagementPage({ searchParams }: UserEngagementPageProps) {
  const params = await searchParams;
  const from = params.from ?? daysAgoKey(6);
  const to = params.to ?? todayKey();
  const page = Number(params.page ?? 1) || 1;
  const limit = 50;
  const view: ViewMode = params.view === "signins" ? "signins" : "signups";

  const summary =
    view === "signins"
      ? await apiFetch<UserEngagementSummaryResponse>(
          `/admin/analytics/engagement-summary?from=${from}&to=${to}&page=${page}&limit=${limit}`
        )
      : null;
  const dailySignups = view === "signups" ? await apiFetch<DailySignupItem[]>(`/admin/analytics/daily-signups?from=${from}&to=${to}`) : null;
  const totalSignups = dailySignups?.reduce((sum, day) => sum + day.count, 0) ?? 0;

  const tabLinkHref = (target: ViewMode) => `/analytics/user-engagement?from=${from}&to=${to}&view=${target}`;
  const tabClass = (target: ViewMode) =>
    `rounded-lg px-4 py-2 text-sm font-semibold transition ${
      view === target ? "bg-primary text-on-primary" : "border border-border text-text hover:bg-muted-bg"
    }`;

  return (
    <>
      <PageHeader
        title="User engagement"
        description="Day-wise activity and time spent per user, for a chosen date range."
        icon={Clock}
      />

      <div className="p-8">
        <div className="mb-4 flex flex-wrap gap-2">
          <Link href={tabLinkHref("signups")} className={tabClass("signups")}>
            Daily sign-ups
          </Link>
          <Link href={tabLinkHref("signins")} className={tabClass("signins")}>
            Daily sign-ins
          </Link>
        </div>

        <form className="glass mb-6 flex flex-wrap items-end gap-3 rounded-2xl p-4" method="GET">
          <input type="hidden" name="view" value={view} />
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

        {view === "signups" && dailySignups ? (
          <div className="glass overflow-hidden rounded-2xl">
            <div className="flex items-center justify-between border-b border-border/60 px-5 py-3.5">
              <h2 className="text-sm font-semibold text-text">Daily sign-ups</h2>
              <span className="text-xs font-semibold uppercase tracking-wide text-muted">{totalSignups} new in range</span>
            </div>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border/60 text-xs font-semibold uppercase tracking-wide text-muted">
                  <th className="px-5 py-3.5">Date</th>
                  <th className="px-5 py-3.5">New sign-ups</th>
                  <th className="px-5 py-3.5" />
                </tr>
              </thead>
              <tbody>
                {dailySignups.map((day) => (
                  <tr key={day.date} className="border-b border-border/60 align-top last:border-0">
                    <td className="whitespace-nowrap px-5 py-3.5 font-semibold text-text">{formatDayLabel(day.date)}</td>
                    <td className="px-5 py-3.5 text-text">{day.count}</td>
                    <td className="px-5 py-3.5">
                      {day.count > 0 ? (
                        <details>
                          <summary className="cursor-pointer font-semibold text-primary hover:underline">View sign-ups</summary>
                          <ul className="mt-3 space-y-2">
                            {day.users.map((user) => (
                              <li key={user.userId} className="rounded-lg border border-border/60 bg-surface px-3 py-2 text-xs">
                                <div className="font-semibold text-text">{user.fullName}</div>
                                <div className="text-muted">{user.email}</div>
                                <div className="mt-1 flex flex-wrap items-center gap-2 text-muted">
                                  <span>{formatTime(user.createdAt)}</span>
                                  <span>·</span>
                                  <span className="uppercase">{user.role}</span>
                                  <span>·</span>
                                  <span>{user.emailVerified ? "Email verified" : "Email unverified"}</span>
                                  <span>·</span>
                                  <span>{user.phoneVerified ? "Phone verified" : "Phone unverified"}</span>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </details>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        {view === "signins" && summary ? (
          <>
            <div className="glass overflow-hidden rounded-2xl">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border/60 text-xs font-semibold uppercase tracking-wide text-muted">
                    <th className="px-5 py-3.5">User</th>
                    <th className="px-5 py-3.5">Sessions in range</th>
                    <th className="px-5 py-3.5">Engaged time</th>
                    <th className="px-5 py-3.5">Last active</th>
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
                      <td className="px-5 py-3.5 text-text">{item.sessionCount}</td>
                      <td className="px-5 py-3.5 text-text">{formatDuration(item.engagedSeconds)}</td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-muted">{formatDateTime(item.lastActiveAt)}</td>
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
                <p className="p-10 text-center text-sm text-muted">No activity recorded in this range.</p>
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
                    href={`/analytics/user-engagement?from=${from}&to=${to}&view=signins&page=${page - 1}`}
                    className="rounded-lg border border-border px-3 py-1.5 font-semibold text-text hover:bg-muted-bg"
                  >
                    Previous
                  </Link>
                ) : null}
                {page < summary.meta.totalPages ? (
                  <Link
                    href={`/analytics/user-engagement?from=${from}&to=${to}&view=signins&page=${page + 1}`}
                    className="rounded-lg border border-border px-3 py-1.5 font-semibold text-text hover:bg-muted-bg"
                  >
                    Next
                  </Link>
                ) : null}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}
