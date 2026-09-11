"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";

import { editPostAction } from "../actions";
import { ConfirmActionModal } from "@/components/ConfirmActionModal";

type EditPostSectionProps = {
  postId: string;
  initialContent: string;
};

export const EditPostSection = ({ postId, initialContent }: EditPostSectionProps) => {
  const router = useRouter();
  const [content, setContent] = useState(initialContent);
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const dirty = content.trim() !== initialContent.trim();

  const confirm = (password: string) => {
    setError(null);
    startTransition(async () => {
      const result = await editPostAction(postId, content, password);
      if (result.error) {
        setError(result.error);
        return;
      }
      setConfirming(false);
      router.refresh();
    });
  };

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center gap-2">
        <Pencil className="h-4 w-4 text-primary" strokeWidth={2} />
        <h2 className="font-display text-sm font-bold text-text">Content</h2>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={5}
        className="mt-3 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
      />
      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-muted">Editing overwrites the post's own content directly — recorded in its history below.</p>
        <button
          type="button"
          disabled={!dirty || isPending}
          onClick={() => setConfirming(true)}
          className="flex-shrink-0 rounded-xl bg-gradient-to-r from-primary to-indigo-500 px-4 py-2 text-xs font-bold text-on-primary shadow-md shadow-primary/25 disabled:opacity-50"
        >
          Save changes
        </button>
      </div>

      <ConfirmActionModal
        open={confirming}
        title="Save this edit?"
        description="Confirm your password to save the new content."
        confirmLabel="Save changes"
        isPending={isPending}
        error={error}
        onCancel={() => {
          setConfirming(false);
          setError(null);
        }}
        onConfirm={confirm}
      />
    </div>
  );
};
