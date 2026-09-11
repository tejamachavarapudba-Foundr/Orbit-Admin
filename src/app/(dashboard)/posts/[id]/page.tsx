import Link from "next/link";
import { ArrowLeft, FileText, Flag, Heart, MessageCircle } from "lucide-react";

import { apiFetch } from "@/lib/api";
import { PageHeader } from "@/components/PageHeader";
import type { PostDetailResponse } from "@/lib/types";

import { EditPostSection } from "./EditPostSection";

export const dynamic = "force-dynamic";

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value));

const actionLabel = (action: string) =>
  action
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");

type PostDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { id } = await params;
  const { post, reports, history } = await apiFetch<PostDetailResponse>(`/admin/posts/${id}`);

  return (
    <>
      <PageHeader title="Post detail" description={post.author?.fullName ?? "Unknown author"} icon={FileText} />

      <div className="p-8">
        <Link href="/posts" className="mb-5 flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-text">
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
          Back to posts
        </Link>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="flex flex-col gap-5 lg:col-span-2">
            <EditPostSection postId={post.id} initialContent={post.content} />

            {post.media.length > 0 ? (
              <div className="glass rounded-2xl p-5">
                <h2 className="font-display text-sm font-bold text-text">Media</h2>
                <div className="mt-3 flex flex-wrap gap-3">
                  {post.media.map((m) =>
                    m.type === "VIDEO" ? (
                      <video key={m.id} src={m.url} className="h-32 w-32 rounded-xl object-cover" controls />
                    ) : (
                      <img key={m.id} src={m.url} alt="" className="h-32 w-32 rounded-xl object-cover" />
                    )
                  )}
                </div>
              </div>
            ) : null}

            <div className="glass overflow-hidden rounded-2xl">
              <div className="border-b border-border/60 px-5 py-3.5">
                <h2 className="font-display text-sm font-bold text-text">History</h2>
                <p className="mt-0.5 text-xs text-muted">Every admin action taken on this specific post.</p>
              </div>
              <table className="w-full text-left text-sm">
                <tbody>
                  {history.map((entry) => (
                    <tr key={entry.id} className="border-b border-border/60 align-top last:border-0">
                      <td className="px-5 py-3.5">
                        <span className="rounded-full bg-muted-bg px-2.5 py-1 text-xs font-bold text-text">{actionLabel(entry.action)}</span>
                      </td>
                      <td className="px-5 py-3.5 text-muted">{entry.details}</td>
                      <td className="px-5 py-3.5 text-muted">{entry.performedBy}</td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-muted">{formatDateTime(entry.timestamp)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {history.length === 0 ? <p className="p-8 text-center text-sm text-muted">No admin actions on this post yet.</p> : null}
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="glass rounded-2xl p-5">
              <h2 className="font-display text-sm font-bold text-text">Engagement</h2>
              <div className="mt-3 flex items-center gap-4 text-sm text-muted">
                <span className="flex items-center gap-1.5">
                  <Heart className="h-4 w-4" strokeWidth={2} />
                  {post._count.likes} likes
                </span>
                <span className="flex items-center gap-1.5">
                  <MessageCircle className="h-4 w-4" strokeWidth={2} />
                  {post._count.comments} comments
                </span>
              </div>
              <p className="mt-3 text-xs text-muted">Posted {formatDateTime(post.createdAt)}</p>
              <p className="mt-1 truncate font-mono text-[11px] text-muted/80">{post.id}</p>
            </div>

            <div className="glass rounded-2xl p-5">
              <div className="flex items-center gap-2">
                <Flag className="h-4 w-4 text-danger" strokeWidth={2} />
                <h2 className="font-display text-sm font-bold text-text">Reports ({reports.length})</h2>
              </div>
              <div className="mt-3 flex flex-col gap-3">
                {reports.map((report) => (
                  <div key={report.id} className="rounded-xl border border-border/60 p-3 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-text">{report.reporter.fullName}</span>
                      <span className="rounded-full bg-muted-bg px-2 py-0.5 font-bold uppercase text-muted">{report.status}</span>
                    </div>
                    <p className="mt-1 text-muted">{report.reason || "No reason given."}</p>
                    <p className="mt-1 text-muted/70">{formatDateTime(report.createdAt)}</p>
                  </div>
                ))}
                {reports.length === 0 ? <p className="text-sm text-muted">No reports on this post.</p> : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
