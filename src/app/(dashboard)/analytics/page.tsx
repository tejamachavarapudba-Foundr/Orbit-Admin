import { BarChart3, Bookmark, Heart, MessageCircle, ShieldCheck } from "lucide-react";

import { apiFetch } from "@/lib/api";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import type { AdminAnalytics } from "@/lib/types";

import { AnalyticsCharts } from "./AnalyticsCharts";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const analytics = await apiFetch<AdminAnalytics>("/admin/analytics");

  return (
    <>
      <PageHeader title="Analytics" description="Growth, engagement and platform health over the last 30 days." icon={BarChart3} />

      <div className="p-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Likes given" value={analytics.engagement.likeCount} icon={Heart} />
          <StatCard label="Comments posted" value={analytics.engagement.commentCount} icon={MessageCircle} />
          <StatCard label="Posts saved" value={analytics.engagement.savedPostCount} icon={Bookmark} />
          <StatCard
            label="Identity verified"
            value={`${analytics.verification.identityVerifiedRate}%`}
            tone={analytics.verification.identityVerifiedRate >= 50 ? "success" : "default"}
            icon={ShieldCheck}
          />
        </div>

        <div className="mt-6">
          <AnalyticsCharts analytics={analytics} />
        </div>
      </div>
    </>
  );
}
