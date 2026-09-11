"use server";

import { redirect } from "next/navigation";

import { apiFetch, ApiError } from "@/lib/api";

export type ChangePasswordState = { error: string | null };

export const changePasswordAction = async (
  _prevState: ChangePasswordState,
  formData: FormData
): Promise<ChangePasswordState> => {
  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmNewPassword = String(formData.get("confirmNewPassword") ?? "");

  if (!currentPassword || !newPassword) {
    return { error: "Fill in both password fields." };
  }
  if (newPassword.length < 8) {
    return { error: "New password must be at least 8 characters." };
  }
  if (newPassword !== confirmNewPassword) {
    return { error: "New passwords don't match." };
  }

  try {
    await apiFetch("/auth/change-password", { method: "POST", body: { currentPassword, newPassword } });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Couldn't change your password." };
  }

  redirect("/");
};
