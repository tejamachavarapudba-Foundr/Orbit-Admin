"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import { changeRoleAction, hardDeleteUserAction, overrideBanAction } from "./actions";
import type { AdminUser } from "@/lib/types";

const roles = ["USER", "ADMIN", "SUPER_USER"] as const;

type AccountRowProps = {
  user: AdminUser;
  currentUserId: string;
};

export const AccountRow = ({ user, currentUserId }: AccountRowProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isSelf = user.id === currentUserId;

  const run = (fn: () => Promise<void>) => startTransition(async () => { await fn(); router.refresh(); });

  return (
    <tr className="border-b border-border/60 transition last:border-0 hover:bg-white/30">
      <td className="px-5 py-3.5">
        <div className="min-w-0">
          <div className="truncate font-semibold text-text">{user.profile?.fullName || "Unnamed"}</div>
          <div className="truncate text-xs text-muted">{user.email}</div>
        </div>
      </td>
      <td className="px-5 py-3.5">
        <select
          value={user.role}
          disabled={isPending || isSelf}
          onChange={(e) => run(() => changeRoleAction(user.id, e.target.value))}
          className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-semibold text-text disabled:opacity-50"
        >
          {roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </td>
      <td className="px-5 py-3.5">
        {user.isBanned ? (
          <span className="rounded-full bg-danger-bg px-2.5 py-1 text-xs font-bold text-danger">Banned</span>
        ) : (
          <span className="rounded-full bg-success-bg px-2.5 py-1 text-xs font-bold text-success">Active</span>
        )}
      </td>
      <td className="px-5 py-3.5 text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            disabled={isPending || isSelf}
            onClick={() => run(() => overrideBanAction(user.id, !user.isBanned))}
            className={`rounded-lg border px-3 py-1.5 text-xs font-bold transition disabled:opacity-50 ${
              user.isBanned ? "border-border text-text hover:bg-muted-bg" : "border-danger/30 text-danger hover:bg-danger-bg"
            }`}
          >
            {user.isBanned ? "Unban" : "Ban"}
          </button>
          <button
            type="button"
            disabled={isPending || isSelf}
            onClick={() => {
              if (!window.confirm(`Permanently delete ${user.email}? This can't be undone.`)) return;
              run(() => hardDeleteUserAction(user.id));
            }}
            aria-label="Hard delete account"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-danger/30 text-danger transition hover:bg-danger-bg disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
        </div>
        {isSelf ? <p className="mt-1 text-[10.5px] text-muted">Your own account</p> : null}
      </td>
    </tr>
  );
};
