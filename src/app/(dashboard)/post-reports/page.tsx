import Link from "next/link";
import { Flag } from "lucide-react";

import { apiFetch } from "@/lib/api";
import { PageHeader } from "@/components/PageHeader";
import type { AdminPostReport, PaginatedResponse } from "@/lib/types";

import { ReportActions } from "./ReportActions";

export const dynamic = "force-dynamic";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }).format(
    new Date(value)
  );

const statuses = [
  { key: "open", label: "Open" },
  { key: "actioned", label: "Actioned" },
  { key: "dismissed", label: "Dismissed" }
] as const;

type PostReportsPageProps = {
  searchParams: Promise<{ page?: string; status?: string }>;
};

const pageLink = (page: number, status: string) => {
  const query = new URLSearchParams({ page: String(page), status });
  return `/post-reports?${query.toString()}`;
};

export default async function PostReportsPage({ searchParams }: PostReportsPageProps) {
  const params = await searchParams;
  const page = Number(params.page ?? 1) || 1;
  const status = params.status ?? "open";
  const limit = 20;

  const query = new URLSearchParams({ limit: String(limit), page: String(page), status });
  const result = await apiFetch<PaginatedResponse<AdminPostReport>>(`/admin/post-reports?${query.toString()}`);

  return (
    <>
      <PageHeader
        title="Post reports"
        description={`${result.meta.totalItems} ${status} report${result.meta.totalItems === 1 ? "" : "s"}. Review flagged posts and take action.`}
        icon={Flag}
      />

      <div className="p-8">
        <div className="mb-5 flex gap-1 rounded-xl border border-border/70 p-1">
          {statuses.map((s) => (
            <Link
              key={s.key}
              href={pageLink(1, s.key)}
              className={`flex-1 rounded-lg px-3 py-2 text-center text-xs font-bold transition ${
                status === s.key ? "bg-gradient-to-r from-primary to-indigo-500 text-on-primary shadow-sm" : "text-muted hover:bg-muted-bg/70"
              }`}
            >
              {s.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {result.data.map((report) => (
            <div key={report.id} className="glass flex items-start gap-4 rounded-2xl p-4">
              {report.post.media[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={report.post.media[0].url} alt="" className="h-16 w-16 flex-shrink-0 rounded-lg object-cover" />
              ) : (
                <span className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-indigo-500 text-sm font-bold text-on-primary">
                  {(report.post.author?.fullName ?? "?").charAt(0).toUpperCase()}
                </span>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-xs font-semibold text-text">
                    Post by {report.post.author?.fullName ?? "Unknown"}
                  </span>
                  {report.post._count.reports > 1 ? (
                    <span className="flex-shrink-0 rounded-full bg-danger-bg px-2 py-0.5 text-[10.5px] font-bold text-danger">
                      {report.post._count.reports} reports
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-muted">{report.post.content || "(no text content)"}</p>
                <div className="mt-2 rounded-lg bg-muted-bg/60 px-3 py-2 text-xs text-text">
                  <span className="font-semibold">{report.reporter?.fullName ?? "Unknown"}</span> reported: {report.reason || "(no reason given)"}
                </div>
                <div className="mt-1.5 flex items-center gap-3 text-[10.5px] text-muted">
                  <span>{formatDate(report.createdAt)}</span>
                  <span className="font-mono text-muted/80">{report.postId}</span>
                </div>
              </div>

              {status === "open" ? <ReportActions reportId={report.id} postId={report.postId} /> : null}
            </div>
          ))}

          {result.data.length === 0 ? (
            <div className="glass rounded-2xl p-10 text-center text-sm text-muted">No {status} reports.</div>
          ) : null}
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-muted">
          <span>
            Page {result.meta.currentPage} of {Math.max(result.meta.totalPages, 1)}
          </span>
          <div className="flex gap-2">
            {page > 1 ? (
              <Link href={pageLink(page - 1, status)} className="rounded-lg border border-border px-3 py-1.5 font-semibold text-text hover:bg-muted-bg">
                Previous
              </Link>
            ) : null}
            {page < result.meta.totalPages ? (
              <Link href={pageLink(page + 1, status)} className="rounded-lg border border-border px-3 py-1.5 font-semibold text-text hover:bg-muted-bg">
                Next
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
