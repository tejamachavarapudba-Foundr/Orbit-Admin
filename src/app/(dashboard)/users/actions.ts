"use server";

import { revalidatePath } from "next/cache";

import { apiFetch } from "@/lib/api";

export const toggleBanAction = async (userId: string) => {
  await apiFetch(`/admin/users/${userId}/ban`, { method: "PATCH" });
  revalidatePath("/users");
};
