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
  isOrbitOwned?: boolean;
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
  meta: { totalItems: number; currentPage: number; totalPages: number };
  recentSystemActions: AuditLogEntry[];
};

export type AdminPost = {
  id: string;
  content: string;
  createdAt: string;
  author: { id: string; fullName: string; avatarUrl: string | null } | null;
  media: { id: string; url: string; type: string }[];
  _count: { likes: number; comments: number };
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

export type AdminAnalytics = {
  growth: {
    signupsByDay: { date: string; count: number }[];
    postsByDay: { date: string; count: number }[];
  };
  distribution: {
    roleBreakdown: { role: string; count: number }[];
  };
  verification: {
    founderVerificationBreakdown: { status: string; count: number }[];
    identityVerifiedRate: number;
    identityVerifiedCount: number;
    totalProfiles: number;
  };
  engagement: {
    likeCount: number;
    commentCount: number;
    savedPostCount: number;
  };
  funnels: {
    jobApplications: { status: string; count: number }[];
    projectApplications: { status: string; count: number }[];
  };
  health: {
    meetingsByStatus: { status: string; count: number }[];
    eventsByStatus: { status: string; count: number }[];
  };
};

export type AdminJob = {
  id: string;
  heading: string;
  startupName: string;
  role: string;
  createdAt: string;
  poster: { id: string; fullName: string } | null;
  _count: { applications: number };
};

export type AdminEvent = {
  id: string;
  title: string;
  location: string;
  status: string;
  startsAt: string;
  createdAt: string;
  host: { id: string; fullName: string } | null;
  _count: { attendees: number };
};

export type AdminPostReport = {
  id: string;
  postId: string;
  reason: string;
  status: "open" | "dismissed" | "actioned";
  createdAt: string;
  reporter: { id: string; fullName: string; avatarUrl: string | null } | null;
  post: {
    id: string;
    content: string;
    author: { id: string; fullName: string; avatarUrl: string | null } | null;
    media: { id: string; url: string; type: string }[];
    _count: { reports: number };
  };
};

export type AdminCommunity = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  owner: { id: string; fullName: string } | null;
  _count: { members: number };
};
