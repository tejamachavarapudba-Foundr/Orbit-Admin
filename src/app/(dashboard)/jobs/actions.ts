"use server";

import { revalidatePath } from "next/cache";

import { apiFetch } from "@/lib/api";

export const deleteJobAction = async (jobId: string) => {
  await apiFetch(`/admin/jobs/${jobId}`, { method: "DELETE" });
  revalidatePath("/jobs");
};
