"use server";

import { revalidatePath } from "next/cache";

import { apiFetch } from "@/lib/api";

export const deletePostAction = async (postId: string) => {
  await apiFetch(`/admin/posts/${postId}`, { method: "DELETE" });
  revalidatePath("/posts");
};
