import type { LucideIcon } from "lucide-react";

type PageHeaderProps = {
  title: string;
  description?: string;
  icon?: LucideIcon;
};

export const PageHeader = ({ title, description, icon: Icon }: PageHeaderProps) => (
  <div className="glass sticky top-0 z-10 flex items-center gap-3.5 rounded-none border-x-0 border-t-0 px-8 py-5">
    {Icon ? (
      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-indigo-500 text-on-primary shadow-md shadow-primary/25">
        <Icon className="h-5 w-5" strokeWidth={2} />
      </span>
    ) : null}
    <div className="min-w-0">
      <h1 className="font-display text-xl font-bold text-text">{title}</h1>
      {description ? <p className="mt-0.5 text-sm text-muted">{description}</p> : null}
    </div>
  </div>
);
