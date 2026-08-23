import { Ban, Briefcase, Database, LayoutDashboard, MessageSquare, Rocket, TrendingUp, UserCheck, Users } from "lucide-react";

import { apiFetch } from "@/lib/api";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import type { AdminStats } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function OverviewPage() {
  const stats = await apiFetch<AdminStats>("/admin/stats");

  return (
    <>
      <PageHeader title="Overview" description="Platform-wide health at a glance." icon={LayoutDashboard} />

      <div className="p-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Total users" value={stats.overview.totalUsers} icon={Users} />
          <StatCard label="Active users" value={stats.overview.activeUsers} tone="success" icon={UserCheck} />
          <StatCard
            label="Banned users"
            value={stats.overview.bannedUsers}
            tone={stats.overview.bannedUsers > 0 ? "danger" : "default"}
            icon={Ban}
          />
          <StatCard label="Startups" value={stats.overview.totalProjects} icon={Rocket} />
          <StatCard label="Job posts" value={stats.overview.totalJobs} icon={Briefcase} />
          <StatCard label="Messages sent" value={stats.overview.totalMessages} icon={MessageSquare} />
          <StatCard label="Application rate" value={stats.overview.conversionRate} icon={TrendingUp} />
          <StatCard
            label="Database"
            value={stats.systemStatus.databaseConnected ? "Connected" : "Offline"}
            tone={stats.systemStatus.databaseConnected ? "success" : "danger"}
            icon={Database}
          />
        </div>

        <div className="glass mt-6 rounded-2xl p-5">
          <h2 className="font-display text-sm font-bold text-text">Startups by stage</h2>
          <div className="mt-4 flex flex-col gap-3">
            {stats.growthMetrics.projectsByStage.length === 0 ? (
              <p className="text-sm text-muted">No startups yet.</p>
            ) : (
              stats.growthMetrics.projectsByStage.map((item) => {
                const max = Math.max(...stats.growthMetrics.projectsByStage.map((s) => s.count), 1);
                return (
                  <div key={item.stage} className="flex items-center gap-3">
                    <div className="w-28 flex-shrink-0 text-xs font-semibold capitalize text-muted">{item.stage}</div>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted-bg">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-indigo-500"
                        style={{ width: `${(item.count / max) * 100}%` }}
                      />
                    </div>
                    <div className="w-8 flex-shrink-0 text-right text-xs font-bold tabular-nums text-text">{item.count}</div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
}
