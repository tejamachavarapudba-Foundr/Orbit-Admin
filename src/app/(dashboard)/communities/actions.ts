"use server";

import { revalidatePath } from "next/cache";

import { apiFetch } from "@/lib/api";

export const deleteCommunityAction = async (communityId: string) => {
  await apiFetch(`/admin/communities/${communityId}`, { method: "DELETE" });
  revalidatePath("/communities");
};
