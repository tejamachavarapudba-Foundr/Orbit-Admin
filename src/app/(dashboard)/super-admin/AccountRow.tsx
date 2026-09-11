"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import { changeRoleAction, hardDeleteUserAction, overrideBanAction, type ActionResult } from "./actions";
import { ConfirmActionModal } from "@/components/ConfirmActionModal";
import { ASSIGNABLE_ROLES, roleLabel } from "@/lib/roleLabels";
import type { AdminUser } from "@/lib/types";

type PendingAction =
  | { kind: "role"; nextRole: string }
  | { kind: "ban"; nextBanned: boolean }
  | { kind: "delete" };

type AccountRowProps = {
  user: AdminUser;
  currentUserId: string;
};

export const AccountRow = ({ user, currentUserId }: AccountRowProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);
  const isSelf = user.id === currentUserId;

  const closeModal = () => {
    setPendingAction(null);
    setModalError(null);
  };

  const runConfirmed = (fn: () => Promise<ActionResult>) => {
    startTransition(async () => {
      const result = await fn();
      if (result.error) {
        setModalError(result.error);
        return;
      }
      closeModal();
      router.refresh();
    });
  };

  const confirm = (password: string) => {
    if (!pendingAction) return;
    setModalError(null);
    if (pendingAction.kind === "role") {
      runConfirmed(() => changeRoleAction(user.id, pendingAction.nextRole, password));
    } else if (pendingAction.kind === "ban") {
      runConfirmed(() => overrideBanAction(user.id, pendingAction.nextBanned, password));
    } else {
      runConfirmed(() => hardDeleteUserAction(user.id, password));
    }
  };

  const modalCopy = (() => {
    if (!pendingAction) return null;
    if (pendingAction.kind === "role") {
      return {
        title: "Change role?",
        description: `Set ${user.email}'s role to ${roleLabel(pendingAction.nextRole)}. This takes effect immediately, including revoking their current session.`,
        confirmLabel: "Change role",
        danger: false
      };
    }
    if (pendingAction.kind === "ban") {
      return {
        title: pendingAction.nextBanned ? "Ban this account?" : "Unban this account?",
        description: pendingAction.nextBanned
          ? `${user.email} will be banned immediately and signed out of any active session.`
          : `${user.email} will be restored to active status.`,
        confirmLabel: pendingAction.nextBanned ? "Ban account" : "Unban account",
        danger: pendingAction.nextBanned
      };
    }
    return {
      title: "Permanently delete this account?",
      description: `This can't be undone. ${user.email} and their data will be permanently removed.`,
      confirmLabel: "Delete permanently",
      danger: true
    };
  })();

  return (
    <>
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
            onChange={(e) => setPendingAction({ kind: "role", nextRole: e.target.value })}
            className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-semibold text-text disabled:opacity-50"
          >
            {ASSIGNABLE_ROLES.map((role) => (
              <option key={role} value={role}>
                {roleLabel(role)}
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
              onClick={() => setPendingAction({ kind: "ban", nextBanned: !user.isBanned })}
              className={`rounded-lg border px-3 py-1.5 text-xs font-bold transition disabled:opacity-50 ${
                user.isBanned ? "border-border text-text hover:bg-muted-bg" : "border-danger/30 text-danger hover:bg-danger-bg"
              }`}
            >
              {user.isBanned ? "Unban" : "Ban"}
            </button>
            <button
              type="button"
              disabled={isPending || isSelf}
              onClick={() => setPendingAction({ kind: "delete" })}
              aria-label="Hard delete account"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-danger/30 text-danger transition hover:bg-danger-bg disabled:opacity-50"
            >
              <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          </div>
          {isSelf ? <p className="mt-1 text-[10.5px] text-muted">Your own account</p> : null}
        </td>
      </tr>

      <ConfirmActionModal
        open={pendingAction !== null}
        title={modalCopy?.title ?? ""}
        description={modalCopy?.description ?? ""}
        confirmLabel={modalCopy?.confirmLabel}
        danger={modalCopy?.danger}
        isPending={isPending}
        error={modalError}
        onCancel={closeModal}
        onConfirm={confirm}
      />
    </>
  );
};
