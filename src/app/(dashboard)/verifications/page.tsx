import { Award, Building2, CheckCircle2, FileCheck, ShieldCheck, XCircle } from "lucide-react";

import { apiFetch } from "@/lib/api";
import { PageHeader } from "@/components/PageHeader";
import type { PendingFounderVerification, PendingIncorporationVerification, PendingProfessionalVerification } from "@/lib/types";

import { reviewVerificationAction, reviewProfessionalVerificationAction, reviewIncorporationVerificationAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function VerificationsPage() {
  const [pendingFounders, pendingProfessionals, pendingIncorporations] = await Promise.all([
    apiFetch<PendingFounderVerification[]>("/verification/founder/pending"),
    apiFetch<PendingProfessionalVerification[]>("/verification/professional/pending"),
    apiFetch<PendingIncorporationVerification[]>("/admin/projects/incorporation/pending")
  ]);

  return (
    <>
      <PageHeader title="Verifications" description="Submissions waiting on review." icon={ShieldCheck} />

      <div className="flex flex-col gap-10 p-8">
        <section>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-muted">Founder verifications</h2>
          {pendingFounders.length === 0 ? (
            <div className="glass rounded-2xl p-10 text-center">
              <p className="text-sm font-semibold text-text">Nothing to review</p>
              <p className="mt-1 text-sm text-muted">No pending founder verifications right now.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {pendingFounders.map((item) => (
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
        </section>

        <section>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-muted">Professional verifications</h2>
          {pendingProfessionals.length === 0 ? (
            <div className="glass rounded-2xl p-10 text-center">
              <p className="text-sm font-semibold text-text">Nothing to review</p>
              <p className="mt-1 text-sm text-muted">No pending professional verifications right now.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {pendingProfessionals.map((item) => (
                <div key={item.profileId} className="glass rounded-2xl p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-indigo-500 font-display text-sm font-bold text-on-primary">
                      {(item.profile.fullName || "?").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-text">{item.profile.fullName || "Unnamed"}</div>
                      <div className="text-xs text-muted">{item.profile.headline}</div>
                    </div>
                  </div>

                  {item.experiences.length > 0 ? (
                    <div className="mt-4 flex flex-col gap-2 rounded-xl bg-muted-bg/70 px-4 py-3 text-sm">
                      <div className="text-xs text-muted">Experience</div>
                      {item.experiences.map((exp, i) => (
                        <div key={i}>
                          <span className="font-semibold text-text">{exp.designation || "—"}</span>
                          {exp.company ? <span className="text-text"> at {exp.company}</span> : null}
                          <div className="text-xs text-muted">
                            {exp.startDate} – {exp.isCurrent ? "Present" : exp.endDate}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {item.certifications.length > 0 ? (
                    <div className="mt-3 flex flex-col gap-2">
                      {item.certifications.map((cert, i) => (
                        <a
                          key={i}
                          href={cert.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                        >
                          <Award className="h-3.5 w-3.5" strokeWidth={2} />
                          {cert.name || "Certification"} — view file
                        </a>
                      ))}
                    </div>
                  ) : null}

                  <div className="mt-4 flex gap-3">
                    <form action={reviewProfessionalVerificationAction.bind(null, item.profileId, "approved")}>
                      <button
                        type="submit"
                        className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-indigo-500 px-4 py-2 text-sm font-bold text-on-primary shadow-sm shadow-primary/25 transition hover:brightness-105"
                      >
                        <CheckCircle2 className="h-4 w-4" strokeWidth={2} />
                        Approve
                      </button>
                    </form>
                    <form action={reviewProfessionalVerificationAction.bind(null, item.profileId, "rejected")}>
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
        </section>

        <section>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-muted">Certificate of Incorporation</h2>
          {pendingIncorporations.length === 0 ? (
            <div className="glass rounded-2xl p-10 text-center">
              <p className="text-sm font-semibold text-text">Nothing to review</p>
              <p className="mt-1 text-sm text-muted">No pending Certificate of Incorporation submissions right now.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {pendingIncorporations.map((item) => (
                <div key={item.id} className="glass rounded-2xl p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-indigo-500 font-display text-sm font-bold text-on-primary">
                        <Building2 className="h-5 w-5" strokeWidth={2} />
                      </div>
                      <div>
                        <div className="font-semibold text-text">{item.name || "Untitled project"}</div>
                        <div className="text-xs text-muted">
                          {item.tagline || "—"} · by {item.owner.fullName || "Unnamed"}
                        </div>
                      </div>
                    </div>
                    {item.incorporationDocUrl ? (
                      <a
                        href={item.incorporationDocUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex flex-shrink-0 items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-bold text-primary transition hover:bg-primary-muted"
                      >
                        <FileCheck className="h-3.5 w-3.5" strokeWidth={2} />
                        View certificate
                      </a>
                    ) : null}
                  </div>

                  {item.incorporationReason ? (
                    <div className="mt-4 rounded-xl bg-muted-bg/70 px-4 py-3 text-sm">
                      <div className="text-xs text-muted">Reason given (no file uploaded)</div>
                      <div className="mt-1 text-text">{item.incorporationReason}</div>
                    </div>
                  ) : null}

                  <div className="mt-4 flex gap-3">
                    <form action={reviewIncorporationVerificationAction.bind(null, item.id, "approved")}>
                      <button
                        type="submit"
                        className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-indigo-500 px-4 py-2 text-sm font-bold text-on-primary shadow-sm shadow-primary/25 transition hover:brightness-105"
                      >
                        <CheckCircle2 className="h-4 w-4" strokeWidth={2} />
                        Approve
                      </button>
                    </form>
                    <form action={reviewIncorporationVerificationAction.bind(null, item.id, "rejected")}>
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
        </section>
      </div>
    </>
  );
}
