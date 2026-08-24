"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";

type DeleteButtonProps = {
  id: string;
  confirmMessage: string;
  onDelete: (id: string) => Promise<void>;
  label?: string;
};

export const DeleteButton = ({ id, confirmMessage, onDelete, label = "Delete" }: DeleteButtonProps) => {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (!window.confirm(confirmMessage)) return;
        startTransition(() => {
          void onDelete(id);
        });
      }}
      className="flex flex-shrink-0 items-center gap-1.5 rounded-lg border border-danger/30 px-3 py-1.5 text-xs font-bold text-danger transition hover:bg-danger-bg disabled:opacity-60"
    >
      <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
      {isPending ? "Deleting..." : label}
    </button>
  );
};
