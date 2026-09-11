"use client";

import { useActionState } from "react";
import { Lock } from "lucide-react";

import { changePasswordAction, type ChangePasswordState } from "./actions";

const initialState: ChangePasswordState = { error: null };

const fieldClass =
  "flex items-center gap-2 rounded-xl border border-border bg-surface/70 px-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20";
const inputClass = "h-11 w-full bg-transparent text-sm text-text outline-none";

export const ChangePasswordForm = () => {
  const [state, formAction, isPending] = useActionState(changePasswordAction, initialState);

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-text">Temporary password</span>
        <span className={fieldClass}>
          <Lock className="h-4 w-4 flex-shrink-0 text-muted" strokeWidth={2} />
          <input type="password" name="currentPassword" required autoComplete="current-password" className={inputClass} placeholder="••••••••" />
        </span>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-text">New password</span>
        <span className={fieldClass}>
          <Lock className="h-4 w-4 flex-shrink-0 text-muted" strokeWidth={2} />
          <input type="password" name="newPassword" required autoComplete="new-password" minLength={8} className={inputClass} placeholder="At least 8 characters" />
        </span>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-text">Confirm new password</span>
        <span className={fieldClass}>
          <Lock className="h-4 w-4 flex-shrink-0 text-muted" strokeWidth={2} />
          <input type="password" name="confirmNewPassword" required autoComplete="new-password" minLength={8} className={inputClass} placeholder="••••••••" />
        </span>
      </label>

      {state.error ? (
        <p role="alert" className="rounded-lg bg-danger-bg px-3 py-2 text-sm font-medium text-danger">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 h-11 rounded-xl bg-gradient-to-r from-primary to-indigo-500 text-sm font-bold text-on-primary shadow-md shadow-primary/25 transition hover:brightness-105 disabled:opacity-60"
      >
        {isPending ? "Saving..." : "Set new password"}
      </button>
    </form>
  );
};
