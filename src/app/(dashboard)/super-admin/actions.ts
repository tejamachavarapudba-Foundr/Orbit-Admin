"use server";

import { revalidatePath } from "next/cache";

import { apiFetch } from "@/lib/api";

export type CreateAdminState = { error: string | null; success: string | null };

export const createAdminAction = async (_prevState: CreateAdminState, formData: FormData): Promise<CreateAdminState> => {
  const email = String(formData.get("email") ?? "").trim();
  const fullName = String(formData.get("fullName") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();

  if (!email || !fullName) {
    return { error: "Email and full name are required.", success: null };
  }

  try {
    await apiFetch("/super-user/admins", {
      method: "POST",
      body: { email, fullName, ...(password ? { password } : {}) }
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Couldn't create that admin account.", success: null };
  }

  revalidatePath("/super-admin");
  return { error: null, success: `Admin account created for ${email}.` };
};

export const changeRoleAction = async (userId: string, role: string) => {
  await apiFetch(`/super-user/users/${userId}/role`, { method: "PATCH", body: { role } });
  revalidatePath("/super-admin");
};

export const overrideBanAction = async (userId: string, isBanned: boolean) => {
  await apiFetch(`/super-user/users/${userId}/status`, { method: "PATCH", body: { isBanned } });
  revalidatePath("/super-admin");
};

export const hardDeleteUserAction = async (userId: string) => {
  await apiFetch(`/super-user/users/${userId}`, { method: "DELETE" });
  revalidatePath("/super-admin");
};
