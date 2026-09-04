import { Award, Building2, CheckCircle2, FileCheck, ShieldCheck, XCircle } from "lucide-react";

import { apiFetch } from "@/lib/api";
import { PageHeader } from "@/components/PageHeader";
import type { PendingFounderVerification, PendingIncorporationVerification, PendingProfessionalVerification } from "@/lib/types";

import { reviewVerificationAction, reviewProfessionalVerificationAction, reviewIncorporationVerificationAction } from "./actions";

export const dynamic = "force-dynamic";

type Status = "pending" | "approved" | "rejected";
const STATUSES: Status[] = ["pending", "approved", "rejected"];

type SearchParams = { [key: string]: string | string[] | undefined };

const readStatus = (searchParams: SearchParams, key: string): Status => {
  const value = searchParams[key];
  const raw = Array.isArray(value) ? value[0] : value;
  return STATUSES.includes(raw as Status) ? (raw as Status) : "pending";
};

const buildHref = (searchParams: SearchParams, key: string, status: Status) => {
  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([k, v]) => {
    if (typeof v === "string") params.set(k, v);
  });
  params.set(key, status);
  return `/verifications?${params.toString()}`;
};

const StatusTabs = ({ searchParams, paramKey, active }: { searchParams: SearchParams; paramKey: string; active: Status }) => (
  <div className="mb-4 flex gap-1.5">
    {STATUSES.map((status) => (
      <a
        key={status}
        href={buildHref(searchParams, paramKey, status)}
        className={`rounded-lg px-3 py-1.5 text-xs font-bold capitalize transition ${
          active === status ? "bg-primary text-on-primary" : "border border-border text-muted hover:bg-primary-muted"
        }`}
      >
        {status}
      </a>
    ))}
  </div>
);

const ReviewActions = ({
  status,
  onApprove,
  onReject
}: {
  status: Status;
  onApprove: () => Promise<void>;
  onReject: () => Promise<void>;
}) => {
  if (status !== "pending") {
    return (
      <div
        className={`mt-4 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold ${
          status === "approved" ? "bg-primary-muted text-primary" : "bg-danger-bg text-danger"
        }`}
      >
        {status === "approved" ? <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2} /> : <XCircle className="h-3.5 w-3.5" strokeWidth={2} />}
        {status === "approved" ? "Approved" : "Rejected"}
      </div>
    );
  }

  return (
    <div className="mt-4 flex gap-3">
      <form action={onApprove}>
        <button
          type="submit"
          className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-indigo-500 px-4 py-2 text-sm font-bold text-on-primary shadow-sm shadow-primary/25 transition hover:brightness-105"
        >
          <CheckCircle2 className="h-4 w-4" strokeWidth={2} />
          Approve
        </button>
      </form>
      <form action={onReject}>
        <button
          type="submit"
          className="flex items-center gap-1.5 rounded-lg border border-danger/30 px-4 py-2 text-sm font-bold text-danger transition hover:bg-danger-bg"
        >
          <XCircle className="h-4 w-4" strokeWidth={2} />
          Reject
        </button>
      </form>
    </div>
  );
};

export default async function VerificationsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const founderStatus = readStatus(params, "founderStatus");
  const professionalStatus = readStatus(params, "professionalStatus");
  const incorporationStatus = readStatus(params, "incorporationStatus");

  const [founders, professionals, incorporations] = await Promise.all([
    apiFetch<PendingFounderVerification[]>(`/verification/founder/pending?status=${founderStatus}`),
    apiFetch<PendingProfessionalVerification[]>(`/verification/professional/pending?status=${professionalStatus}`),
    apiFetch<PendingIncorporationVerification[]>(`/admin/projects/incorporation/pending?status=${incorporationStatus}`)
  ]);

  return (
    <>
      <PageHeader title="Verifications" description="Submissions waiting on review." icon={ShieldCheck} />

      <div className="flex flex-col gap-10 p-8">
        <section>
          <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-muted">Founder verifications</h2>
          <StatusTabs searchParams={params} paramKey="founderStatus" active={founderStatus} />
          {founders.length === 0 ? (
            <div className="glass rounded-2xl p-10 text-center">
              <p className="text-sm font-semibold text-text">Nothing here</p>
              <p className="mt-1 text-sm text-muted">No {founderStatus} founder verifications right now.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {founders.map((item) => (
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

                  <ReviewActions
                    status={founderStatus}
                    onApprove={reviewVerificationAction.bind(null, item.profileId, "approved")}
                    onReject={reviewVerificationAction.bind(null, item.profileId, "rejected")}
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-muted">Professional verifications</h2>
          <StatusTabs searchParams={params} paramKey="professionalStatus" active={professionalStatus} />
          {professionals.length === 0 ? (
            <div className="glass rounded-2xl p-10 text-center">
              <p className="text-sm font-semibold text-text">Nothing here</p>
              <p className="mt-1 text-sm text-muted">No {professionalStatus} professional verifications right now.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {professionals.map((item) => (
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

                  <ReviewActions
                    status={professionalStatus}
                    onApprove={reviewProfessionalVerificationAction.bind(null, item.profileId, "approved")}
                    onReject={reviewProfessionalVerificationAction.bind(null, item.profileId, "rejected")}
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-muted">Certificate of Incorporation</h2>
          <StatusTabs searchParams={params} paramKey="incorporationStatus" active={incorporationStatus} />
          {incorporations.length === 0 ? (
            <div className="glass rounded-2xl p-10 text-center">
              <p className="text-sm font-semibold text-text">Nothing here</p>
              <p className="mt-1 text-sm text-muted">No {incorporationStatus} Certificate of Incorporation submissions right now.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {incorporations.map((item) => (
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

                  <ReviewActions
                    status={incorporationStatus}
                    onApprove={reviewIncorporationVerificationAction.bind(null, item.id, "approved")}
                    onReject={reviewIncorporationVerificationAction.bind(null, item.id, "rejected")}
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
