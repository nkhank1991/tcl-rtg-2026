// Campaign
export type CampaignState = "PRE_LAUNCH" | "LAUNCH" | "SCREENING" | "LIVE" | "POST_EVENT";

export interface Campaign {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  state: CampaignState;
  heroImageUrl: string | null;
  startDate: string | null;
  endDate: string | null;
  config: Record<string, unknown> | null;
}

// Match
export type MatchStage = "GROUP" | "QUARTER_FINAL" | "SEMI_FINAL" | "THIRD_PLACE" | "FINAL";

export type MatchStatus =
  | "SCHEDULED"
  | "LIVE_FIRST_HALF"
  | "HALF_TIME"
  | "LIVE_SECOND_HALF"
  | "FULL_TIME"
  | "PENALTIES"
  | "COMPLETED"
  | "POSTPONED"
  | "CANCELLED";

export interface Score {
  id: string;
  matchId: string;
  homeGoals: number;
  awayGoals: number;
  homePenalties: number | null;
  awayPenalties: number | null;
}

export interface MatchEvent {
  id: string;
  matchId: string;
  type: "GOAL" | "YELLOW_CARD" | "RED_CARD" | "SUBSTITUTION" | "PENALTY";
  minute: number;
  teamSide: "HOME" | "AWAY";
  playerName: string | null;
  detail: string | null;
}

export interface TeamSummary {
  id: string;
  name: string;
  shortName: string | null;
  logoUrl: string | null;
  primaryColor: string | null;
}

export interface Match {
  id: string;
  matchNumber: number | null;
  stage: MatchStage;
  status: MatchStatus;
  scheduledAt: string;
  startedAt: string | null;
  endedAt: string | null;
  homeTeam: TeamSummary | null;
  awayTeam: TeamSummary | null;
  score: Score | null;
  events: MatchEvent[];
  pitch: { name: string } | null;
  group: { name: string } | null;
}

// Team
export interface Player {
  id: string;
  name: string;
  position: string | null;
  number: number | null;
  photoUrl: string | null;
  isCaptain: boolean;
}

export interface Team {
  id: string;
  name: string;
  shortName: string | null;
  logoUrl: string | null;
  primaryColor: string | null;
  bio: string | null;
  source: string | null;
  group: { id: string; name: string } | null;
  players: Player[];
  standings: Standing[];
}

// Standings
export interface Standing {
  id: string;
  groupId: string;
  teamId: string;
  team: TeamSummary;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  position: number;
}

export interface Group {
  id: string;
  name: string;
  order: number;
  teams: TeamSummary[];
  standings: Standing[];
}

// Bracket
export interface BracketNode {
  id: string;
  stage: MatchStage;
  position: number;
  team: TeamSummary | null;
  winner: TeamSummary | null;
  matchId: string | null;
  label: string | null;
}

// Zone
export type ZoneStatus = "UPCOMING" | "ACTIVE" | "PAUSED" | "COMPLETED";

export interface ZoneScheduleItem {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  location: string | null;
  startTime: string;
  endTime: string;
  status: ZoneStatus;
  category: string | null;
  capacity: number | null;
}

// Prize
export interface PrizePackage {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  value: string | null;
  tier: string;
}

// Highlight
export interface Highlight {
  id: string;
  title: string;
  description: string | null;
  mediaUrl: string;
  mediaType: "video" | "image";
  thumbnailUrl: string | null;
  matchId: string | null;
  category: string | null;
  publishedAt: string;
}

// FAQ
export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string | null;
}

// Auth & User
export type UserRole = "FAN" | "CAPTAIN" | "ADMIN" | "SUPER_ADMIN";

export interface User {
  id: string;
  phone: string;
  name: string | null;
  email: string | null;
  avatarUrl: string | null;
  role: UserRole;
}

export interface Session {
  userId: string;
  role: UserRole;
  phone: string;
}

// Application
export type ApplicationStatus =
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "SHORTLISTED"
  | "RESERVE"
  | "CONFIRMED"
  | "NOT_SELECTED";

export interface Application {
  id: string;
  userId: string;
  status: ApplicationStatus;
  teamName: string;
  formData: ApplicationFormData;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  statusLogs: ApplicationStatusLog[];
}

export interface ApplicationFormData {
  fullName: string;
  mobile: string;
  email: string;
  area: string;
  teamName: string;
  socialHandle: string;
  teamType: string;
  squadSize: number;
  players: { name: string; position?: string }[];
  sourceCategory: string;
  sourceDetail: string;
  highlightLink?: string;
  whySelected: string;
}

export interface ApplicationStatusLog {
  id: string;
  fromStatus: ApplicationStatus | null;
  toStatus: ApplicationStatus;
  changedBy: string | null;
  reason: string | null;
  createdAt: string;
}

// Notification
export interface Notification {
  id: string;
  title: string;
  body: string;
  category: "match" | "application" | "zone" | "general";
  data: Record<string, unknown> | null;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationPreference {
  category: string;
  enabled: boolean;
}

// API Responses
export interface ApiResponse<T> {
  data: T;
  error?: never;
}

export interface ApiError {
  data?: never;
  error: string;
  details?: Record<string, string[]>;
}

export type ApiResult<T> = ApiResponse<T> | ApiError;
