"use server";

import { revalidatePath } from "next/cache";

import { apiFetch } from "@/lib/api";

export const reviewVerificationAction = async (profileId: string, status: "approved" | "rejected") => {
  await apiFetch(`/verification/founder/${profileId}/review`, {
    method: "PATCH",
    body: { status }
  });
  revalidatePath("/verifications");
};

export const reviewProfessionalVerificationAction = async (profileId: string, status: "approved" | "rejected") => {
  await apiFetch(`/verification/professional/${profileId}/review`, {
    method: "PATCH",
    body: { status }
  });
  revalidatePath("/verifications");
};
