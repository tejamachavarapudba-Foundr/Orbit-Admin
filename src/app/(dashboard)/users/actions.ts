"use server";

import { revalidatePath } from "next/cache";

import { apiFetch, ApiError } from "@/lib/api";

export type ActionResult = { error: string | null };

export const toggleBanAction = async (userId: string, confirmPassword: string): Promise<ActionResult> => {
  try {
    await apiFetch(`/admin/users/${userId}/ban`, { method: "PATCH", body: { confirmPassword } });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Couldn't update that account's status." };
  }
  revalidatePath("/users");
  return { error: null };
};
