import { CheckCircle2, FileCheck, ShieldCheck, XCircle } from "lucide-react";

import { apiFetch } from "@/lib/api";
import { PageHeader } from "@/components/PageHeader";
import type { PendingFounderVerification } from "@/lib/types";

import { reviewVerificationAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function VerificationsPage() {
  const pending = await apiFetch<PendingFounderVerification[]>("/verification/founder/pending");

  return (
    <>
      <PageHeader title="Founder verifications" description="Registration certificates waiting on review." icon={ShieldCheck} />

      <div className="p-8">
        {pending.length === 0 ? (
          <div className="glass rounded-2xl p-10 text-center">
            <p className="text-sm font-semibold text-text">Nothing to review</p>
            <p className="mt-1 text-sm text-muted">No pending founder verifications right now.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {pending.map((item) => (
              <div key={item.id} className="glass rounded-2xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-indigo-500 font-display text-sm font-bold text-on-primary">
                      {(item.profile.fullName || "?").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-text">{item.profile.fullName || "Unnamed"}</div>
                      <div className="text-xs text-muted">{item.profile.headline}</div>
                    </div>
                  </div>
                  <a
                    href={item.documentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-shrink-0 items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-bold text-primary transition hover:bg-primary-muted"
                  >
                    <FileCheck className="h-3.5 w-3.5" strokeWidth={2} />
                    View certificate
                  </a>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-muted-bg/70 px-4 py-3 text-sm">
                  <div>
                    <div className="text-xs text-muted">Name on certificate</div>
                    <div className="font-semibold text-text">{item.certificateName}</div>
                  </div>
                  {item.cinNumber ? (
                    <div>
                      <div className="text-xs text-muted">CIN</div>
                      <div className="font-semibold text-text">{item.cinNumber}</div>
                    </div>
                  ) : null}
                </div>

                <div className="mt-4 flex gap-3">
                  <form action={reviewVerificationAction.bind(null, item.profileId, "approved")}>
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-indigo-500 px-4 py-2 text-sm font-bold text-on-primary shadow-sm shadow-primary/25 transition hover:brightness-105"
                    >
                      <CheckCircle2 className="h-4 w-4" strokeWidth={2} />
                      Approve
                    </button>
                  </form>
                  <form action={reviewVerificationAction.bind(null, item.profileId, "rejected")}>
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 rounded-lg border border-danger/30 px-4 py-2 text-sm font-bold text-danger transition hover:bg-danger-bg"
                    >
                      <XCircle className="h-4 w-4" strokeWidth={2} />
                      Reject
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
