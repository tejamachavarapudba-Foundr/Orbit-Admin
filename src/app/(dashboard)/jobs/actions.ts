"use server";

import { revalidatePath } from "next/cache";

import { apiFetch, ApiError } from "@/lib/api";

export type ActionResult = { error: string | null };

export const deleteJobAction = async (jobId: string, confirmPassword: string): Promise<ActionResult> => {
  try {
    await apiFetch(`/admin/jobs/${jobId}`, { method: "DELETE", body: { confirmPassword } });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Couldn't delete that job." };
  }
  revalidatePath("/jobs");
  return { error: null };
};
