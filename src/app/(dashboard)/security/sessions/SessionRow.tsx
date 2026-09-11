"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { ShieldX } from "lucide-react";

import { revokeSessionAction } from "./actions";
import type { AdminSession } from "@/lib/types";

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value));

type SessionRowProps = {
  session: AdminSession;
  isCurrentUser: boolean;
};

export const SessionRow = ({ session, isCurrentUser }: SessionRowProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const revoke = () => {
    if (!window.confirm("Revoke this session? That device will be signed out immediately.")) return;
    startTransition(async () => {
      await revokeSessionAction(session.id);
      router.refresh();
    });
  };

  return (
    <tr className="border-b border-border/60 align-top transition last:border-0 hover:bg-white/30">
      <td className="px-5 py-3.5">
        <div className="font-semibold text-text">{session.user.email}</div>
        {isCurrentUser ? <div className="text-[10.5px] text-muted">This device</div> : null}
      </td>
      <td className="px-5 py-3.5 text-muted">{session.ipAddress ?? "—"}</td>
      <td className="max-w-xs truncate px-5 py-3.5 text-muted" title={session.userAgent ?? undefined}>
        {session.userAgent ?? "—"}
      </td>
      <td className="whitespace-nowrap px-5 py-3.5 text-muted">{formatDateTime(session.lastUsedAt)}</td>
      <td className="px-5 py-3.5 text-right">
        <button
          type="button"
          disabled={isPending}
          onClick={revoke}
          className="inline-flex items-center gap-1.5 rounded-lg border border-danger/30 px-3 py-1.5 text-xs font-bold text-danger transition hover:bg-danger-bg disabled:opacity-50"
        >
          <ShieldX className="h-3.5 w-3.5" strokeWidth={2} />
          Revoke
        </button>
      </td>
    </tr>
  );
};
