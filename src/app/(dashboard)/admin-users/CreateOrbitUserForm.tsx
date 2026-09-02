"use client";

import { useActionState } from "react";
import { UserPlus } from "lucide-react";

import { createOrbitUserAction, type CreateOrbitUserState } from "./actions";

const initialState: CreateOrbitUserState = { error: null, success: null };

const roles = [
  { value: "founder", label: "Founder" },
  { value: "investor", label: "Investor" },
  { value: "advisor", label: "Advisor" },
  { value: "professional", label: "Professional" },
  { value: "service_provider", label: "Service provider" }
];

const inputClass =
  "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-text outline-none placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/15";

export const CreateOrbitUserForm = () => {
  const [state, formAction, isPending] = useActionState(createOrbitUserAction, initialState);

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center gap-2.5">
        <UserPlus className="h-4.5 w-4.5 text-primary" strokeWidth={2} />
        <h3 className="font-display text-sm font-bold text-text">Create an Orbit-owned account</h3>
      </div>
      <p className="mt-1 text-xs text-muted">
        Signs in like a real user on mobile or web — no email code, no onboarding wizard, ever. Looks completely
        normal to everyone else. Share the password with whoever operates it; it isn&apos;t emailed.
      </p>

      <form action={formAction} className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <input name="fullName" required placeholder="Full name" className={inputClass} />
        <input name="email" type="email" required placeholder="Email" autoCapitalize="none" className={inputClass} />
        <input name="password" type="text" required placeholder="Password" autoCapitalize="none" className={inputClass} />
        <select name="role" required defaultValue="" className={inputClass}>
          <option value="" disabled>
            Role...
          </option>
          {roles.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
        <input name="headline" placeholder="Headline (optional)" className={inputClass} />
        <input name="location" placeholder="Location (optional)" className={inputClass} />
        <input name="company" placeholder="Company (optional)" className={inputClass} />
        <textarea name="bio" placeholder="Bio (optional)" rows={2} className={`${inputClass} resize-none sm:col-span-2 lg:col-span-3`} />

        <button
          type="submit"
          disabled={isPending}
          className="rounded-xl bg-gradient-to-r from-primary to-indigo-500 px-4 py-2.5 text-sm font-bold text-on-primary shadow-md shadow-primary/25 disabled:opacity-60 sm:col-span-2 sm:self-start sm:justify-self-start lg:col-span-3"
        >
          {isPending ? "Creating..." : "Create account"}
        </button>
      </form>

      {state.error ? <p className="mt-3 text-sm font-medium text-danger">{state.error}</p> : null}
      {state.success ? <p className="mt-3 text-sm font-medium text-success">{state.success}</p> : null}
    </div>
  );
};
