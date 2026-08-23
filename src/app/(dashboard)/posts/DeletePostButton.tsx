"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";

type DeletePostButtonProps = {
  postId: string;
  onDelete: (postId: string) => Promise<void>;
};

export const DeletePostButton = ({ postId, onDelete }: DeletePostButtonProps) => {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (!window.confirm("Permanently delete this post? This can't be undone.")) return;
        startTransition(() => {
          void onDelete(postId);
        });
      }}
      className="flex flex-shrink-0 items-center gap-1.5 rounded-lg border border-danger/30 px-3 py-1.5 text-xs font-bold text-danger transition hover:bg-danger-bg disabled:opacity-60"
    >
      <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
};
