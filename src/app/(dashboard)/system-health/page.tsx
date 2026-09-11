import { Activity, CheckCircle2, CircleAlert, Database, XCircle } from "lucide-react";

import { apiFetch } from "@/lib/api";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import type { SystemHealth } from "@/lib/types";

export const dynamic = "force-dynamic";

const statusIcon = (status: "healthy" | "degraded" | "unconfigured") =>
  status === "healthy" ? (
    <CheckCircle2 className="h-4.5 w-4.5 flex-shrink-0 text-success" strokeWidth={2} />
  ) : status === "degraded" ? (
    <XCircle className="h-4.5 w-4.5 flex-shrink-0 text-danger" strokeWidth={2} />
  ) : (
    <CircleAlert className="h-4.5 w-4.5 flex-shrink-0 text-amber-500" strokeWidth={2} />
  );

const statusLabel: Record<string, string> = {
  healthy: "Healthy",
  degraded: "Degraded",
  unconfigured: "Not configured"
};

export default async function SystemHealthPage() {
  const health = await apiFetch<SystemHealth>("/admin/system-health");

  return (
    <>
      <PageHeader
        title="System health"
        description="Live status of the services Orbit actually depends on — checked on every load, not a historical dashboard."
        icon={Activity}
      />

      <div className="p-8">
        <div className="glass overflow-hidden rounded-2xl">
          <div className="border-b border-border/60 px-5 py-3.5">
            <h2 className="font-display text-sm font-bold text-text">Integrations</h2>
            <p className="mt-0.5 text-xs text-muted">
              Every check besides the database is a configuration check (is the API key/credential set), not a live call —
              pinging Resend/OpenAI/Twilio/Firebase on every dashboard load would mean real requests against those APIs.
            </p>
          </div>
          <table className="w-full text-left text-sm">
            <tbody>
              {health.integrations.map((integration) => (
                <tr key={integration.name} className="border-b border-border/60 last:border-0">
                  <td className="px-5 py-3.5 font-semibold text-text">{integration.name}</td>
                  <td className="px-5 py-3.5">
                    <span className="flex items-center gap-2">
                      {statusIcon(integration.status)}
                      {statusLabel[integration.status]}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right text-muted">{integration.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Database latency"
            value={health.integrations.find((i) => i.name === "Database")?.detail ?? "—"}
            tone={health.integrations.find((i) => i.name === "Database")?.status === "healthy" ? "success" : "danger"}
            icon={Database}
          />
          <StatCard
            label="Open post reports"
            value={health.content.openPostReports}
            tone={health.content.openPostReports > 0 ? "default" : "success"}
          />
          <StatCard
            label="Pending incorporation reviews"
            value={health.content.pendingIncorporationVerifications}
            tone={health.content.pendingIncorporationVerifications > 0 ? "default" : "success"}
          />
          <StatCard
            label="Failed logins (24h)"
            value={health.security.failedLogins24h}
            tone={health.security.failedLogins24h > 3 ? "danger" : "success"}
          />
        </div>

        <p className="mt-4 text-xs text-muted">Last checked {new Date(health.generatedAt).toLocaleString()}.</p>
      </div>
    </>
  );
}
