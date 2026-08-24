"use server";

import { revalidatePath } from "next/cache";

import { apiFetch } from "@/lib/api";

export const dismissReportAction = async (reportId: string) => {
  await apiFetch(`/admin/post-reports/${reportId}/resolve`, { method: "POST", body: { status: "dismissed" } });
  revalidatePath("/post-reports");
};

/** Marks the report actioned and force-removes the reported post in one step. */
export const removeReportedPostAction = async (reportId: string, postId: string) => {
  await apiFetch(`/admin/post-reports/${reportId}/resolve`, { method: "POST", body: { status: "actioned" } });
  await apiFetch(`/admin/posts/${postId}`, { method: "DELETE" });
  revalidatePath("/post-reports");
};
