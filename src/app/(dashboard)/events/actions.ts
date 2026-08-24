"use server";

import { revalidatePath } from "next/cache";

import { apiFetch } from "@/lib/api";

export const deleteEventAction = async (eventId: string) => {
  await apiFetch(`/admin/events/${eventId}`, { method: "DELETE" });
  revalidatePath("/events");
};
