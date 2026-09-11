import Link from "next/link";
import { FileText, Heart, MessageCircle, Search } from "lucide-react";

import { apiFetch } from "@/lib/api";
import { PageHeader } from "@/components/PageHeader";
import { DeleteButton } from "@/components/DeleteButton";
import type { AdminPost, PaginatedResponse } from "@/lib/types";

import { deletePostAction } from "./actions";

export const dynamic = "force-dynamic";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));

type PostsPageProps = {
  searchParams: Promise<{ page?: string; search?: string }>;
};

const pageLink = (page: number, search: string) => {
  const query = new URLSearchParams({ page: String(page) });
  if (search) query.set("search", search);
  return `/posts?${query.toString()}`;
};

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const params = await searchParams;
  const page = Number(params.page ?? 1) || 1;
  const search = params.search?.trim() ?? "";
  const limit = 20;

  const query = new URLSearchParams({ limit: String(limit), page: String(page) });
  if (search) query.set("search", search);

  const result = await apiFetch<PaginatedResponse<AdminPost>>(`/admin/posts?${query.toString()}`);

  return (
    <>
      <PageHeader
        title="Posts"
        description={`${result.meta.totalItems} posts on Orbit. Search to find one, then force-delete it directly — no ID lookup needed.`}
        icon={FileText}
      />

      <div className="p-8">
        <div className="mb-5 flex items-center gap-3">
          <form method="get" className="glass flex w-full max-w-md items-center gap-2.5 rounded-xl px-4 py-2.5">
            <Search className="h-4 w-4 flex-shrink-0 text-muted" strokeWidth={2} />
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Search by author or content..."
              className="w-full bg-transparent text-sm text-text outline-none placeholder:text-muted"
            />
          </form>
          {search ? (
            <Link href="/posts" className="flex-shrink-0 text-xs font-semibold text-primary hover:underline">
              Clear search
            </Link>
          ) : null}
        </div>

        <div className="flex flex-col gap-3">
          {result.data.map((post) => (
            <div key={post.id} className="glass flex gap-4 rounded-2xl p-4">
              {post.media[0] ? (
                post.media[0].type === "VIDEO" ? (
                  <video src={post.media[0].url} className="h-20 w-20 flex-shrink-0 rounded-xl object-cover" muted />
                ) : (
                  <img src={post.media[0].url} alt="" className="h-20 w-20 flex-shrink-0 rounded-xl object-cover" />
                )
              ) : (
                <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-xl bg-muted-bg text-muted">
                  <FileText className="h-6 w-6" strokeWidth={1.5} />
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-indigo-500 text-[10px] font-bold text-on-primary">
                      {(post.author?.fullName || "?").charAt(0).toUpperCase()}
                    </span>
                    <span className="truncate font-semibold text-text">{post.author?.fullName ?? "Unknown"}</span>
                    <span className="flex-shrink-0 text-xs text-muted">{formatDate(post.createdAt)}</span>
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-2">
                    <Link
                      href={`/posts/${post.id}`}
                      className="rounded-lg border border-border px-3 py-1.5 text-xs font-bold text-text transition hover:bg-muted-bg"
                    >
                      View / Edit
                    </Link>
                    <DeleteButton
                      id={post.id}
                      confirmTitle="Delete this post?"
                      confirmDescription="This can't be undone."
                      onDelete={deletePostAction}
                    />
                  </div>
                </div>

                <p className="mt-1.5 line-clamp-2 text-sm text-muted">{post.content || "(no text content)"}</p>

                <div className="mt-2.5 flex items-center gap-4 text-xs text-muted">
                  <span className="flex items-center gap-1">
                    <Heart className="h-3.5 w-3.5" strokeWidth={2} />
                    {post._count.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-3.5 w-3.5" strokeWidth={2} />
                    {post._count.comments}
                  </span>
                  <span className="ml-auto truncate font-mono text-[11px] text-muted/80">{post.id}</span>
                </div>
              </div>
            </div>
          ))}

          {result.data.length === 0 ? (
            <div className="glass rounded-2xl p-10 text-center text-sm text-muted">
              {search ? `No posts match "${search}".` : "No posts found."}
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
