export type SettingsTabId =
  | "account"
  | "notifications"
  | "career"
  | "privacy"
  | "connected"
  | "language"
  | "security";

export interface AccountSettings {
  fullName: string;
  username: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  tier: string;
  college: string;
  memberSince: string;
}

export interface NotificationPreferences {
  applicationUpdates: boolean;
  interviewDeadlines: boolean;
  dailyStreakAlerts: boolean;
  aiMentorInsights: boolean;
  jobMatchAlerts: boolean;
  matchScoreThreshold: number; // e.g. 85
  emailFrequency: "instant" | "daily_digest" | "weekly_summary" | "none";
  pushEnabled: boolean;
}

export interface CareerPreferencesSettings {
  primaryRole: string;
  secondaryRole: string;
  minSalaryLpa: number; // e.g. 12
  openToRelocation: boolean;
  preferredLocations: string[];
  employmentTypes: string[];
  earliestJoining: string;
}

export interface PrivacySettings {
  visibilityMode: "public" | "campus_only" | "incognito";
  recruiterSearchable: boolean;
  anonymizedBenchmarking: boolean;
  shareProjectsPublicly: boolean;
  allowRecruiterDirectMessages: boolean;
}

export interface ConnectedService {
  id: string;
  name: string;
  category: string;
  handle: string;
  connected: boolean;
  lastSynced: string;
  details: string;
  iconType: "github" | "leetcode" | "linkedin" | "google" | "supabase";
}

export interface LanguageSettings {
  language: string;
  dateFormat: string;
  currency: string;
  timezone: string;
}

export interface ActiveSessionItem {
  id: string;
  device: string;
  browser: string;
  ipAddress: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface SecurityActivityItem {
  id: string;
  event: string;
  timestamp: string;
  device: string;
  ip: string;
  status: "success" | "warning";
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  twoFactorType: "authenticator" | "sms";
  passwordLastChanged: string;
  activeSessions: ActiveSessionItem[];
  activityLog: SecurityActivityItem[];
}

export interface UserSettingsState {
  account: AccountSettings;
  notifications: NotificationPreferences;
  career: CareerPreferencesSettings;
  privacy: PrivacySettings;
  connectedServices: ConnectedService[];
  language: LanguageSettings;
  security: SecuritySettings;
}
