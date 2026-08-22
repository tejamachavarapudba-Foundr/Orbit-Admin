export type AdminProfile = {
  id: string;
  fullName: string;
  headline: string;
  avatarUrl: string;
  role: string;
};

export type AdminUser = {
  id: string;
  email: string;
  role: string;
  isBanned: boolean;
  createdAt: string;
  updatedAt: string;
  profile: AdminProfile | null;
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    totalItems: number;
    itemCount?: number;
    itemsPerPage?: number;
    totalPages: number;
    currentPage: number;
  };
};

export type AdminStats = {
  overview: {
    totalUsers: number;
    activeUsers: number;
    bannedUsers: number;
    totalProjects: number;
    totalJobs: number;
    totalMessages: number;
    conversionRate: string;
  };
  growthMetrics: {
    projectsByStage: { stage: string; count: number }[];
  };
  systemStatus: {
    databaseConnected: boolean;
    timestamp: string;
  };
};

export type AdminProject = {
  id: string;
  name: string;
  tagline: string;
  stage: string;
  projectType: string;
  isPublished: boolean;
  isVerified: boolean;
  createdAt: string;
  owner: { id: string; fullName: string } | null;
};

export type AuditLogEntry = {
  id: string;
  action: string;
  details: string;
  targetId: string | null;
  timestamp: string;
  performedBy: { userId: string; name: string };
};

export type AuditLogResponse = {
  logSource: string;
  generatedAt: string;
  recentSystemActions: AuditLogEntry[];
};

export type PendingFounderVerification = {
  id: string;
  profileId: string;
  documentUrl: string;
  certificateName: string;
  cinNumber: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  profile: { id: string; fullName: string; avatarUrl: string; headline: string };
};
