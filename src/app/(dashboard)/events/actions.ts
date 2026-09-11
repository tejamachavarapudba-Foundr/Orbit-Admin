"use server";

import { revalidatePath } from "next/cache";

import { apiFetch, ApiError } from "@/lib/api";

export type ActionResult = { error: string | null };

export const deleteEventAction = async (eventId: string, confirmPassword: string): Promise<ActionResult> => {
  try {
    await apiFetch(`/admin/events/${eventId}`, { method: "DELETE", body: { confirmPassword } });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Couldn't delete that event." };
  }
  revalidatePath("/events");
  return { error: null };
};
