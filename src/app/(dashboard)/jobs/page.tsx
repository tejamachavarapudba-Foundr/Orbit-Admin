import Link from "next/link";
import { Briefcase, Search, Users } from "lucide-react";

import { apiFetch } from "@/lib/api";
import { PageHeader } from "@/components/PageHeader";
import { DeleteButton } from "@/components/DeleteButton";
import type { AdminJob, PaginatedResponse } from "@/lib/types";

import { deleteJobAction } from "./actions";

export const dynamic = "force-dynamic";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));

type JobsPageProps = {
  searchParams: Promise<{ page?: string; search?: string }>;
};

const pageLink = (page: number, search: string) => {
  const query = new URLSearchParams({ page: String(page) });
  if (search) query.set("search", search);
  return `/jobs?${query.toString()}`;
};

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const params = await searchParams;
  const page = Number(params.page ?? 1) || 1;
  const search = params.search?.trim() ?? "";
  const limit = 20;

  const query = new URLSearchParams({ limit: String(limit), page: String(page) });
  if (search) query.set("search", search);

  const result = await apiFetch<PaginatedResponse<AdminJob>>(`/admin/jobs?${query.toString()}`);

  return (
    <>
      <PageHeader
        title="Jobs"
        description={`${result.meta.totalItems} job postings on Orbit. Force-remove listings that violate guidelines.`}
        icon={Briefcase}
      />

      <div className="p-8">
        <div className="mb-5 flex items-center gap-3">
          <form method="get" className="glass flex w-full max-w-md items-center gap-2.5 rounded-xl px-4 py-2.5">
            <Search className="h-4 w-4 flex-shrink-0 text-muted" strokeWidth={2} />
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Search by title or startup..."
              className="w-full bg-transparent text-sm text-text outline-none placeholder:text-muted"
            />
          </form>
          {search ? (
            <Link href="/jobs" className="flex-shrink-0 text-xs font-semibold text-primary hover:underline">
              Clear search
            </Link>
          ) : null}
        </div>

        <div className="flex flex-col gap-3">
          {result.data.map((job) => (
            <div key={job.id} className="glass flex items-center gap-4 rounded-2xl p-4">
              <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-indigo-500 text-sm font-bold text-on-primary">
                {job.startupName.charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate font-semibold text-text">{job.heading}</span>
                  <span className="flex-shrink-0 text-xs text-muted">{formatDate(job.createdAt)}</span>
                </div>
                <p className="mt-0.5 truncate text-xs text-muted">
                  {job.startupName} · {job.role?.replace(/_/g, " ")} · posted by {job.poster?.fullName ?? "Unknown"}
                </p>
                <div className="mt-2 flex items-center gap-4 text-xs text-muted">
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" strokeWidth={2} />
                    {job._count.applications} applications
                  </span>
                  <span className="font-mono text-[11px] text-muted/80">{job.id}</span>
                </div>
              </div>
              <DeleteButton
                id={job.id}
                confirmMessage={`Permanently delete "${job.heading}"? This can't be undone.`}
                onDelete={deleteJobAction}
              />
            </div>
          ))}

          {result.data.length === 0 ? (
            <div className="glass rounded-2xl p-10 text-center text-sm text-muted">
              {search ? `No jobs match "${search}".` : "No job postings found."}
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
