import Link from "next/link";
import { CheckCircle2, CircleAlert, XCircle } from "lucide-react";

import { apiFetch } from "@/lib/api";
import type { SystemHealth } from "@/lib/types";

const dotFor = (status: "ok" | "warn" | "bad") =>
  status === "ok" ? (
    <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-success" strokeWidth={2} />
  ) : status === "warn" ? (
    <CircleAlert className="h-4 w-4 flex-shrink-0 text-amber-500" strokeWidth={2} />
  ) : (
    <XCircle className="h-4 w-4 flex-shrink-0 text-danger" strokeWidth={2} />
  );

// Compact "is anything on fire" strip for the top of Overview — the
// dedicated /system-health page has the full per-integration breakdown.
// Fetches independently (not passed stats as a prop) so it stays accurate
// even if this ends up reused somewhere Overview's own stats aren't loaded.
export const SystemHealthBanner = async () => {
  let health: SystemHealth;
  try {
    health = await apiFetch<SystemHealth>("/admin/system-health");
  } catch {
    return null;
  }

  const database = health.integrations.find((i) => i.name === "Database");
  const unconfigured = health.integrations.filter((i) => i.status === "unconfigured");
  const degraded = health.integrations.filter((i) => i.status === "degraded");

  const items: { label: string; status: "ok" | "warn" | "bad" }[] = [
    {
      label: database ? `Database — ${database.status === "healthy" ? `Healthy (${database.detail})` : database.detail}` : "Database",
      status: database?.status === "healthy" ? "ok" : "bad"
    },
    {
      label:
        degraded.length + unconfigured.length === 0
          ? "Integrations — Healthy"
          : `Integrations — ${degraded.length + unconfigured.length} need attention`,
      status: degraded.length > 0 ? "bad" : unconfigured.length > 0 ? "warn" : "ok"
    },
    {
      label: health.content.openPostReports > 0 ? `${health.content.openPostReports} post reports need attention` : "Content — No open reports",
      status: health.content.openPostReports > 0 ? "warn" : "ok"
    },
    {
      label: health.security.failedLogins24h > 3 ? `${health.security.failedLogins24h} failed logins (24h)` : "Security — No critical issues",
      status: health.security.failedLogins24h > 3 ? "warn" : "ok"
    }
  ];

  return (
    <Link
      href="/system-health"
      className="glass mb-6 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-2xl px-5 py-3.5 text-sm font-semibold text-text transition hover:bg-white/40"
    >
      {items.map((item) => (
        <span key={item.label} className="flex items-center gap-2">
          {dotFor(item.status)}
          {item.label}
        </span>
      ))}
    </Link>
  );
};
