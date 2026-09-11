// DB role values are never renamed (baked into existing JWTs/guards on the
// backend) — this is the one place that maps them to the terms the admin
// panel actually shows, so "ADMIN" reads as "Content Admin" everywhere
// instead of the literal enum value being repeated across pages.
export const ROLE_LABELS: Record<string, string> = {
  SUPER_USER: "Super Admin",
  ADMIN: "Content Admin",
  ANALYST: "Analyst",
  READ_ONLY: "Read-only",
  USER: "User"
};

export const roleLabel = (role: string) => ROLE_LABELS[role] ?? role;

// Every role that can sign into orbit-admin at all. ANALYST/READ_ONLY can
// view but not mutate — enforced server-side by RolesGuard; this list is
// only used for the login/session gate, not for authorization itself.
export const ADMIN_TIER_ROLES = ["ADMIN", "SUPER_USER", "ANALYST", "READ_ONLY"] as const;

export const isAdminTierRole = (role: string | undefined) =>
  Boolean(role && (ADMIN_TIER_ROLES as readonly string[]).includes(role.toUpperCase()));

// Roles a Super Admin can assign to another account from this panel.
export const ASSIGNABLE_ROLES = ["USER", "READ_ONLY", "ANALYST", "ADMIN", "SUPER_USER"] as const;
