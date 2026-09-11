"use server";

import { revalidatePath } from "next/cache";

import { apiFetch, ApiError } from "@/lib/api";
import type { ActionResult } from "../../super-admin/actions";

export const revokeSessionAction = async (sessionId: string): Promise<ActionResult> => {
  try {
    await apiFetch(`/admin/security/sessions/${sessionId}`, { method: "DELETE" });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Couldn't revoke that session." };
  }
  revalidatePath("/security/sessions");
  return { error: null };
};
