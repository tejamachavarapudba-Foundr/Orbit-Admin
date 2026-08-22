import Link from "next/link";

import { logoutAction } from "@/app/(dashboard)/actions";

const navItems = [
  { href: "/", label: "Overview", icon: "M3 11l9-8 9 8M5 10v10h14V10" },
  { href: "/users", label: "Users", icon: "M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" },
  { href: "/projects", label: "Startups", icon: "M2 7h20v14H2zM16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" },
  { href: "/verifications", label: "Verifications", icon: "M9 12l2 2 4-4M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" },
  { href: "/posts", label: "Posts", icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6" },
  { href: "/audit-logs", label: "Audit log", icon: "M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" }
] as const;

type SidebarProps = {
  email: string;
};

export const Sidebar = ({ email }: SidebarProps) => (
  <aside className="flex w-60 flex-shrink-0 flex-col border-r border-border bg-surface">
    <div className="flex h-16 items-center gap-2.5 border-b border-border px-5">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-on-primary">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2l2.9 6.6L22 9.6l-5 4.9 1.2 6.9L12 18l-6.2 3.4L7 14.5 2 9.6l7.1-1z" />
        </svg>
      </span>
      <span className="font-display text-base font-bold text-text">Orbit Admin</span>
    </div>

    <nav className="flex flex-1 flex-col gap-0.5 p-3">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-text hover:bg-muted-bg"
        >
          <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0 text-muted">
            <path d={item.icon} />
          </svg>
          {item.label}
        </Link>
      ))}
    </nav>

    <div className="border-t border-border p-3">
      <div className="mb-2 truncate px-2 text-xs text-muted">{email}</div>
      <form action={logoutAction}>
        <button
          type="submit"
          className="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-muted hover:bg-muted-bg hover:text-text"
        >
          Sign out
        </button>
      </form>
    </div>
  </aside>
);
