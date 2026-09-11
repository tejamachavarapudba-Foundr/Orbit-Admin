"use server";

import { redirect } from "next/navigation";

import { decodeToken, setSessionTokens } from "@/lib/session";
import { isAdminTierRole } from "@/lib/roleLabels";

const BASE_URL = process.env.API_BASE_URL ?? "http://localhost:3000/api";

export type LoginState = { error: string | null };

export const loginAction = async (_prevState: LoginState, formData: FormData): Promise<LoginState> => {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store"
  });

  if (!res.ok) {
    return { error: res.status === 401 ? "Incorrect email or password." : "Couldn't sign in — try again." };
  }

  const data = (await res.json()) as {
    accessToken: string;
    refreshToken: string;
    user?: { mustChangePassword?: boolean };
  };
  const payload = decodeToken(data.accessToken);

  if (!payload || !isAdminTierRole(payload.role)) {
    return { error: "This account doesn't have admin access." };
  }

  await setSessionTokens(data.accessToken, data.refreshToken);
  redirect(data.user?.mustChangePassword ? "/change-password" : "/");
};
