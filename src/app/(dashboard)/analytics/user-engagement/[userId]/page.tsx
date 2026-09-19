import Link from "next/link";
import { ArrowLeft, CalendarClock } from "lucide-react";

import { apiFetch } from "@/lib/api";
import { PageHeader } from "@/components/PageHeader";
import { formatDayLabel, formatTime as formatTimeIst } from "@/lib/formatDate";
import type { UserEngagementDailyItem } from "@/lib/types";

export const dynamic = "force-dynamic";

const formatDay = formatDayLabel;

const formatTime = (value: string | null) => (value ? formatTimeIst(value) : "—");

// Down to the second — a real 40-second visit is meaningful data here, not
// noise to round away.
const formatDuration = (totalSeconds: number) => {
  if (totalSeconds === 0) return "—";
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (hours === 0 && seconds > 0) parts.push(`${seconds}s`);
  return parts.join(" ") || "—";
};

const todayKey = () => new Date().toISOString().slice(0, 10);
const daysAgoKey = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

type UserEngagementDailyPageProps = {
  params: Promise<{ userId: string }>;
  searchParams: Promise<{ from?: string; to?: string }>;
};

export default async function UserEngagementDailyPage({ params, searchParams }: UserEngagementDailyPageProps) {
  const { userId } = await params;
  const query = await searchParams;
  const from = query.from ?? daysAgoKey(6);
  const to = query.to ?? todayKey();

  const days = await apiFetch<UserEngagementDailyItem[]>(`/admin/analytics/engagement-daily/${userId}?from=${from}&to=${to}`);

  return (
    <>
      <PageHeader title="Day-wise activity" description={`Session count and time spent per day, ${from} to ${to}.`} icon={CalendarClock} />

      <div className="p-8">
        <Link
          href={`/analytics/user-engagement?from=${from}&to=${to}`}
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to all users
        </Link>

        <div className="glass overflow-hidden rounded-2xl">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border/60 text-xs font-semibold uppercase tracking-wide text-muted">
                <th className="px-5 py-3.5">Day</th>
                <th className="px-5 py-3.5">Sessions</th>
                <th className="px-5 py-3.5">First active</th>
                <th className="px-5 py-3.5">Engaged time</th>
              </tr>
            </thead>
            <tbody>
              {days.map((day) => (
                <tr key={day.date} className="border-b border-border/60 align-top transition last:border-0 hover:bg-white/30">
                  <td className="px-5 py-3.5 text-text">{formatDay(day.date)}</td>
                  <td className="px-5 py-3.5 text-text">{day.sessionCount}</td>
                  <td className="px-5 py-3.5 text-muted">{formatTime(day.firstActiveAt)}</td>
                  <td className="px-5 py-3.5 text-text">{formatDuration(day.engagedSeconds)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {days.length === 0 ? <p className="p-10 text-center text-sm text-muted">No data for this range.</p> : null}
        </div>
      </div>
    </>
  );
}
