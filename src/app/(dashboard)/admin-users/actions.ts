"use server";

import { revalidatePath } from "next/cache";

import { apiFetch } from "@/lib/api";

export type CreateOrbitUserState = { error: string | null; success: string | null };

export const createOrbitUserAction = async (_prevState: CreateOrbitUserState, formData: FormData): Promise<CreateOrbitUserState> => {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("fullName") ?? "").trim();
  const role = String(formData.get("role") ?? "");

  if (!email || !password || !fullName || !role) {
    return { error: "Email, password, full name and role are required.", success: null };
  }

  try {
    await apiFetch("/admin/users", {
      method: "POST",
      body: {
        email,
        password,
        fullName,
        role,
        headline: String(formData.get("headline") ?? "").trim(),
        bio: String(formData.get("bio") ?? "").trim(),
        location: String(formData.get("location") ?? "").trim(),
        company: String(formData.get("company") ?? "").trim()
      }
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Couldn't create that account.", success: null };
  }

  revalidatePath("/admin-users");
  return { error: null, success: `Account created for ${email} — sign in with the password you set, on any client.` };
};
