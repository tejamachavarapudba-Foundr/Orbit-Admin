"use client";

import { useActionState } from "react";
import { Lock, Mail } from "lucide-react";

import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = { error: null };

export const LoginForm = () => {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-text">Email</span>
        <span className="flex items-center gap-2 rounded-xl border border-border bg-surface/70 px-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
          <Mail className="h-4 w-4 flex-shrink-0 text-muted" strokeWidth={2} />
          <input
            type="email"
            name="email"
            required
            autoComplete="username"
            className="h-11 w-full bg-transparent text-sm text-text outline-none"
            placeholder="you@orbit.com"
          />
        </span>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-text">Password</span>
        <span className="flex items-center gap-2 rounded-xl border border-border bg-surface/70 px-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
          <Lock className="h-4 w-4 flex-shrink-0 text-muted" strokeWidth={2} />
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            className="h-11 w-full bg-transparent text-sm text-text outline-none"
            placeholder="••••••••"
          />
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
        {isPending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
};
