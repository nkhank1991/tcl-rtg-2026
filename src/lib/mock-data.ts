import type {
  Match,
  Team,
  Standing,
  Group,
  BracketNode,
  ZoneScheduleItem,
  PrizePackage,
  Highlight,
  FaqItem,
  Notification,
} from "@/types";

// Teams
export const MOCK_TEAMS: Team[] = [
  { id: "t1", name: "Desert Hawks", shortName: "DHK", logoUrl: null, primaryColor: "#E4002B", bio: "Dubai's finest street football crew", source: "Community", group: { id: "g1", name: "Group A" }, players: [], standings: [] },
  { id: "t2", name: "Gulf United", shortName: "GUF", logoUrl: null, primaryColor: "#1E40AF", bio: "Bringing unity through football", source: "Academy", group: { id: "g1", name: "Group A" }, players: [], standings: [] },
  { id: "t3", name: "Falcon FC", shortName: "FFC", logoUrl: null, primaryColor: "#F59E0B", bio: "Fast, fierce, and focused", source: "Friends", group: { id: "g1", name: "Group A" }, players: [], standings: [] },
  { id: "t4", name: "Oasis Stars", shortName: "OAS", logoUrl: null, primaryColor: "#22C55E", bio: "Rising from the desert", source: "Community", group: { id: "g1", name: "Group A" }, players: [], standings: [] },
  { id: "t5", name: "Sand Vipers", shortName: "SVP", logoUrl: null, primaryColor: "#8B5CF6", bio: "Quick and deadly on the pitch", source: "Friends", group: { id: "g2", name: "Group B" }, players: [], standings: [] },
  { id: "t6", name: "Arabian Knights", shortName: "ARK", logoUrl: null, primaryColor: "#EDBB4A", bio: "Noble warriors of the game", source: "Community", group: { id: "g2", name: "Group B" }, players: [], standings: [] },
  { id: "t7", name: "Palm City FC", shortName: "PCF", logoUrl: null, primaryColor: "#EC4899", bio: "The pride of the city", source: "Academy", group: { id: "g2", name: "Group B" }, players: [], standings: [] },
  { id: "t8", name: "Dune Raiders", shortName: "DNR", logoUrl: null, primaryColor: "#F97316", bio: "Unstoppable momentum", source: "Friends", group: { id: "g2", name: "Group B" }, players: [], standings: [] },
  { id: "t9", name: "Crescent FC", shortName: "CFC", logoUrl: null, primaryColor: "#06B6D4", bio: "Rising to the occasion", source: "Corporate", group: { id: "g3", name: "Group C" }, players: [], standings: [] },
  { id: "t10", name: "Scorpion FC", shortName: "SFC", logoUrl: null, primaryColor: "#DC2626", bio: "Sharp and precise", source: "Community", group: { id: "g3", name: "Group C" }, players: [], standings: [] },
  { id: "t11", name: "Marina Wolves", shortName: "MWL", logoUrl: null, primaryColor: "#4F46E5", bio: "Prowling the pitch", source: "Friends", group: { id: "g3", name: "Group C" }, players: [], standings: [] },
  { id: "t12", name: "Burj Lions", shortName: "BLN", logoUrl: null, primaryColor: "#CA8A04", bio: "Kings of the game", source: "Academy", group: { id: "g3", name: "Group C" }, players: [], standings: [] },
  { id: "t13", name: "Al Noor FC", shortName: "ANR", logoUrl: null, primaryColor: "#16A34A", bio: "Shining bright on the field", source: "Community", group: { id: "g4", name: "Group D" }, players: [], standings: [] },
  { id: "t14", name: "Mirage FC", shortName: "MRG", logoUrl: null, primaryColor: "#7C3AED", bio: "Now you see us, now you score", source: "Friends", group: { id: "g4", name: "Group D" }, players: [], standings: [] },
  { id: "t15", name: "Sahara Storm", shortName: "SST", logoUrl: null, primaryColor: "#EA580C", bio: "A force of nature", source: "Academy", group: { id: "g4", name: "Group D" }, players: [], standings: [] },
  { id: "t16", name: "Pearl FC", shortName: "PRL", logoUrl: null, primaryColor: "#0891B2", bio: "Rare and valuable", source: "Corporate", group: { id: "g4", name: "Group D" }, players: [], standings: [] },
];

