import Link from "next/link";
import { DatabaseZap } from "lucide-react";

import { apiFetch } from "@/lib/api";
import { PageHeader } from "@/components/PageHeader";
import type { DirectRoleChangeResponse } from "@/lib/types";

import { RevertButton } from "./RevertButton";

export const dynamic = "force-dynamic";

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value));

type DirectChangesPageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function DirectChangesPage({ searchParams }: DirectChangesPageProps) {
  const params = await searchParams;
  const page = Number(params.page ?? 1) || 1;
  const limit = 50;

  const result = await apiFetch<DirectRoleChangeResponse>(`/admin/security/direct-role-changes?limit=${limit}&page=${page}`);

  return (
    <>
      <PageHeader
        title="Database-level change log"
        description="Captured by a Postgres trigger, not application code — sees every role/ban change no matter how it happened, including a direct edit outside the app."
        icon={DatabaseZap}
      />

      <div className="p-8">
        <div className="glass mb-5 rounded-2xl p-4 text-xs text-muted">
          This currently includes changes made <span className="font-semibold text-text">through the app too</span> — this
          backend's own database connection and a direct Table Editor session authenticate as the same Postgres role today,
          so they can't yet be told apart here. It's a guaranteed backstop (nothing can change silently), not yet a way to
          isolate only out-of-band edits.
        </div>

        <div className="glass overflow-hidden rounded-2xl">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border/60 text-xs font-semibold uppercase tracking-wide text-muted">
                <th className="px-5 py-3.5">Account</th>
                <th className="px-5 py-3.5">Role</th>
                <th className="px-5 py-3.5">Banned</th>
                <th className="px-5 py-3.5">DB role</th>
                <th className="px-5 py-3.5">Client address</th>
                <th className="px-5 py-3.5">When</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {result.entries.map((entry) => (
                <tr key={entry.id} className="border-b border-border/60 align-top transition last:border-0 hover:bg-white/30">
                  <td className="px-5 py-3.5 text-text">{entry.email}</td>
                  <td className="px-5 py-3.5 text-muted">
                    {entry.oldRole === entry.newRole ? (
                      entry.oldRole
                    ) : (
                      <>
                        {entry.oldRole} <span className="text-text">→</span> {entry.newRole}
                      </>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-muted">
                    {entry.oldIsBanned === entry.newIsBanned
                      ? String(entry.oldIsBanned)
                      : `${entry.oldIsBanned} → ${entry.newIsBanned}`}
                  </td>
                  <td className="px-5 py-3.5 font-mono text-[11px] text-muted">{entry.dbUser ?? "—"}</td>
                  <td className="px-5 py-3.5 font-mono text-[11px] text-muted">{entry.clientAddr ?? "—"}</td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-muted">{formatDateTime(entry.changedAt)}</td>
                  <td className="px-5 py-3.5 text-right">
                    <RevertButton
                      logEntryId={entry.id}
                      email={entry.email}
                      oldRole={entry.oldRole}
                      oldIsBanned={entry.oldIsBanned}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {result.entries.length === 0 ? (
            <p className="p-10 text-center text-sm text-muted">No role or ban changes captured yet.</p>
          ) : null}
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-muted">
          <span>
            Page {result.meta.currentPage} of {Math.max(result.meta.totalPages, 1)} · {result.meta.totalItems} total changes
          </span>
          <div className="flex gap-2">
            {page > 1 ? (
              <Link
                href={`/security/direct-changes?page=${page - 1}`}
                className="rounded-lg border border-border px-3 py-1.5 font-semibold text-text hover:bg-muted-bg"
              >
                Previous
              </Link>
            ) : null}
            {page < result.meta.totalPages ? (
              <Link
                href={`/security/direct-changes?page=${page + 1}`}
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
