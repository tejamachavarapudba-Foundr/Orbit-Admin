"use server";

import { ApiError, apiFetch } from "@/lib/api";

export type DeletePostState = { error: string | null; success: string | null };

export const deletePostAction = async (_prevState: DeletePostState, formData: FormData): Promise<DeletePostState> => {
  const postId = String(formData.get("postId") ?? "").trim();

  if (!postId) {
    return { error: "Enter a post ID.", success: null };
  }

  try {
    await apiFetch(`/admin/posts/${postId}`, { method: "DELETE" });
    return { error: null, success: `Post ${postId} was deleted.` };
  } catch (err) {
    const message = err instanceof ApiError ? err.message : "Couldn't delete that post.";
    return { error: message, success: null };
  }
};
