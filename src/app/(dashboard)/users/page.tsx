import Link from "next/link";

import { apiFetch } from "@/lib/api";
import { PageHeader } from "@/components/PageHeader";
import type { AdminUser, PaginatedResponse } from "@/lib/types";

import { toggleBanAction } from "./actions";

export const dynamic = "force-dynamic";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));

type UsersPageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const params = await searchParams;
  const page = Number(params.page ?? 1) || 1;
  const limit = 25;

  const result = await apiFetch<PaginatedResponse<AdminUser>>(`/admin/users?limit=${limit}&page=${page}`);

  return (
    <>
      <PageHeader title="Users" description={`${result.meta.totalItems} accounts registered.`} />

      <div className="p-8">
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted-bg/60 text-xs font-semibold uppercase tracking-wide text-muted">
                <th className="px-5 py-3">Member</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Joined</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {result.data.map((user) => (
                <tr key={user.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-text">{user.profile?.fullName || "Unnamed"}</div>
                    <div className="text-xs text-muted">{user.email}</div>
                  </td>
                  <td className="px-5 py-3.5 text-muted">{user.role}</td>
                  <td className="px-5 py-3.5 text-muted">{formatDate(user.createdAt)}</td>
                  <td className="px-5 py-3.5">
                    {user.isBanned ? (
                      <span className="rounded-full bg-danger-bg px-2.5 py-1 text-xs font-bold text-danger">Banned</span>
                    ) : (
                      <span className="rounded-full bg-success-bg px-2.5 py-1 text-xs font-bold text-success">Active</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <form action={toggleBanAction.bind(null, user.id)}>
                      <button
                        type="submit"
                        className={`rounded-lg border px-3 py-1.5 text-xs font-bold ${
                          user.isBanned
                            ? "border-border text-text hover:bg-muted-bg"
                            : "border-danger/30 text-danger hover:bg-danger-bg"
                        }`}
                      >
                        {user.isBanned ? "Unban" : "Ban"}
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {result.data.length === 0 ? <p className="p-8 text-center text-sm text-muted">No users found.</p> : null}
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-muted">
          <span>
            Page {result.meta.currentPage} of {Math.max(result.meta.totalPages, 1)}
          </span>
          <div className="flex gap-2">
            {page > 1 ? (
              <Link href={`/users?page=${page - 1}`} className="rounded-lg border border-border px-3 py-1.5 font-semibold text-text hover:bg-muted-bg">
                Previous
              </Link>
            ) : null}
            {page < result.meta.totalPages ? (
              <Link href={`/users?page=${page + 1}`} className="rounded-lg border border-border px-3 py-1.5 font-semibold text-text hover:bg-muted-bg">
                Next
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
