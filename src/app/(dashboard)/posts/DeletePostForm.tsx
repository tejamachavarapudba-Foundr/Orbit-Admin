"use client";

import { useActionState, useRef } from "react";

import { deletePostAction, type DeletePostState } from "./actions";

const initialState: DeletePostState = { error: null, success: null };

export const DeletePostForm = () => {
  const [state, formAction, isPending] = useActionState(deletePostAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="rounded-xl border border-border bg-surface p-6">
      <h2 className="font-display text-sm font-bold text-text">Force-delete a post</h2>
      <p className="mt-1 text-sm text-muted">Enter the post ID from a moderation report or feed item. This can't be undone.</p>

      <form
        ref={formRef}
        action={(formData) => {
          if (!window.confirm("Permanently delete this post? This cannot be undone.")) {
            return;
          }
          formAction(formData);
        }}
        className="mt-4 flex gap-3"
      >
        <input
          type="text"
          name="postId"
          placeholder="Post ID"
          required
          className="h-11 flex-1 rounded-lg border border-border bg-background px-3 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <button
          type="submit"
          disabled={isPending}
          className="h-11 flex-shrink-0 rounded-lg border border-danger/30 px-5 text-sm font-bold text-danger hover:bg-danger-bg disabled:opacity-60"
        >
          {isPending ? "Deleting..." : "Delete post"}
        </button>
      </form>

      {state.error ? <p className="mt-3 text-sm font-medium text-danger">{state.error}</p> : null}
      {state.success ? <p className="mt-3 text-sm font-medium text-success">{state.success}</p> : null}
    </div>
  );
};
