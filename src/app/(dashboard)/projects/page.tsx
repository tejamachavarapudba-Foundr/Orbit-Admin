import Link from "next/link";

import { apiFetch } from "@/lib/api";
import { PageHeader } from "@/components/PageHeader";
import type { AdminProject, PaginatedResponse } from "@/lib/types";

import { toggleVerifyAction } from "./actions";

export const dynamic = "force-dynamic";

type ProjectsPageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const params = await searchParams;
  const page = Number(params.page ?? 1) || 1;
  const limit = 25;

  const result = await apiFetch<PaginatedResponse<AdminProject>>(`/admin/projects?limit=${limit}&page=${page}`);

  return (
    <>
      <PageHeader title="Startups" description={`${result.meta.totalItems} projects listed on Orbit.`} />

      <div className="p-8">
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted-bg/60 text-xs font-semibold uppercase tracking-wide text-muted">
                <th className="px-5 py-3">Startup</th>
                <th className="px-5 py-3">Founder</th>
                <th className="px-5 py-3">Stage</th>
                <th className="px-5 py-3">Verified</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {result.data.map((project) => (
                <tr key={project.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-text">{project.name}</div>
                    <div className="max-w-xs truncate text-xs text-muted">{project.tagline || "No tagline"}</div>
                  </td>
                  <td className="px-5 py-3.5 text-muted">{project.owner?.fullName || "Unknown"}</td>
                  <td className="px-5 py-3.5 text-muted capitalize">{project.stage}</td>
                  <td className="px-5 py-3.5">
                    {project.isVerified ? (
                      <span className="rounded-full bg-success-bg px-2.5 py-1 text-xs font-bold text-success">Verified</span>
                    ) : (
                      <span className="rounded-full bg-muted-bg px-2.5 py-1 text-xs font-bold text-muted">Unverified</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <form action={toggleVerifyAction.bind(null, project.id, !project.isVerified)}>
                      <button
                        type="submit"
                        className={`rounded-lg border px-3 py-1.5 text-xs font-bold ${
                          project.isVerified
                            ? "border-border text-text hover:bg-muted-bg"
                            : "border-primary/40 text-primary hover:bg-primary-muted"
                        }`}
                      >
                        {project.isVerified ? "Unverify" : "Verify"}
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {result.data.length === 0 ? <p className="p-8 text-center text-sm text-muted">No startups found.</p> : null}
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-muted">
          <span>
            Page {result.meta.currentPage} of {Math.max(result.meta.totalPages, 1)}
          </span>
          <div className="flex gap-2">
            {page > 1 ? (
              <Link href={`/projects?page=${page - 1}`} className="rounded-lg border border-border px-3 py-1.5 font-semibold text-text hover:bg-muted-bg">
                Previous
              </Link>
            ) : null}
            {page < result.meta.totalPages ? (
              <Link href={`/projects?page=${page + 1}`} className="rounded-lg border border-border px-3 py-1.5 font-semibold text-text hover:bg-muted-bg">
                Next
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
