"use client";

import { useState, type FormEvent } from "react";
import { Lock, TriangleAlert, X } from "lucide-react";

type ConfirmActionModalProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  danger?: boolean;
  isPending?: boolean;
  error?: string | null;
  onCancel: () => void;
  onConfirm: (password: string) => void;
};

// Step-up re-confirmation for sensitive actions (create/promote/ban/delete)
// — the backend independently re-verifies this same password server-side
// (see verifyStepUpPassword) before the action actually runs, so this modal
// existing at all is itself just the UX half of that control, not the
// enforcement. Replaces the bare window.confirm() previously used here.
export const ConfirmActionModal = ({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  danger = false,
  isPending = false,
  error,
  onCancel,
  onConfirm
}: ConfirmActionModalProps) => {
  const [password, setPassword] = useState("");

  if (!open) return null;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    onConfirm(password);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">
      <div className="glass-strong w-full max-w-sm rounded-2xl p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span
              className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${
                danger ? "bg-danger-bg text-danger" : "bg-primary/10 text-primary"
              }`}
            >
              <TriangleAlert className="h-4.5 w-4.5" strokeWidth={2} />
            </span>
            <h2 className="font-display text-base font-bold text-text">{title}</h2>
          </div>
          <button type="button" onClick={onCancel} aria-label="Cancel" className="text-muted hover:text-text">
            <X className="h-4.5 w-4.5" strokeWidth={2} />
          </button>
        </div>

        <p className="mt-3 text-sm text-muted">{description}</p>

        <form onSubmit={submit} className="mt-4 flex flex-col gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-text">Confirm your password</span>
            <span className="flex items-center gap-2 rounded-xl border border-border bg-surface/70 px-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
              <Lock className="h-4 w-4 flex-shrink-0 text-muted" strokeWidth={2} />
              <input
                type="password"
                required
                autoFocus
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10 w-full bg-transparent text-sm text-text outline-none"
                placeholder="••••••••"
              />
            </span>
          </label>

          {error ? <p className="rounded-lg bg-danger-bg px-3 py-2 text-sm font-medium text-danger">{error}</p> : null}

          <div className="mt-1 flex gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm font-bold text-text transition hover:bg-muted-bg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || !password}
              className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-bold text-on-primary shadow-md transition disabled:opacity-60 ${
                danger ? "bg-danger shadow-danger/25 hover:brightness-105" : "bg-gradient-to-r from-primary to-indigo-500 shadow-primary/25 hover:brightness-105"
              }`}
            >
              {isPending ? "Working..." : confirmLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
