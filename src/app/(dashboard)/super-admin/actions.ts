"use server";

import { revalidatePath } from "next/cache";

import { apiFetch, ApiError } from "@/lib/api";

export type CreateAdminState = { error: string | null; success: string | null };

export const createAdminAction = async (_prevState: CreateAdminState, formData: FormData): Promise<CreateAdminState> => {
  const email = String(formData.get("email") ?? "").trim();
  const fullName = String(formData.get("fullName") ?? "").trim();
  const role = String(formData.get("role") ?? "ADMIN").trim();
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!email || !fullName) {
    return { error: "Email and full name are required.", success: null };
  }
  if (!confirmPassword) {
    return { error: "Re-enter your own password to confirm.", success: null };
  }

  try {
    await apiFetch("/super-user/admins", {
      method: "POST",
      body: { email, fullName, role, confirmPassword }
    });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Couldn't create that admin account.", success: null };
  }

  revalidatePath("/super-admin");
  return { error: null, success: `Admin account created for ${email} — a temporary password was emailed to them.` };
};

export type ActionResult = { error: string | null };

export const changeRoleAction = async (userId: string, role: string, confirmPassword: string): Promise<ActionResult> => {
  try {
    await apiFetch(`/super-user/users/${userId}/role`, { method: "PATCH", body: { role, confirmPassword } });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Couldn't change that account's role." };
  }
  revalidatePath("/super-admin");
  return { error: null };
};

export const overrideBanAction = async (userId: string, isBanned: boolean, confirmPassword: string): Promise<ActionResult> => {
  try {
    await apiFetch(`/super-user/users/${userId}/status`, { method: "PATCH", body: { isBanned, confirmPassword } });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Couldn't update that account's status." };
  }
  revalidatePath("/super-admin");
  return { error: null };
};

export const hardDeleteUserAction = async (userId: string, confirmPassword: string): Promise<ActionResult> => {
  try {
    await apiFetch(`/super-user/users/${userId}`, { method: "DELETE", body: { confirmPassword } });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Couldn't delete that account." };
  }
  revalidatePath("/super-admin");
  return { error: null };
};
