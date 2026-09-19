// Every page here is an async Server Component (export const dynamic =
// "force-dynamic") -- it renders on the server, in whatever timezone that
// process happens to run in (UTC on this app's hosting), not the viewer's
// own. Every timestamp shown anywhere in this admin app pins to India time
// explicitly instead, since that's the actual team's timezone and the only
// one "6:16 AM" means anything useful in. Client Components (SessionRow,
// AnalyticsCharts) don't need this -- Intl.DateTimeFormat there already
// runs in the viewer's own browser timezone, which for this team is IST.
const TIME_ZONE = "Asia/Kolkata";

// "Sep 19, 6:16 AM" -- the most common shape, used for anything recent
// enough that the day alone isn't enough context.
export const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));

// "Sep 19, 2026, 6:16 AM" -- same as above plus the year, for records that
// might span more than the current year (e.g. reports filed long ago).
export const formatDateTimeWithYear = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));

// "Sep 19, 2026" -- date only, no time-of-day component.
export const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE, month: "short", day: "numeric", year: "numeric" }).format(new Date(value));

// "6:16 AM" -- time only.
export const formatTime = (value: string) =>
  new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE, hour: "numeric", minute: "2-digit" }).format(new Date(value));

// For a plain "YYYY-MM-DD" calendar-day key (e.g. one row of a day-wise
// report), not a real timestamp -- pinned to UTC, not TIME_ZONE. The key
// already names a specific day; converting it to IST could shift midnight
// across the day boundary and label it as the wrong day entirely.
export const formatDayLabel = (dateKey: string) =>
  new Intl.DateTimeFormat("en-US", { timeZone: "UTC", weekday: "short", month: "short", day: "numeric" }).format(
    new Date(`${dateKey}T00:00:00Z`)
  );