// Helper to build match objects concisely
const T: Record<string, { id: string; name: string; shortName: string; logoUrl: null; primaryColor: string }> = {};
MOCK_TEAMS.forEach(t => { T[t.shortName!] = { id: t.id, name: t.name, shortName: t.shortName!, logoUrl: null, primaryColor: t.primaryColor! }; });

function m(id: number, num: number, stage: Match["stage"], status: Match["status"], time: string, home: string | null, away: string | null, hg: number | null, ag: number | null, pitch: string, group: string | null): Match {
  return {
    id: `m${id}`, matchNumber: num, stage, status,
    scheduledAt: time, startedAt: status !== "SCHEDULED" ? time : null, endedAt: status === "COMPLETED" ? time : null,
    homeTeam: home ? T[home] : null, awayTeam: away ? T[away] : null,
    score: hg !== null && ag !== null ? { id: `s${id}`, matchId: `m${id}`, homeGoals: hg, awayGoals: ag, homePenalties: null, awayPenalties: null } : null,
    events: [], pitch: { name: pitch }, group: group ? { name: group } : null,
  };
}

// Day 1: April 26 — Group Stage (24 matches, 4 pitches)
// Day 2: April 27 — Knockouts (7 matches)
export const MOCK_MATCHES: Match[] = [
  // ── Day 1: 12:00 PM (Round 1) ──
  m(1,  1,  "GROUP", "SCHEDULED", "2026-04-26T08:00:00Z", "DHK", "OAS", null, null, "Pitch A", "Group A"),
  m(2,  2,  "GROUP", "SCHEDULED", "2026-04-26T08:00:00Z", "SVP", "DNR", null, null, "Pitch B", "Group B"),
  m(3,  3,  "GROUP", "SCHEDULED", "2026-04-26T08:00:00Z", "CFC", "BLN", null, null, "Pitch C", "Group C"),
  // ── 12:00 PM ──
  m(4,  4,  "GROUP", "SCHEDULED", "2026-04-26T08:00:00Z", "ANR", "PRL", null, null, "Pitch D", "Group D"),
  // ── 12:40 PM (Round 2) ──
  m(5,  5,  "GROUP", "SCHEDULED", "2026-04-26T08:40:00Z", "GUF", "FFC", null, null, "Pitch A", "Group A"),
  m(6,  6,  "GROUP", "SCHEDULED", "2026-04-26T08:40:00Z", "ARK", "PCF", null, null, "Pitch B", "Group B"),
  m(7,  7,  "GROUP", "SCHEDULED", "2026-04-26T08:40:00Z", "SFC", "MWL", null, null, "Pitch C", "Group C"),
  m(8,  8,  "GROUP", "SCHEDULED", "2026-04-26T08:40:00Z", "MRG", "SST", null, null, "Pitch D", "Group D"),
  // ── 1:20 PM (Round 3) ──
  m(9,  9,  "GROUP", "SCHEDULED", "2026-04-26T09:20:00Z", "DHK", "FFC", null, null, "Pitch A", "Group A"),
  m(10, 10, "GROUP", "SCHEDULED", "2026-04-26T09:20:00Z", "SVP", "PCF", null, null, "Pitch B", "Group B"),
  m(11, 11, "GROUP", "SCHEDULED", "2026-04-26T09:20:00Z", "CFC", "MWL", null, null, "Pitch C", "Group C"),
  m(12, 12, "GROUP", "SCHEDULED", "2026-04-26T09:20:00Z", "ANR", "SST", null, null, "Pitch D", "Group D"),
  // ── 2:00 PM (Round 4) ──
  m(13, 13, "GROUP", "SCHEDULED", "2026-04-26T10:00:00Z", "OAS", "GUF", null, null, "Pitch A", "Group A"),
  m(14, 14, "GROUP", "SCHEDULED", "2026-04-26T10:00:00Z", "DNR", "ARK", null, null, "Pitch B", "Group B"),
  m(15, 15, "GROUP", "SCHEDULED", "2026-04-26T10:00:00Z", "BLN", "SFC", null, null, "Pitch C", "Group C"),
  m(16, 16, "GROUP", "SCHEDULED", "2026-04-26T10:00:00Z", "PRL", "MRG", null, null, "Pitch D", "Group D"),
  // ── 2:40 PM (Round 5) ──
  m(17, 17, "GROUP", "SCHEDULED", "2026-04-26T10:40:00Z", "DHK", "GUF", null, null, "Pitch A", "Group A"),
  m(18, 18, "GROUP", "SCHEDULED", "2026-04-26T10:40:00Z", "SVP", "ARK", null, null, "Pitch B", "Group B"),
  m(19, 19, "GROUP", "SCHEDULED", "2026-04-26T10:40:00Z", "CFC", "SFC", null, null, "Pitch C", "Group C"),
  m(20, 20, "GROUP", "SCHEDULED", "2026-04-26T10:40:00Z", "ANR", "MRG", null, null, "Pitch D", "Group D"),
  // ── 3:20 PM (Round 6) ──
  m(21, 21, "GROUP", "SCHEDULED", "2026-04-26T11:20:00Z", "FFC", "OAS", null, null, "Pitch A", "Group A"),
  m(22, 22, "GROUP", "SCHEDULED", "2026-04-26T11:20:00Z", "PCF", "DNR", null, null, "Pitch B", "Group B"),
  m(23, 23, "GROUP", "SCHEDULED", "2026-04-26T11:20:00Z", "MWL", "BLN", null, null, "Pitch C", "Group C"),
  m(24, 24, "GROUP", "SCHEDULED", "2026-04-26T11:20:00Z", "SST", "PRL", null, null, "Pitch D", "Group D"),
  // ── Day 2: Knockouts ──
  m(25, 25, "QUARTER_FINAL", "SCHEDULED", "2026-04-27T08:00:00Z", null, null, null, null, "Pitch A", null),
  m(26, 26, "QUARTER_FINAL", "SCHEDULED", "2026-04-27T08:00:00Z", null, null, null, null, "Pitch B", null),
  m(27, 27, "QUARTER_FINAL", "SCHEDULED", "2026-04-27T08:40:00Z", null, null, null, null, "Pitch A", null),
  m(28, 28, "QUARTER_FINAL", "SCHEDULED", "2026-04-27T08:40:00Z", null, null, null, null, "Pitch B", null),
  m(29, 29, "SEMI_FINAL",    "SCHEDULED", "2026-04-27T09:40:00Z", null, null, null, null, "Pitch A", null),
  m(30, 30, "SEMI_FINAL",    "SCHEDULED", "2026-04-27T09:40:00Z", null, null, null, null, "Pitch B", null),
  m(31, 31, "FINAL",         "SCHEDULED", "2026-04-27T14:00:00Z", null, null, null, null, "Pitch A", null),
];

