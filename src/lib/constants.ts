export const TOURNAMENT = {
  name: "TCL × Arsenal Road to Greatness 2026",
  shortName: "Road to Greatness",
  tagline: "Inspire It. Dream It. Do It.",
  year: 2026,
  totalTeams: 16,
  groupCount: 4,
  teamsPerGroup: 4,
  totalMatches: 31,
  pitchCount: 4,
  eventDays: 2,
} as const;

export const MATCH_STAGES = {
  GROUP: "Group Stage",
  QUARTER_FINAL: "Quarter Final",
  SEMI_FINAL: "Semi Final",
  THIRD_PLACE: "3rd Place",
  FINAL: "Final",
} as const;

export const APPLICATION_STATUSES = {
  SUBMITTED: { label: "Submitted", color: "text-info" },
  UNDER_REVIEW: { label: "Under Review", color: "text-warning" },
  SHORTLISTED: { label: "Shortlisted", color: "text-arsenal-gold" },
  RESERVE: { label: "Reserve List", color: "text-text-secondary" },
  CONFIRMED: { label: "Confirmed", color: "text-success" },
  NOT_SELECTED: { label: "Not Selected", color: "text-text-muted" },
} as const;

export const MATCH_STATUS_LABELS: Record<string, string> = {
  SCHEDULED: "Scheduled",
  LIVE_FIRST_HALF: "1st Half",
  HALF_TIME: "Half Time",
  LIVE_SECOND_HALF: "2nd Half",
  FULL_TIME: "Full Time",
  PENALTIES: "Penalties",
  COMPLETED: "Completed",
  POSTPONED: "Postponed",
  CANCELLED: "Cancelled",
};

export const NAV_ITEMS = [
  { href: "/", label: "Home", icon: "Home" },
  { href: "/matches", label: "Matches", icon: "Calendar" },
  { href: "/standings", label: "Standings", icon: "Trophy" },
  { href: "/zone", label: "Zone", icon: "Zap" },
  { href: "/more", label: "More", icon: "Menu" },
] as const;

export const MORE_MENU_ITEMS = [
  { href: "/teams", label: "Teams", icon: "Users" },
  { href: "/prize", label: "Prize", icon: "Award" },
  { href: "/highlights", label: "Highlights", icon: "Play" },
  { href: "/notifications", label: "Notifications", icon: "Bell" },
  { href: "/faq", label: "FAQ", icon: "HelpCircle" },
  { href: "/my-team", label: "My Team", icon: "Shield" },
] as const;

export const KIT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;

export const POSITIONS = ["GK", "DEF", "MID", "FWD"] as const;

export const SOURCE_CATEGORIES = [
  "Social Media",
  "Friend / Word of Mouth",
  "Community / Academy",
  "Influencer",
  "QR Code / Flyer",
  "Venue / Event",
  "Direct Invite",
  "Other",
] as const;

export const NOTIFICATION_CATEGORIES = [
  { key: "match", label: "Match Updates" },
  { key: "application", label: "Application Status" },
  { key: "zone", label: "Zone & Screening" },
  { key: "general", label: "General" },
] as const;
