"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import type { AdminAnalytics } from "@/lib/types";

// Reference categorical palette (validated: worst adjacent CVD ΔE 9.1,
// worst adjacent normal-vision ΔE 19.6 — see the dataviz skill).
const CATEGORICAL = ["#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4", "#008300", "#4a3aa7", "#e34948"];
const STATUS = { good: "#0ca30c", warning: "#fab219", serious: "#ec835a", critical: "#d03b3b" };

const chartSurface = { fontSize: 12, fill: "var(--color-muted)" };

const formatDay = (iso: string) => new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(iso));

const formatLabel = (value: string) =>
  value
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");

type StatusRowProps = { label: string; rows: { status: string; count: number }[]; toneFor: (status: string) => string };

const StatusRow = ({ label, rows, toneFor }: StatusRowProps) => {
  const total = rows.reduce((sum, r) => sum + r.count, 0);
  return (
    <div className="glass rounded-2xl p-5">
      <h3 className="font-display text-sm font-bold text-text">{label}</h3>
      {total === 0 ? (
        <p className="mt-3 text-sm text-muted">No data yet.</p>
      ) : (
        <div className="mt-4 flex flex-col gap-2.5">
          {rows.map((row) => (
            <div key={row.status} className="flex items-center gap-3">
              <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full" style={{ backgroundColor: toneFor(row.status) }} />
              <span className="w-28 flex-shrink-0 truncate text-xs font-semibold text-muted">{formatLabel(row.status)}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted-bg">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${total > 0 ? (row.count / total) * 100 : 0}%`, backgroundColor: toneFor(row.status) }}
                />
              </div>
              <span className="w-8 flex-shrink-0 text-right text-xs font-bold tabular-nums text-text">{row.count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const founderVerificationTone = (status: string) => {
  if (status === "approved") return STATUS.good;
  if (status === "rejected") return STATUS.critical;
  return STATUS.warning;
};

const applicationTone = (status: string) => {
  const s = status.toLowerCase();
  if (s === "accepted" || s === "approved") return STATUS.good;
  if (s === "rejected" || s === "declined") return STATUS.critical;
  return STATUS.warning;
};

const meetingTone = (status: string) => {
  const s = status.toLowerCase();
  if (s === "completed") return STATUS.good;
  if (s === "cancelled" || s === "declined") return STATUS.critical;
  return STATUS.warning;
};

const eventTone = (status: string) => (status === "CANCELLED" ? STATUS.critical : STATUS.good);

export const AnalyticsCharts = ({ analytics }: { analytics: AdminAnalytics }) => {
  const growthData = useMemo(() => {
    const byDate = new Map<string, { date: string; signups: number; posts: number }>();
    for (const row of analytics.growth.signupsByDay) {
      byDate.set(row.date, { date: row.date, signups: row.count, posts: byDate.get(row.date)?.posts ?? 0 });
    }
    for (const row of analytics.growth.postsByDay) {
      byDate.set(row.date, { date: row.date, signups: byDate.get(row.date)?.signups ?? 0, posts: row.count });
    }
    return Array.from(byDate.values()).sort((a, b) => a.date.localeCompare(b.date));
  }, [analytics.growth]);

  const roleData = useMemo(() => {
    const sorted = [...analytics.distribution.roleBreakdown].sort((a, b) => b.count - a.count);
    const top = sorted.slice(0, 7);
    const rest = sorted.slice(7).reduce((sum, r) => sum + r.count, 0);
    const rows = top.map((r) => ({ role: formatLabel(r.role), count: r.count }));
    if (rest > 0) rows.push({ role: "Other", count: rest });
    return rows;
  }, [analytics.distribution.roleBreakdown]);

  return (
    <div className="flex flex-col gap-5">
      <div className="glass rounded-2xl p-5">
        <h3 className="font-display text-sm font-bold text-text">Signups &amp; posts — last 30 days</h3>
        <div className="mt-4 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={growthData} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="date" tickFormatter={formatDay} tick={chartSurface} axisLine={{ stroke: "var(--color-border)" }} tickLine={false} minTickGap={24} />
              <YAxis tick={chartSurface} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip
                labelFormatter={(value) => formatDay(String(value))}
                contentStyle={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="signups" name="Signups" stroke={CATEGORICAL[0]} strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="posts" name="Posts" stroke={CATEGORICAL[1]} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass rounded-2xl p-5">
        <h3 className="font-display text-sm font-bold text-text">Member role mix</h3>
        <div className="mt-4 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={roleData} layout="vertical" margin={{ top: 4, right: 24, bottom: 0, left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
              <XAxis type="number" tick={chartSurface} axisLine={{ stroke: "var(--color-border)" }} tickLine={false} allowDecimals={false} />
              <YAxis type="category" dataKey="role" tick={chartSurface} axisLine={false} tickLine={false} width={110} />
              <Tooltip contentStyle={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
              <Bar dataKey="count" name="Members" radius={[0, 4, 4, 0]}>
                {roleData.map((entry, index) => (
                  <Cell key={entry.role} fill={CATEGORICAL[index % CATEGORICAL.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <StatusRow label="Founder verification funnel" rows={analytics.verification.founderVerificationBreakdown} toneFor={founderVerificationTone} />
        <StatusRow label="Job application outcomes" rows={analytics.funnels.jobApplications} toneFor={applicationTone} />
        <StatusRow label="Project application outcomes" rows={analytics.funnels.projectApplications} toneFor={applicationTone} />
        <StatusRow label="Meeting health" rows={analytics.health.meetingsByStatus} toneFor={meetingTone} />
        <StatusRow label="Event health" rows={analytics.health.eventsByStatus} toneFor={eventTone} />
      </div>
    </div>
  );
};