// Standings
function makeStanding(groupId: string, teamId: string, team: { id: string; name: string; shortName: string | null; logoUrl: string | null; primaryColor: string | null }, pos: number, p: number, w: number, d: number, l: number, gf: number, ga: number): Standing {
  return { id: `st-${teamId}`, groupId, teamId, team, played: p, won: w, drawn: d, lost: l, goalsFor: gf, goalsAgainst: ga, goalDifference: gf - ga, points: w * 3 + d, position: pos };
}

export const MOCK_GROUPS: Group[] = [
  {
    id: "g1", name: "Group A", order: 0,
    teams: MOCK_TEAMS.filter(t => t.group?.name === "Group A").map(t => ({ id: t.id, name: t.name, shortName: t.shortName, logoUrl: t.logoUrl, primaryColor: t.primaryColor })),
    standings: [
      makeStanding("g1", "t1", { id: "t1", name: "Desert Hawks", shortName: "DHK", logoUrl: null, primaryColor: "#E4002B" }, 1, 3, 2, 1, 0, 7, 3),
      makeStanding("g1", "t3", { id: "t3", name: "Falcon FC", shortName: "FFC", logoUrl: null, primaryColor: "#F59E0B" }, 2, 3, 1, 2, 0, 5, 3),
      makeStanding("g1", "t4", { id: "t4", name: "Oasis Stars", shortName: "OAS", logoUrl: null, primaryColor: "#22C55E" }, 3, 3, 1, 1, 1, 4, 4),
      makeStanding("g1", "t2", { id: "t2", name: "Gulf United", shortName: "GUF", logoUrl: null, primaryColor: "#1E40AF" }, 4, 3, 0, 0, 3, 2, 8),
    ],
  },
  {
    id: "g2", name: "Group B", order: 1,
    teams: MOCK_TEAMS.filter(t => t.group?.name === "Group B").map(t => ({ id: t.id, name: t.name, shortName: t.shortName, logoUrl: t.logoUrl, primaryColor: t.primaryColor })),
    standings: [
      makeStanding("g2", "t5", { id: "t5", name: "Sand Vipers", shortName: "SVP", logoUrl: null, primaryColor: "#8B5CF6" }, 1, 3, 3, 0, 0, 6, 1),
      makeStanding("g2", "t8", { id: "t8", name: "Dune Raiders", shortName: "DNR", logoUrl: null, primaryColor: "#F97316" }, 2, 3, 2, 0, 1, 5, 3),
      makeStanding("g2", "t6", { id: "t6", name: "Arabian Knights", shortName: "ARK", logoUrl: null, primaryColor: "#EDBB4A" }, 3, 3, 1, 0, 2, 3, 5),
      makeStanding("g2", "t7", { id: "t7", name: "Palm City FC", shortName: "PCF", logoUrl: null, primaryColor: "#EC4899" }, 4, 3, 0, 0, 3, 1, 6),
    ],
  },
  {
    id: "g3", name: "Group C", order: 2,
    teams: MOCK_TEAMS.filter(t => t.group?.name === "Group C").map(t => ({ id: t.id, name: t.name, shortName: t.shortName, logoUrl: t.logoUrl, primaryColor: t.primaryColor })),
    standings: [
      makeStanding("g3", "t9", { id: "t9", name: "Crescent FC", shortName: "CFC", logoUrl: null, primaryColor: "#06B6D4" }, 1, 3, 2, 1, 0, 6, 2),
      makeStanding("g3", "t12", { id: "t12", name: "Burj Lions", shortName: "BLN", logoUrl: null, primaryColor: "#CA8A04" }, 2, 3, 2, 0, 1, 4, 3),
      makeStanding("g3", "t10", { id: "t10", name: "Scorpion FC", shortName: "SFC", logoUrl: null, primaryColor: "#DC2626" }, 3, 3, 1, 0, 2, 3, 5),
      makeStanding("g3", "t11", { id: "t11", name: "Marina Wolves", shortName: "MWL", logoUrl: null, primaryColor: "#4F46E5" }, 4, 3, 0, 1, 2, 2, 5),
    ],
  },
  {
    id: "g4", name: "Group D", order: 3,
    teams: MOCK_TEAMS.filter(t => t.group?.name === "Group D").map(t => ({ id: t.id, name: t.name, shortName: t.shortName, logoUrl: t.logoUrl, primaryColor: t.primaryColor })),
    standings: [
      makeStanding("g4", "t13", { id: "t13", name: "Al Noor FC", shortName: "ANR", logoUrl: null, primaryColor: "#16A34A" }, 1, 3, 2, 1, 0, 5, 2),
      makeStanding("g4", "t15", { id: "t15", name: "Sahara Storm", shortName: "SST", logoUrl: null, primaryColor: "#EA580C" }, 2, 3, 2, 0, 1, 4, 2),
      makeStanding("g4", "t14", { id: "t14", name: "Mirage FC", shortName: "MRG", logoUrl: null, primaryColor: "#7C3AED" }, 3, 3, 1, 0, 2, 3, 4),
      makeStanding("g4", "t16", { id: "t16", name: "Pearl FC", shortName: "PRL", logoUrl: null, primaryColor: "#0891B2" }, 4, 3, 0, 1, 2, 2, 6),
    ],
  },
];

