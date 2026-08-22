"use server";

import { redirect } from "next/navigation";

import { clearSessionTokens } from "@/lib/session";

export const logoutAction = async () => {
  await clearSessionTokens();
  redirect("/login");
};
