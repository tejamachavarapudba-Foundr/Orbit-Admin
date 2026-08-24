"use client";

import { useActionState } from "react";
import { UserPlus } from "lucide-react";

import { createAdminAction, type CreateAdminState } from "./actions";

const initialState: CreateAdminState = { error: null, success: null };

const inputClass =
  "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-text outline-none placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/15";

export const CreateAdminForm = () => {
  const [state, formAction, isPending] = useActionState(createAdminAction, initialState);

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center gap-2.5">
        <UserPlus className="h-4.5 w-4.5 text-primary" strokeWidth={2} />
        <h3 className="font-display text-sm font-bold text-text">Create an admin account</h3>
      </div>
      <p className="mt-1 text-xs text-muted">Grants ADMIN access immediately. Share the password with them directly — it isn&apos;t emailed.</p>

      <form action={formAction} className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <input name="fullName" required placeholder="Full name" className={inputClass} />
        <input name="email" type="email" required placeholder="Email" className={inputClass} autoCapitalize="none" />
        <input name="password" type="text" placeholder="Password (optional)" className={inputClass} autoCapitalize="none" />
        <button
          type="submit"
          disabled={isPending}
          className="rounded-xl bg-gradient-to-r from-primary to-indigo-500 px-4 py-2.5 text-sm font-bold text-on-primary shadow-md shadow-primary/25 disabled:opacity-60 sm:col-span-3 sm:self-start sm:justify-self-start sm:px-6"
        >
          {isPending ? "Creating..." : "Create admin"}
        </button>
      </form>

      {state.error ? <p className="mt-3 text-sm font-medium text-danger">{state.error}</p> : null}
      {state.success ? <p className="mt-3 text-sm font-medium text-success">{state.success}</p> : null}
    </div>
  );
};