// Zone
export const MOCK_ZONE_ITEMS: ZoneScheduleItem[] = [
  { id: "z1", title: "Gaming Zone", description: "TCL gaming stations with the latest titles", imageUrl: null, location: "Hall A", startTime: "2026-03-26T17:00:00Z", endTime: "2026-03-26T22:00:00Z", status: "UPCOMING", category: "Gaming", capacity: 50 },
  { id: "z2", title: "Photo Booth", description: "Capture your Road to Greatness moment", imageUrl: null, location: "Hall A", startTime: "2026-03-26T17:00:00Z", endTime: "2026-03-26T22:00:00Z", status: "UPCOMING", category: "Photography", capacity: null },
  { id: "z3", title: "F&B Lounge", description: "Premium refreshments and hospitality", imageUrl: null, location: "Hall B", startTime: "2026-03-26T17:00:00Z", endTime: "2026-03-26T22:00:00Z", status: "UPCOMING", category: "Hospitality", capacity: 100 },
  { id: "z4", title: "Match Screening", description: "Watch live matches on the big screen", imageUrl: null, location: "Main Hall", startTime: "2026-03-26T19:30:00Z", endTime: "2026-03-26T22:00:00Z", status: "UPCOMING", category: "Screening", capacity: 200 },
];

// Prizes
export const MOCK_PRIZES: PrizePackage[] = [
  { id: "p1", title: "Trip to London", description: "An all-expenses-paid trip for the winning team to London, England", imageUrl: null, value: "Trip to London", tier: "GRAND" },
  { id: "p2", title: "Emirates Stadium Experience", description: "Exclusive behind-the-scenes access to the Emirates Stadium", imageUrl: null, value: "Stadium Tour", tier: "GRAND" },
  { id: "p3", title: "TCL Premium Kit", description: "Full team kit and TCL premium electronics package", imageUrl: null, value: "Electronics Package", tier: "GRAND" },
  { id: "p4", title: "Champions Trophy", description: "The official TCL × Arsenal Road to Greatness trophy", imageUrl: null, value: "Trophy", tier: "GRAND" },
  { id: "p5", title: "Runner-Up Package", description: "TCL electronics and Arsenal merchandise", imageUrl: null, value: "Electronics + Merch", tier: "RUNNER_UP" },
  { id: "p6", title: "MVP Award", description: "Special recognition for the tournament's most valuable player", imageUrl: null, value: "Individual Award", tier: "MVP" },
];

