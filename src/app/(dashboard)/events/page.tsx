import Link from "next/link";
import { Calendar, MapPin, Search, Users } from "lucide-react";

import { apiFetch } from "@/lib/api";
import { PageHeader } from "@/components/PageHeader";
import { DeleteButton } from "@/components/DeleteButton";
import type { AdminEvent, PaginatedResponse } from "@/lib/types";

import { deleteEventAction } from "./actions";

export const dynamic = "force-dynamic";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));

type EventsPageProps = {
  searchParams: Promise<{ page?: string; search?: string }>;
};

const pageLink = (page: number, search: string) => {
  const query = new URLSearchParams({ page: String(page) });
  if (search) query.set("search", search);
  return `/events?${query.toString()}`;
};

const statusTone: Record<string, string> = {
  ACTIVE: "bg-success-bg text-success",
  CANCELLED: "bg-danger-bg text-danger"
};

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const params = await searchParams;
  const page = Number(params.page ?? 1) || 1;
  const search = params.search?.trim() ?? "";
  const limit = 20;

  const query = new URLSearchParams({ limit: String(limit), page: String(page) });
  if (search) query.set("search", search);

  const result = await apiFetch<PaginatedResponse<AdminEvent>>(`/admin/events?${query.toString()}`);

  return (
    <>
      <PageHeader
        title="Events"
        description={`${result.meta.totalItems} events on Orbit. Force-remove listings that violate guidelines.`}
        icon={Calendar}
      />

      <div className="p-8">
        <div className="mb-5 flex items-center gap-3">
          <form method="get" className="glass flex w-full max-w-md items-center gap-2.5 rounded-xl px-4 py-2.5">
            <Search className="h-4 w-4 flex-shrink-0 text-muted" strokeWidth={2} />
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Search by title or location..."
              className="w-full bg-transparent text-sm text-text outline-none placeholder:text-muted"
            />
          </form>
          {search ? (
            <Link href="/events" className="flex-shrink-0 text-xs font-semibold text-primary hover:underline">
              Clear search
            </Link>
          ) : null}
        </div>

        <div className="flex flex-col gap-3">
          {result.data.map((event) => (
            <div key={event.id} className="glass flex items-center gap-4 rounded-2xl p-4">
              <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 text-sm font-bold text-white">
                {event.title.charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate font-semibold text-text">{event.title}</span>
                  <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${statusTone[event.status] ?? "bg-muted-bg text-muted"}`}>
                    {event.status}
                  </span>
                  <span className="flex-shrink-0 text-xs text-muted">{formatDate(event.createdAt)}</span>
                </div>
                <p className="mt-0.5 truncate text-xs text-muted">hosted by {event.host?.fullName ?? "Unknown"}</p>
                <div className="mt-2 flex items-center gap-4 text-xs text-muted">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" strokeWidth={2} />
                    {event.location || "No location"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" strokeWidth={2} />
                    {event._count.attendees} going
                  </span>
                  <span className="font-mono text-[11px] text-muted/80">{event.id}</span>
                </div>
              </div>
              <DeleteButton
                id={event.id}
                confirmTitle="Delete this event?"
                confirmDescription={`Permanently delete "${event.title}"? This can't be undone.`}
                onDelete={deleteEventAction}
              />
            </div>
          ))}

          {result.data.length === 0 ? (
            <div className="glass rounded-2xl p-10 text-center text-sm text-muted">
              {search ? `No events match "${search}".` : "No events found."}
            </div>
          ) : null}
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-muted">
          <span>
            Page {result.meta.currentPage} of {Math.max(result.meta.totalPages, 1)}
          </span>
          <div className="flex gap-2">
            {page > 1 ? (
              <Link href={pageLink(page - 1, search)} className="rounded-lg border border-border px-3 py-1.5 font-semibold text-text hover:bg-muted-bg">
                Previous
              </Link>
            ) : null}
            {page < result.meta.totalPages ? (
              <Link href={pageLink(page + 1, search)} className="rounded-lg border border-border px-3 py-1.5 font-semibold text-text hover:bg-muted-bg">
                Next
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
