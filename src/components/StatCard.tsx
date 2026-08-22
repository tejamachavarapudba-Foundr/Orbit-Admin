type StatCardProps = {
  label: string;
  value: string | number;
  tone?: "default" | "success" | "danger";
};

const toneClass: Record<NonNullable<StatCardProps["tone"]>, string> = {
  default: "text-text",
  success: "text-success",
  danger: "text-danger"
};

export const StatCard = ({ label, value, tone = "default" }: StatCardProps) => (
  <div className="rounded-xl border border-border bg-surface p-4">
    <div className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</div>
    <div className={`mt-2 font-display text-2xl font-bold tabular-nums ${toneClass[tone]}`}>{value}</div>
  </div>
);
