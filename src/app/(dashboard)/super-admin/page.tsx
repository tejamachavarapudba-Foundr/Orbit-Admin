import Link from "next/link";
import { redirect } from "next/navigation";
import { KeyRound, Search } from "lucide-react";

import { apiFetch } from "@/lib/api";
import { PageHeader } from "@/components/PageHeader";
import { getSession } from "@/lib/session";
import type { AdminUser, PaginatedResponse } from "@/lib/types";

import { AccountRow } from "./AccountRow";
import { CreateAdminForm } from "./CreateAdminForm";

export const dynamic = "force-dynamic";

type SuperAdminPageProps = {
  searchParams: Promise<{ page?: string; search?: string }>;
};

const pageLink = (page: number, search: string) => {
  const query = new URLSearchParams({ page: String(page) });
  if (search) query.set("search", search);
  return `/super-admin?${query.toString()}`;
};

export default async function SuperAdminPage({ searchParams }: SuperAdminPageProps) {
  const session = await getSession();
  if (!session || session.role?.toUpperCase() !== "SUPER_USER") {
    redirect("/");
  }

  const params = await searchParams;
  const page = Number(params.page ?? 1) || 1;
  const search = params.search?.trim() ?? "";
  const limit = 20;

  const query = new URLSearchParams({ limit: String(limit), page: String(page) });
  if (search) query.set("search", search);

  const result = await apiFetch<PaginatedResponse<AdminUser>>(`/admin/users?${query.toString()}`);

  return (
    <>
      <PageHeader title="Admin access" description="Create admins, change roles, and manage accounts at the root level." icon={KeyRound} />

      <div className="flex flex-col gap-5 p-8">
        <CreateAdminForm />

        <div>
          <div className="mb-3 flex items-center gap-3">
            <form method="get" className="glass flex w-full max-w-md items-center gap-2.5 rounded-xl px-4 py-2.5">
              <Search className="h-4 w-4 flex-shrink-0 text-muted" strokeWidth={2} />
              <input
                type="text"
                name="search"
                defaultValue={search}
                placeholder="Search by name or email to manage an account..."
                className="w-full bg-transparent text-sm text-text outline-none placeholder:text-muted"
              />
            </form>
            {search ? (
              <Link href="/super-admin" className="flex-shrink-0 text-xs font-semibold text-primary hover:underline">
                Clear search
              </Link>
            ) : null}
          </div>

          <div className="glass overflow-hidden rounded-2xl">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border/60 text-xs font-semibold uppercase tracking-wide text-muted">
                  <th className="px-5 py-3.5">Account</th>
                  <th className="px-5 py-3.5">Role</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5" />
                </tr>
              </thead>
              <tbody>
                {result.data.map((user) => (
                  <AccountRow key={user.id} user={user} currentUserId={session.userId} />
                ))}
              </tbody>
            </table>

            {result.data.length === 0 ? (
              <p className="p-10 text-center text-sm text-muted">{search ? `No accounts match "${search}".` : "No accounts found."}</p>
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
      </div>
    </>
  );
}