// Highlights
export const MOCK_HIGHLIGHTS: Highlight[] = [
  { id: "h1", title: "Desert Hawks Opening Goal", description: "Stunning volley to open the tournament", mediaUrl: "", mediaType: "video", thumbnailUrl: null, matchId: "m1", category: "Goals", publishedAt: "2026-03-25T16:15:00Z" },
  { id: "h2", title: "Incredible Save by Gulf United GK", description: "Point-blank save keeps the score close", mediaUrl: "", mediaType: "video", thumbnailUrl: null, matchId: "m1", category: "Saves", publishedAt: "2026-03-25T16:30:00Z" },
  { id: "h3", title: "Falcon FC Celebration", description: "Team celebration after equalizer", mediaUrl: "", mediaType: "video", thumbnailUrl: null, matchId: "m2", category: "Celebrations", publishedAt: "2026-03-25T16:40:00Z" },
  { id: "h4", title: "Sand Vipers Winner", description: "Last-minute winner sends fans wild", mediaUrl: "", mediaType: "video", thumbnailUrl: null, matchId: "m3", category: "Goals", publishedAt: "2026-03-25T17:40:00Z" },
  { id: "h5", title: "Opening Ceremony", description: "The Road to Greatness begins", mediaUrl: "", mediaType: "video", thumbnailUrl: null, matchId: null, category: "Event", publishedAt: "2026-03-25T15:30:00Z" },
  { id: "h6", title: "Best Moments Day 1", description: "Recap of all the action from Day 1", mediaUrl: "", mediaType: "video", thumbnailUrl: null, matchId: null, category: "Recap", publishedAt: "2026-03-25T22:00:00Z" },
];

