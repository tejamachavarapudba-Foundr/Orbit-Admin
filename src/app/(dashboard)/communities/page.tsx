import Link from "next/link";
import { Globe2, Search, Users } from "lucide-react";

import { apiFetch } from "@/lib/api";
import { PageHeader } from "@/components/PageHeader";
import { DeleteButton } from "@/components/DeleteButton";
import type { AdminCommunity, PaginatedResponse } from "@/lib/types";

import { deleteCommunityAction } from "./actions";

export const dynamic = "force-dynamic";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));

type CommunitiesPageProps = {
  searchParams: Promise<{ page?: string; search?: string }>;
};

const pageLink = (page: number, search: string) => {
  const query = new URLSearchParams({ page: String(page) });
  if (search) query.set("search", search);
  return `/communities?${query.toString()}`;
};

export default async function CommunitiesPage({ searchParams }: CommunitiesPageProps) {
  const params = await searchParams;
  const page = Number(params.page ?? 1) || 1;
  const search = params.search?.trim() ?? "";
  const limit = 20;

  const query = new URLSearchParams({ limit: String(limit), page: String(page) });
  if (search) query.set("search", search);

  const result = await apiFetch<PaginatedResponse<AdminCommunity>>(`/admin/communities?${query.toString()}`);

  return (
    <>
      <PageHeader
        title="Communities"
        description={`${result.meta.totalItems} communities on Orbit. Force-remove groups that violate guidelines.`}
        icon={Globe2}
      />

      <div className="p-8">
        <div className="mb-5 flex items-center gap-3">
          <form method="get" className="glass flex w-full max-w-md items-center gap-2.5 rounded-xl px-4 py-2.5">
            <Search className="h-4 w-4 flex-shrink-0 text-muted" strokeWidth={2} />
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Search by name..."
              className="w-full bg-transparent text-sm text-text outline-none placeholder:text-muted"
            />
          </form>
          {search ? (
            <Link href="/communities" className="flex-shrink-0 text-xs font-semibold text-primary hover:underline">
              Clear search
            </Link>
          ) : null}
        </div>

        <div className="flex flex-col gap-3">
          {result.data.map((community) => (
            <div key={community.id} className="glass flex items-center gap-4 rounded-2xl p-4">
              <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-sm font-bold text-white">
                {community.name.charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate font-semibold text-text">{community.name}</span>
                  <span className="flex-shrink-0 text-xs text-muted">{formatDate(community.createdAt)}</span>
                </div>
                <p className="mt-0.5 truncate text-xs text-muted">{community.description || "No description"}</p>
                <div className="mt-2 flex items-center gap-4 text-xs text-muted">
                  <span>owned by {community.owner?.fullName ?? "Unknown"}</span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" strokeWidth={2} />
                    {community._count.members} members
                  </span>
                  <span className="font-mono text-[11px] text-muted/80">{community.id}</span>
                </div>
              </div>
              <DeleteButton
                id={community.id}
                confirmTitle="Delete this community?"
                confirmDescription={`Permanently delete "${community.name}"? This can't be undone.`}
                onDelete={deleteCommunityAction}
              />
            </div>
          ))}

          {result.data.length === 0 ? (
            <div className="glass rounded-2xl p-10 text-center text-sm text-muted">
              {search ? `No communities match "${search}".` : "No communities found."}
            </div>
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
