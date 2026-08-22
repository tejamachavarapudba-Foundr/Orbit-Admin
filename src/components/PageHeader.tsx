type PageHeaderProps = {
  title: string;
  description?: string;
};

export const PageHeader = ({ title, description }: PageHeaderProps) => (
  <div className="border-b border-border bg-surface px-8 py-5">
    <h1 className="font-display text-xl font-bold text-text">{title}</h1>
    {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
  </div>
);
