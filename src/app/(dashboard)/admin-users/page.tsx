import { UserPlus } from "lucide-react";

import { apiFetch } from "@/lib/api";
import { PageHeader } from "@/components/PageHeader";
import type { AdminUser, PaginatedResponse } from "@/lib/types";

import { CreateOrbitUserForm } from "./CreateOrbitUserForm";

export const dynamic = "force-dynamic";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));

export default async function AdminUsersPage() {
  const result = await apiFetch<PaginatedResponse<AdminUser>>("/admin/users?limit=100&orbitOwned=true");

  return (
    <>
      <PageHeader
        title="Orbit accounts"
        description={`${result.meta.totalItems} admin-provisioned account${result.meta.totalItems === 1 ? "" : "s"}.`}
        icon={UserPlus}
      />

      <div className="flex flex-col gap-5 p-8">
        <CreateOrbitUserForm />

        <div className="glass overflow-hidden rounded-2xl">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border/60 text-xs font-semibold uppercase tracking-wide text-muted">
                <th className="px-5 py-3.5">Member</th>
                <th className="px-5 py-3.5">Role</th>
                <th className="px-5 py-3.5">Created</th>
                <th className="px-5 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody>
              {result.data.map((user) => (
                <tr key={user.id} className="border-b border-border/60 transition last:border-0 hover:bg-white/30">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-indigo-500 font-display text-xs font-bold text-on-primary">
                        {(user.profile?.fullName || user.email).charAt(0).toUpperCase()}
                      </span>
                      <div className="min-w-0">
                        <div className="truncate font-semibold text-text">{user.profile?.fullName || "Unnamed"}</div>
                        <div className="truncate text-xs text-muted">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 capitalize text-muted">{user.profile?.role ?? "—"}</td>
                  <td className="px-5 py-3.5 text-muted">{formatDate(user.createdAt)}</td>
                  <td className="px-5 py-3.5">
                    {user.isBanned ? (
                      <span className="rounded-full bg-danger-bg px-2.5 py-1 text-xs font-bold text-danger">Banned</span>
                    ) : (
                      <span className="rounded-full bg-success-bg px-2.5 py-1 text-xs font-bold text-success">Active</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {result.data.length === 0 ? <p className="p-10 text-center text-sm text-muted">No Orbit-owned accounts yet.</p> : null}
        </div>
      </div>
    </>
  );
}
