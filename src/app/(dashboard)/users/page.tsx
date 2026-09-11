import Link from "next/link";
import { Search, Users as UsersIcon } from "lucide-react";

import { apiFetch } from "@/lib/api";
import { PageHeader } from "@/components/PageHeader";
import type { AdminUser, PaginatedResponse } from "@/lib/types";

import { BanButton } from "./BanButton";

export const dynamic = "force-dynamic";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));

type UsersPageProps = {
  searchParams: Promise<{ page?: string; search?: string }>;
};

const pageLink = (page: number, search: string) => {
  const query = new URLSearchParams({ page: String(page) });
  if (search) query.set("search", search);
  return `/users?${query.toString()}`;
};

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const params = await searchParams;
  const page = Number(params.page ?? 1) || 1;
  const search = params.search?.trim() ?? "";
  const limit = 25;

  const query = new URLSearchParams({ limit: String(limit), page: String(page) });
  if (search) query.set("search", search);

  const result = await apiFetch<PaginatedResponse<AdminUser>>(`/admin/users?${query.toString()}`);

  return (
    <>
      <PageHeader title="Users" description={`${result.meta.totalItems} accounts registered.`} icon={UsersIcon} />

      <div className="p-8">
        <div className="mb-5 flex items-center gap-3">
          <form method="get" className="glass flex w-full max-w-md items-center gap-2.5 rounded-xl px-4 py-2.5">
            <Search className="h-4 w-4 flex-shrink-0 text-muted" strokeWidth={2} />
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Search by name or email..."
              className="w-full bg-transparent text-sm text-text outline-none placeholder:text-muted"
            />
          </form>
          {search ? (
            <Link href="/users" className="flex-shrink-0 text-xs font-semibold text-primary hover:underline">
              Clear search
            </Link>
          ) : null}
        </div>

        <div className="glass overflow-hidden rounded-2xl">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border/60 text-xs font-semibold uppercase tracking-wide text-muted">
                <th className="px-5 py-3.5">Member</th>
                <th className="px-5 py-3.5">Role</th>
                <th className="px-5 py-3.5">Joined</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5" />
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
                    <BanButton userId={user.id} email={user.email} isBanned={user.isBanned} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {result.data.length === 0 ? (
            <p className="p-10 text-center text-sm text-muted">
              {search ? `No users match "${search}".` : "No users found."}
            </p>
          ) : null}
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-muted">
          <span>
            Page {result.meta.currentPage} of {Math.max(result.meta.totalPages, 1)}
          </span>
          <div className="flex gap-2">
            {page > 1 ? (
              <Link href={pageLink(page - 1, search)} className="rounded-lg border border-border px-3 py-1.5 font-semibold text-text hover:bg-muted-bg">
                Previous
              </Link>
            ) : null}
            {page < result.meta.totalPages ? (
              <Link href={pageLink(page + 1, search)} className="rounded-lg border border-border px-3 py-1.5 font-semibold text-text hover:bg-muted-bg">
                Next
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
