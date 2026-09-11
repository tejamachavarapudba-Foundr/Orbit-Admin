"use server";

import { revalidatePath } from "next/cache";

import { apiFetch, ApiError } from "@/lib/api";

export type ActionResult = { error: string | null };

export const deletePostAction = async (postId: string, confirmPassword: string): Promise<ActionResult> => {
  try {
    await apiFetch(`/admin/posts/${postId}`, { method: "DELETE", body: { confirmPassword } });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Couldn't delete that post." };
  }
  revalidatePath("/posts");
  return { error: null };
};

export const editPostAction = async (postId: string, content: string, confirmPassword: string): Promise<ActionResult> => {
  try {
    await apiFetch(`/admin/posts/${postId}`, { method: "PATCH", body: { content, confirmPassword } });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Couldn't update that post." };
  }
  revalidatePath("/posts");
  return { error: null };
};
