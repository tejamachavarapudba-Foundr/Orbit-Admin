"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Undo2 } from "lucide-react";

import { revertDirectRoleChangeAction } from "./actions";
import { ConfirmActionModal } from "@/components/ConfirmActionModal";

type RevertButtonProps = {
  logEntryId: string;
  email: string;
  oldRole: string;
  oldIsBanned: boolean;
};

export const RevertButton = ({ logEntryId, email, oldRole, oldIsBanned }: RevertButtonProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confirm = (password: string) => {
    setError(null);
    startTransition(async () => {
      const result = await revertDirectRoleChangeAction(logEntryId, password);
      if (result.error) {
        setError(result.error);
        return;
      }
      setOpen(false);
      router.refresh();
    });
  };

  return (
    <>
      <button
        type="button"
        disabled={isPending}
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-bold text-text transition hover:bg-muted-bg disabled:opacity-50"
      >
        <Undo2 className="h-3.5 w-3.5" strokeWidth={2} />
        Revert
      </button>

      <ConfirmActionModal
        open={open}
        title="Revert this change?"
        description={`Sets ${email} back to role=${oldRole}, banned=${oldIsBanned}. This is itself a logged, alertable change — not a silent undo.`}
        confirmLabel="Revert"
        isPending={isPending}
        error={error}
        onCancel={() => {
          setOpen(false);
          setError(null);
        }}
        onConfirm={confirm}
      />
    </>
  );
};
