"use client";

import { useTransition } from "react";
import { CheckCircle2, Trash2 } from "lucide-react";

import { dismissReportAction, removeReportedPostAction } from "./actions";

type ReportActionsProps = {
  reportId: string;
  postId: string;
};

export const ReportActions = ({ reportId, postId }: ReportActionsProps) => {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-shrink-0 flex-col gap-1.5">
      <button
        type="button"
        disabled={isPending}
        onClick={() => startTransition(() => void dismissReportAction(reportId))}
        className="flex items-center gap-1.5 rounded-lg border border-border/70 px-3 py-1.5 text-xs font-bold text-text transition hover:bg-muted-bg disabled:opacity-60"
      >
        <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2} />
        Dismiss
      </button>
      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          if (!window.confirm("Remove this post permanently? This can't be undone.")) return;
          startTransition(() => void removeReportedPostAction(reportId, postId));
        }}
        className="flex items-center gap-1.5 rounded-lg border border-danger/30 px-3 py-1.5 text-xs font-bold text-danger transition hover:bg-danger-bg disabled:opacity-60"
      >
        <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
        Remove post
      </button>
    </div>
  );
};