// FAQ
export const MOCK_FAQ: FaqItem[] = [
  { id: "f1", question: "What is TCL × Arsenal Road to Greatness?", answer: "TCL × Arsenal Road to Greatness is a premium football tournament bringing together 16 of the best grassroots teams for two days of elite competition, culminating in a trip to London and the Emirates Stadium for the champions.", category: "General" },
  { id: "f2", question: "When and where is the event?", answer: "Event dates and venue details will be announced soon. Follow the app notifications to be the first to know.", category: "General" },
  { id: "f3", question: "How do I register my team?", answer: "Team captains can apply through the app by tapping 'Apply as Captain' on the home page. Fill out the application form with your team details and you'll be notified about your selection status.", category: "Registration" },
  { id: "f4", question: "How many players per team?", answer: "Each team should have a squad of 7-10 players. The minimum required to play is 5 players per match.", category: "Registration" },
  { id: "f5", question: "What is the selection process?", answer: "Applications are reviewed by the tournament committee. Teams are selected based on their application quality, team composition, and community representation. You'll receive status updates through the app.", category: "Registration" },
  { id: "f6", question: "What should I bring on match day?", answer: "Bring your team kit, football boots, shin guards, water, and a positive attitude. Team captains should ensure all squad members have completed their roster and agreement requirements in the app.", category: "Match Day" },
  { id: "f7", question: "What time should I arrive?", answer: "Teams should arrive at least 45 minutes before their first scheduled match. Check your match schedule in the app for exact timings.", category: "Match Day" },
  { id: "f8", question: "What is the Indoor Zone?", answer: "The Indoor Zone is an activation area that opens from the quarterfinal stage onward. It features gaming stations, photo opportunities, refreshments, and the match screening area.", category: "Indoor Zone" },
  { id: "f9", question: "When does match screening start?", answer: "Match screening in the Indoor Zone begins at 7:30 PM during the knockout stage. Check the Zone page in the app for live status updates.", category: "Indoor Zone" },
];

// Notifications
export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "n1", title: "Match Starting Soon", body: "Desert Hawks vs Gulf United kicks off in 30 minutes on Pitch 1", category: "match", data: { matchId: "m1" }, isRead: true, createdAt: "2026-03-25T15:30:00Z" },
  { id: "n2", title: "Goal! Desert Hawks 1-0", body: "Desert Hawks take the lead in the 12th minute", category: "match", data: { matchId: "m1" }, isRead: true, createdAt: "2026-03-25T16:12:00Z" },
  { id: "n3", title: "Full Time: Desert Hawks 3-1 Gulf United", body: "Desert Hawks win their opening match of the tournament", category: "match", data: { matchId: "m1" }, isRead: false, createdAt: "2026-03-25T16:45:00Z" },
  { id: "n4", title: "Indoor Zone Opens Soon", body: "The Indoor Zone opens at 5:00 PM with gaming, photo booth, and more", category: "zone", data: null, isRead: false, createdAt: "2026-03-26T16:30:00Z" },
  { id: "n5", title: "Highlights Available", body: "Day 1 highlights are now available. Relive the best moments!", category: "general", data: null, isRead: false, createdAt: "2026-03-25T22:00:00Z" },
];
