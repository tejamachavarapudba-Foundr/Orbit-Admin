"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { toggleBanAction } from "./actions";
import { ConfirmActionModal } from "@/components/ConfirmActionModal";

type BanButtonProps = {
  userId: string;
  email: string;
  isBanned: boolean;
};

export const BanButton = ({ userId, email, isBanned }: BanButtonProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confirm = (password: string) => {
    setError(null);
    startTransition(async () => {
      const result = await toggleBanAction(userId, password);
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
        className={`rounded-lg border px-3 py-1.5 text-xs font-bold transition disabled:opacity-50 ${
          isBanned ? "border-border text-text hover:bg-muted-bg" : "border-danger/30 text-danger hover:bg-danger-bg"
        }`}
      >
        {isBanned ? "Unban" : "Ban"}
      </button>

      <ConfirmActionModal
        open={open}
        title={isBanned ? "Unban this account?" : "Ban this account?"}
        description={
          isBanned
            ? `${email} will be restored to active status.`
            : `${email} will be banned immediately and signed out of any active session.`
        }
        confirmLabel={isBanned ? "Unban account" : "Ban account"}
        danger={!isBanned}
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
