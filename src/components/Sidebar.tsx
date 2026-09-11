"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BarChart3,
  Briefcase,
  Calendar,
  DatabaseZap,
  FileText,
  Flag,
  Globe2,
  History,
  KeyRound,
  ShieldAlert,
  LayoutDashboard,
  LogOut,
  MonitorSmartphone,
  ScrollText,
  Shield,
  ShieldCheck,
  UserPlus,
  Users
} from "lucide-react";

import { logoutAction } from "@/app/(dashboard)/actions";

const navItems = [
  { href: "/", label: "Overview", Icon: LayoutDashboard },
  { href: "/system-health", label: "System health", Icon: Activity },
  { href: "/analytics", label: "Analytics", Icon: BarChart3 },
  { href: "/users", label: "Users", Icon: Users },
  { href: "/admin-users", label: "Orbit accounts", Icon: UserPlus },
  { href: "/projects", label: "Startups", Icon: LayoutDashboard },
  { href: "/jobs", label: "Jobs", Icon: Briefcase },
  { href: "/events", label: "Events", Icon: Calendar },
  { href: "/communities", label: "Communities", Icon: Globe2 },
  { href: "/verifications", label: "Verifications", Icon: ShieldCheck },
  { href: "/posts", label: "Posts", Icon: FileText },
  { href: "/post-reports", label: "Post reports", Icon: Flag },
  { href: "/audit-logs", label: "Audit log", Icon: ScrollText },
  { href: "/data-privacy", label: "Data & privacy", Icon: Shield },
  // Every admin-tier role can view/revoke sessions (their own, or every
  // admin's if Super Admin) — the backend scopes what comes back, so this
  // item stays in the base list rather than the super-user-only append.
  { href: "/security/sessions", label: "Sessions", Icon: MonitorSmartphone }
] as const;

type SidebarProps = {
  email: string;
  isSuperUser?: boolean;
};

export const Sidebar = ({ email, isSuperUser = false }: SidebarProps) => {
  const pathname = usePathname();
  const items = isSuperUser
    ? [
        ...navItems,
        { href: "/super-admin", label: "Admin access", Icon: KeyRound },
        { href: "/security/login-history", label: "Login history", Icon: History },
        { href: "/security/account-alerts", label: "Account alerts", Icon: ShieldAlert },
        { href: "/security/direct-changes", label: "DB-level changes", Icon: DatabaseZap }
      ]
    : navItems;

  return (
    <aside className="glass sticky top-0 flex h-screen w-64 flex-shrink-0 flex-col rounded-none border-y-0 border-l-0">
      <div className="flex h-16 items-center gap-2.5 border-b border-border/60 px-5">
        <span className="flex h-8.5 w-8.5 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-indigo-500 text-on-primary shadow-md shadow-primary/30">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2l2.9 6.6L22 9.6l-5 4.9 1.2 6.9L12 18l-6.2 3.4L7 14.5 2 9.6l7.1-1z" />
          </svg>
        </span>
        <div className="min-w-0 leading-tight">
          <div className="font-display text-[15px] font-bold text-text">Orbit</div>
          <div className="text-[10.5px] font-semibold uppercase tracking-wide text-muted">Admin</div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        {items.map(({ href, label, Icon }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                isActive
                  ? "bg-gradient-to-r from-primary to-indigo-500 text-on-primary shadow-md shadow-primary/25"
                  : "text-text hover:bg-muted-bg/70"
              }`}
            >
              <Icon className={`h-4.5 w-4.5 flex-shrink-0 ${isActive ? "text-on-primary" : "text-muted"}`} strokeWidth={2} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border/60 p-3">
        <div className="mb-1 truncate px-2.5 text-xs text-muted">{email}</div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-left text-sm font-semibold text-muted transition hover:bg-danger-bg/60 hover:text-danger"
          >
            <LogOut className="h-4 w-4" strokeWidth={2} />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
};
