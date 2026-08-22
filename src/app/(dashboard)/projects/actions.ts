"use server";

import { revalidatePath } from "next/cache";

import { apiFetch } from "@/lib/api";

export const toggleVerifyAction = async (projectId: string, nextIsVerified: boolean) => {
  await apiFetch(`/admin/projects/${projectId}/verify`, {
    method: "PATCH",
    body: { isVerified: nextIsVerified }
  });
  revalidatePath("/projects");
};
