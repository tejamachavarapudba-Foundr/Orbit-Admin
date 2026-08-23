import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string | number;
  tone?: "default" | "success" | "danger";
  icon?: LucideIcon;
};

const toneText: Record<NonNullable<StatCardProps["tone"]>, string> = {
  default: "text-text",
  success: "text-success",
  danger: "text-danger"
};

const toneBadge: Record<NonNullable<StatCardProps["tone"]>, string> = {
  default: "bg-primary-muted text-primary",
  success: "bg-success-bg text-success",
  danger: "bg-danger-bg text-danger"
};

export const StatCard = ({ label, value, tone = "default", icon: Icon }: StatCardProps) => (
  <div className="glass flex items-center gap-4 rounded-2xl p-5 transition hover:-translate-y-0.5">
    {Icon ? (
      <span className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${toneBadge[tone]}`}>
        <Icon className="h-5 w-5" strokeWidth={2} />
      </span>
    ) : null}
    <div className="min-w-0">
      <div className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</div>
      <div className={`mt-1 truncate font-display text-2xl font-bold tabular-nums ${toneText[tone]}`}>{value}</div>
    </div>
  </div>
);
