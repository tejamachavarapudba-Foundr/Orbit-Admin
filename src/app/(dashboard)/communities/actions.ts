"use server";

import { revalidatePath } from "next/cache";

import { apiFetch, ApiError } from "@/lib/api";

export type ActionResult = { error: string | null };

export const deleteCommunityAction = async (communityId: string, confirmPassword: string): Promise<ActionResult> => {
  try {
    await apiFetch(`/admin/communities/${communityId}`, { method: "DELETE", body: { confirmPassword } });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Couldn't delete that community." };
  }
  revalidatePath("/communities");
  return { error: null };
};
