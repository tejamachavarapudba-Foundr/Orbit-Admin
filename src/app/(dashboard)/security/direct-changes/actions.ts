"use server";

import { revalidatePath } from "next/cache";

import { apiFetch, ApiError } from "@/lib/api";

export type ActionResult = { error: string | null };

export const revertDirectRoleChangeAction = async (logEntryId: string, confirmPassword: string): Promise<ActionResult> => {
  try {
    await apiFetch(`/admin/security/direct-role-changes/${logEntryId}/revert`, { method: "POST", body: { confirmPassword } });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Couldn't revert that change." };
  }
  revalidatePath("/security/direct-changes");
  return { error: null };
};
