import { Database, ShieldCheck, Smartphone, Trash2 } from "lucide-react";

import { apiFetch } from "@/lib/api";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import type { DataPrivacyOverview } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function DataPrivacyPage() {
  const overview = await apiFetch<DataPrivacyOverview>("/admin/data-privacy");

  return (
    <>
      <PageHeader
        title="Data & privacy"
        description="A data inventory for admins — what Orbit actually collects and why, not a legal document."
        icon={ShieldCheck}
      />

      <div className="p-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total users" value={overview.counts.totalUsers} icon={Database} />
          <StatCard label="Phone numbers stored" value={overview.counts.phoneNumbersStored} icon={Smartphone} />
          <StatCard
            label="Connected Google accounts"
            value={`${overview.counts.connectedGoogleAccountsActive} active`}
            icon={ShieldCheck}
          />
          <StatCard label="Incorporation docs stored" value={overview.counts.incorporationDocsStored} icon={Database} />
        </div>

        <div className="glass mt-6 overflow-hidden rounded-2xl">
          <div className="border-b border-border/60 px-5 py-3.5">
            <h2 className="font-display text-sm font-bold text-text">What's collected, and why</h2>
          </div>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border/60 text-xs font-semibold uppercase tracking-wide text-muted">
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Examples</th>
                <th className="px-5 py-3">Purpose</th>
              </tr>
            </thead>
            <tbody>
              {overview.categories.map((c) => (
                <tr key={c.category} className="border-b border-border/60 align-top last:border-0">
                  <td className="px-5 py-3.5 font-semibold text-text">{c.category}</td>
                  <td className="max-w-xs px-5 py-3.5 text-muted">{c.examples}</td>
                  <td className="max-w-xs px-5 py-3.5 text-muted">{c.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="glass rounded-2xl p-5">
            <h2 className="font-display text-sm font-bold text-text">Retention</h2>
            <p className="mt-2 text-sm text-muted">{overview.retention}</p>
          </div>
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center gap-2">
              <Trash2 className="h-4 w-4 text-danger" strokeWidth={2} />
              <h2 className="font-display text-sm font-bold text-text">On account deletion</h2>
            </div>
            <p className="mt-2 text-sm text-muted">{overview.deletionBehavior}</p>
          </div>
        </div>

        <p className="mt-4 text-xs text-muted">Counts as of {new Date(overview.generatedAt).toLocaleString()}.</p>
      </div>
    </>
  );
}
