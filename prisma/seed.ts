import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // ── Campaign ──
  const campaign = await prisma.campaign.upsert({
    where: { slug: "rtg-2026" },
    update: {},
    create: {
      slug: "rtg-2026",
      title: "Road to Greatness",
      tagline: "Inspire It. Dream It. Do It.",
      state: "PRE_LAUNCH",
      startDate: new Date("2026-04-26T08:00:00Z"),
      endDate: new Date("2026-04-27T22:00:00Z"),
    },
  });
  console.log("  ✓ Campaign");

  // ── Event Days ──
  const day1 = await prisma.eventDay.upsert({
    where: { id: "day1" },
    update: {},
    create: { id: "day1", campaignId: campaign.id, dayNumber: 1, date: new Date("2026-04-26"), label: "Day 1 — Group Stage" },
  });
  const day2 = await prisma.eventDay.upsert({
    where: { id: "day2" },
    update: {},
    create: { id: "day2", campaignId: campaign.id, dayNumber: 2, date: new Date("2026-04-27"), label: "Day 2 — Knockouts" },
  });
  console.log("  ✓ Event Days");

  // ── Venue & Pitches ──
  const venue = await prisma.venue.upsert({
    where: { id: "venue1" },
    update: {},
    create: { id: "venue1", name: "TCL Arena", address: "Dubai, UAE" },
  });

  const pitchNames = ["Pitch A", "Pitch B", "Pitch C", "Pitch D"];
  const pitches: Record<string, string> = {};
  for (const name of pitchNames) {
    const pitch = await prisma.pitch.upsert({
      where: { id: `pitch-${name.replace(" ", "-").toLowerCase()}` },
      update: {},
      create: { id: `pitch-${name.replace(" ", "-").toLowerCase()}`, venueId: venue.id, name, label: name },
    });
    pitches[name] = pitch.id;
  }
  console.log("  ✓ Venue & Pitches");

  // ── Groups ──
  const groupData = [
    { id: "g1", name: "Group A", order: 0 },
    { id: "g2", name: "Group B", order: 1 },
    { id: "g3", name: "Group C", order: 2 },
    { id: "g4", name: "Group D", order: 3 },
  ];
  for (const g of groupData) {
    await prisma.group.upsert({ where: { id: g.id }, update: {}, create: g });
  }
  console.log("  ✓ Groups");

  // ── Teams ──
  const teams = [
    { id: "t1",  name: "Desert Hawks",    shortName: "DHK", primaryColor: "#E4002B", bio: "Dubai's finest street football crew",    source: "Community", groupId: "g1" },
    { id: "t2",  name: "Gulf United",      shortName: "GUF", primaryColor: "#1E40AF", bio: "Bringing unity through football",        source: "Academy",   groupId: "g1" },
    { id: "t3",  name: "Falcon FC",        shortName: "FFC", primaryColor: "#F59E0B", bio: "Fast, fierce, and focused",              source: "Friends",   groupId: "g1" },
    { id: "t4",  name: "Oasis Stars",      shortName: "OAS", primaryColor: "#22C55E", bio: "Rising from the desert",                 source: "Community", groupId: "g1" },
    { id: "t5",  name: "Sand Vipers",      shortName: "SVP", primaryColor: "#8B5CF6", bio: "Quick and deadly on the pitch",          source: "Friends",   groupId: "g2" },
    { id: "t6",  name: "Arabian Knights",  shortName: "ARK", primaryColor: "#EDBB4A", bio: "Noble warriors of the game",             source: "Community", groupId: "g2" },
    { id: "t7",  name: "Palm City FC",     shortName: "PCF", primaryColor: "#EC4899", bio: "The pride of the city",                  source: "Academy",   groupId: "g2" },
    { id: "t8",  name: "Dune Raiders",     shortName: "DNR", primaryColor: "#F97316", bio: "Unstoppable momentum",                   source: "Friends",   groupId: "g2" },
    { id: "t9",  name: "Crescent FC",      shortName: "CFC", primaryColor: "#06B6D4", bio: "Rising to the occasion",                 source: "Corporate", groupId: "g3" },
    { id: "t10", name: "Scorpion FC",      shortName: "SFC", primaryColor: "#DC2626", bio: "Sharp and precise",                      source: "Community", groupId: "g3" },
    { id: "t11", name: "Marina Wolves",    shortName: "MWL", primaryColor: "#4F46E5", bio: "Prowling the pitch",                     source: "Friends",   groupId: "g3" },
    { id: "t12", name: "Burj Lions",       shortName: "BLN", primaryColor: "#CA8A04", bio: "Kings of the game",                      source: "Academy",   groupId: "g3" },
    { id: "t13", name: "Al Noor FC",       shortName: "ANR", primaryColor: "#16A34A", bio: "Shining bright on the field",            source: "Community", groupId: "g4" },
    { id: "t14", name: "Mirage FC",        shortName: "MRG", primaryColor: "#7C3AED", bio: "Now you see us, now you score",          source: "Friends",   groupId: "g4" },
    { id: "t15", name: "Sahara Storm",     shortName: "SST", primaryColor: "#EA580C", bio: "A force of nature",                      source: "Academy",   groupId: "g4" },
    { id: "t16", name: "Pearl FC",         shortName: "PRL", primaryColor: "#0891B2", bio: "Rare and valuable",                      source: "Corporate", groupId: "g4" },
  ];

  for (const t of teams) {
    await prisma.team.upsert({ where: { id: t.id }, update: {}, create: t });
  }
  console.log("  ✓ Teams");

  // ── Standings ──
  const standings = [
    // Group A
    { id: "st-t1",  groupId: "g1", teamId: "t1",  played: 3, won: 2, drawn: 1, lost: 0, goalsFor: 7, goalsAgainst: 3, goalDifference: 4,  points: 7, position: 1 },
    { id: "st-t3",  groupId: "g1", teamId: "t3",  played: 3, won: 1, drawn: 2, lost: 0, goalsFor: 5, goalsAgainst: 3, goalDifference: 2,  points: 5, position: 2 },
    { id: "st-t4",  groupId: "g1", teamId: "t4",  played: 3, won: 1, drawn: 1, lost: 1, goalsFor: 4, goalsAgainst: 4, goalDifference: 0,  points: 4, position: 3 },
    { id: "st-t2",  groupId: "g1", teamId: "t2",  played: 3, won: 0, drawn: 0, lost: 3, goalsFor: 2, goalsAgainst: 8, goalDifference: -6, points: 0, position: 4 },
    // Group B
    { id: "st-t5",  groupId: "g2", teamId: "t5",  played: 3, won: 3, drawn: 0, lost: 0, goalsFor: 6, goalsAgainst: 1, goalDifference: 5,  points: 9, position: 1 },
    { id: "st-t8",  groupId: "g2", teamId: "t8",  played: 3, won: 2, drawn: 0, lost: 1, goalsFor: 5, goalsAgainst: 3, goalDifference: 2,  points: 6, position: 2 },
    { id: "st-t6",  groupId: "g2", teamId: "t6",  played: 3, won: 1, drawn: 0, lost: 2, goalsFor: 3, goalsAgainst: 5, goalDifference: -2, points: 3, position: 3 },
    { id: "st-t7",  groupId: "g2", teamId: "t7",  played: 3, won: 0, drawn: 0, lost: 3, goalsFor: 1, goalsAgainst: 6, goalDifference: -5, points: 0, position: 4 },
    // Group C
    { id: "st-t9",  groupId: "g3", teamId: "t9",  played: 3, won: 2, drawn: 1, lost: 0, goalsFor: 6, goalsAgainst: 2, goalDifference: 4,  points: 7, position: 1 },
    { id: "st-t12", groupId: "g3", teamId: "t12", played: 3, won: 2, drawn: 0, lost: 1, goalsFor: 4, goalsAgainst: 3, goalDifference: 1,  points: 6, position: 2 },
    { id: "st-t10", groupId: "g3", teamId: "t10", played: 3, won: 1, drawn: 0, lost: 2, goalsFor: 3, goalsAgainst: 5, goalDifference: -2, points: 3, position: 3 },
    { id: "st-t11", groupId: "g3", teamId: "t11", played: 3, won: 0, drawn: 1, lost: 2, goalsFor: 2, goalsAgainst: 5, goalDifference: -3, points: 1, position: 4 },
    // Group D
    { id: "st-t13", groupId: "g4", teamId: "t13", played: 3, won: 2, drawn: 1, lost: 0, goalsFor: 5, goalsAgainst: 2, goalDifference: 3,  points: 7, position: 1 },
    { id: "st-t15", groupId: "g4", teamId: "t15", played: 3, won: 2, drawn: 0, lost: 1, goalsFor: 4, goalsAgainst: 2, goalDifference: 2,  points: 6, position: 2 },
    { id: "st-t14", groupId: "g4", teamId: "t14", played: 3, won: 1, drawn: 0, lost: 2, goalsFor: 3, goalsAgainst: 4, goalDifference: -1, points: 3, position: 3 },
    { id: "st-t16", groupId: "g4", teamId: "t16", played: 3, won: 0, drawn: 1, lost: 2, goalsFor: 2, goalsAgainst: 6, goalDifference: -4, points: 1, position: 4 },
  ];

  for (const s of standings) {
    await prisma.standing.upsert({ where: { id: s.id }, update: {}, create: s });
  }
  console.log("  ✓ Standings");

  // ── Helper: team shortName → id ──
  const teamMap: Record<string, string> = {};
  teams.forEach((t) => { teamMap[t.shortName] = t.id; });

  // ── Helper: group name → id ──
  const groupMap: Record<string, string> = { "Group A": "g1", "Group B": "g2", "Group C": "g3", "Group D": "g4" };

  // ── Matches ──
  type MatchSeed = {
    id: string; matchNumber: number; stage: "GROUP" | "QUARTER_FINAL" | "SEMI_FINAL" | "THIRD_PLACE" | "FINAL";
    status: "SCHEDULED"; scheduledAt: string; homeShort: string | null; awayShort: string | null;
    pitchName: string; groupName: string | null; eventDayId: string;
  };

  const matchSeeds: MatchSeed[] = [
    // Day 1: Group Stage
    { id: "m1",  matchNumber: 1,  stage: "GROUP", status: "SCHEDULED", scheduledAt: "2026-04-26T08:00:00Z", homeShort: "DHK", awayShort: "OAS", pitchName: "Pitch A", groupName: "Group A", eventDayId: "day1" },
    { id: "m2",  matchNumber: 2,  stage: "GROUP", status: "SCHEDULED", scheduledAt: "2026-04-26T08:00:00Z", homeShort: "SVP", awayShort: "DNR", pitchName: "Pitch B", groupName: "Group B", eventDayId: "day1" },
    { id: "m3",  matchNumber: 3,  stage: "GROUP", status: "SCHEDULED", scheduledAt: "2026-04-26T08:00:00Z", homeShort: "CFC", awayShort: "BLN", pitchName: "Pitch C", groupName: "Group C", eventDayId: "day1" },
    { id: "m4",  matchNumber: 4,  stage: "GROUP", status: "SCHEDULED", scheduledAt: "2026-04-26T08:00:00Z", homeShort: "ANR", awayShort: "PRL", pitchName: "Pitch D", groupName: "Group D", eventDayId: "day1" },
    { id: "m5",  matchNumber: 5,  stage: "GROUP", status: "SCHEDULED", scheduledAt: "2026-04-26T08:40:00Z", homeShort: "GUF", awayShort: "FFC", pitchName: "Pitch A", groupName: "Group A", eventDayId: "day1" },
    { id: "m6",  matchNumber: 6,  stage: "GROUP", status: "SCHEDULED", scheduledAt: "2026-04-26T08:40:00Z", homeShort: "ARK", awayShort: "PCF", pitchName: "Pitch B", groupName: "Group B", eventDayId: "day1" },
    { id: "m7",  matchNumber: 7,  stage: "GROUP", status: "SCHEDULED", scheduledAt: "2026-04-26T08:40:00Z", homeShort: "SFC", awayShort: "MWL", pitchName: "Pitch C", groupName: "Group C", eventDayId: "day1" },
    { id: "m8",  matchNumber: 8,  stage: "GROUP", status: "SCHEDULED", scheduledAt: "2026-04-26T08:40:00Z", homeShort: "MRG", awayShort: "SST", pitchName: "Pitch D", groupName: "Group D", eventDayId: "day1" },
    { id: "m9",  matchNumber: 9,  stage: "GROUP", status: "SCHEDULED", scheduledAt: "2026-04-26T09:20:00Z", homeShort: "DHK", awayShort: "FFC", pitchName: "Pitch A", groupName: "Group A", eventDayId: "day1" },
    { id: "m10", matchNumber: 10, stage: "GROUP", status: "SCHEDULED", scheduledAt: "2026-04-26T09:20:00Z", homeShort: "SVP", awayShort: "PCF", pitchName: "Pitch B", groupName: "Group B", eventDayId: "day1" },
    { id: "m11", matchNumber: 11, stage: "GROUP", status: "SCHEDULED", scheduledAt: "2026-04-26T09:20:00Z", homeShort: "CFC", awayShort: "MWL", pitchName: "Pitch C", groupName: "Group C", eventDayId: "day1" },
    { id: "m12", matchNumber: 12, stage: "GROUP", status: "SCHEDULED", scheduledAt: "2026-04-26T09:20:00Z", homeShort: "ANR", awayShort: "SST", pitchName: "Pitch D", groupName: "Group D", eventDayId: "day1" },
    { id: "m13", matchNumber: 13, stage: "GROUP", status: "SCHEDULED", scheduledAt: "2026-04-26T10:00:00Z", homeShort: "OAS", awayShort: "GUF", pitchName: "Pitch A", groupName: "Group A", eventDayId: "day1" },
    { id: "m14", matchNumber: 14, stage: "GROUP", status: "SCHEDULED", scheduledAt: "2026-04-26T10:00:00Z", homeShort: "DNR", awayShort: "ARK", pitchName: "Pitch B", groupName: "Group B", eventDayId: "day1" },
    { id: "m15", matchNumber: 15, stage: "GROUP", status: "SCHEDULED", scheduledAt: "2026-04-26T10:00:00Z", homeShort: "BLN", awayShort: "SFC", pitchName: "Pitch C", groupName: "Group C", eventDayId: "day1" },
    { id: "m16", matchNumber: 16, stage: "GROUP", status: "SCHEDULED", scheduledAt: "2026-04-26T10:00:00Z", homeShort: "PRL", awayShort: "MRG", pitchName: "Pitch D", groupName: "Group D", eventDayId: "day1" },
    { id: "m17", matchNumber: 17, stage: "GROUP", status: "SCHEDULED", scheduledAt: "2026-04-26T10:40:00Z", homeShort: "DHK", awayShort: "GUF", pitchName: "Pitch A", groupName: "Group A", eventDayId: "day1" },
    { id: "m18", matchNumber: 18, stage: "GROUP", status: "SCHEDULED", scheduledAt: "2026-04-26T10:40:00Z", homeShort: "SVP", awayShort: "ARK", pitchName: "Pitch B", groupName: "Group B", eventDayId: "day1" },
    { id: "m19", matchNumber: 19, stage: "GROUP", status: "SCHEDULED", scheduledAt: "2026-04-26T10:40:00Z", homeShort: "CFC", awayShort: "SFC", pitchName: "Pitch C", groupName: "Group C", eventDayId: "day1" },
    { id: "m20", matchNumber: 20, stage: "GROUP", status: "SCHEDULED", scheduledAt: "2026-04-26T10:40:00Z", homeShort: "ANR", awayShort: "MRG", pitchName: "Pitch D", groupName: "Group D", eventDayId: "day1" },
    { id: "m21", matchNumber: 21, stage: "GROUP", status: "SCHEDULED", scheduledAt: "2026-04-26T11:20:00Z", homeShort: "FFC", awayShort: "OAS", pitchName: "Pitch A", groupName: "Group A", eventDayId: "day1" },
    { id: "m22", matchNumber: 22, stage: "GROUP", status: "SCHEDULED", scheduledAt: "2026-04-26T11:20:00Z", homeShort: "PCF", awayShort: "DNR", pitchName: "Pitch B", groupName: "Group B", eventDayId: "day1" },
    { id: "m23", matchNumber: 23, stage: "GROUP", status: "SCHEDULED", scheduledAt: "2026-04-26T11:20:00Z", homeShort: "MWL", awayShort: "BLN", pitchName: "Pitch C", groupName: "Group C", eventDayId: "day1" },
    { id: "m24", matchNumber: 24, stage: "GROUP", status: "SCHEDULED", scheduledAt: "2026-04-26T11:20:00Z", homeShort: "SST", awayShort: "PRL", pitchName: "Pitch D", groupName: "Group D", eventDayId: "day1" },
    // Day 2: Knockouts
    { id: "m25", matchNumber: 25, stage: "QUARTER_FINAL", status: "SCHEDULED", scheduledAt: "2026-04-27T08:00:00Z", homeShort: null, awayShort: null, pitchName: "Pitch A", groupName: null, eventDayId: "day2" },
    { id: "m26", matchNumber: 26, stage: "QUARTER_FINAL", status: "SCHEDULED", scheduledAt: "2026-04-27T08:00:00Z", homeShort: null, awayShort: null, pitchName: "Pitch B", groupName: null, eventDayId: "day2" },
    { id: "m27", matchNumber: 27, stage: "QUARTER_FINAL", status: "SCHEDULED", scheduledAt: "2026-04-27T08:40:00Z", homeShort: null, awayShort: null, pitchName: "Pitch A", groupName: null, eventDayId: "day2" },
    { id: "m28", matchNumber: 28, stage: "QUARTER_FINAL", status: "SCHEDULED", scheduledAt: "2026-04-27T08:40:00Z", homeShort: null, awayShort: null, pitchName: "Pitch B", groupName: null, eventDayId: "day2" },
    { id: "m29", matchNumber: 29, stage: "SEMI_FINAL",    status: "SCHEDULED", scheduledAt: "2026-04-27T09:40:00Z", homeShort: null, awayShort: null, pitchName: "Pitch A", groupName: null, eventDayId: "day2" },
    { id: "m30", matchNumber: 30, stage: "SEMI_FINAL",    status: "SCHEDULED", scheduledAt: "2026-04-27T09:40:00Z", homeShort: null, awayShort: null, pitchName: "Pitch B", groupName: null, eventDayId: "day2" },
    { id: "m31", matchNumber: 31, stage: "FINAL",         status: "SCHEDULED", scheduledAt: "2026-04-27T14:00:00Z", homeShort: null, awayShort: null, pitchName: "Pitch A", groupName: null, eventDayId: "day2" },
  ];

  for (const ms of matchSeeds) {
    await prisma.match.upsert({
      where: { id: ms.id },
      update: {},
      create: {
        id: ms.id,
        matchNumber: ms.matchNumber,
        stage: ms.stage,
        status: ms.status,
        scheduledAt: new Date(ms.scheduledAt),
        eventDayId: ms.eventDayId,
        pitchId: pitches[ms.pitchName],
        groupId: ms.groupName ? groupMap[ms.groupName] : null,
        homeTeamId: ms.homeShort ? teamMap[ms.homeShort] : null,
        awayTeamId: ms.awayShort ? teamMap[ms.awayShort] : null,
      },
    });
  }
  console.log("  ✓ Matches (31)");

  // ── Zone Schedule ──
  const zones = [
    { id: "z1", title: "Gaming Zone",     description: "TCL gaming stations with the latest titles",     location: "Hall A",    startTime: "2026-04-26T13:00:00Z", endTime: "2026-04-26T18:00:00Z", status: "UPCOMING" as const, category: "Gaming",       capacity: 50,  order: 0 },
    { id: "z2", title: "Photo Booth",     description: "Capture your Road to Greatness moment",          location: "Hall A",    startTime: "2026-04-26T13:00:00Z", endTime: "2026-04-26T18:00:00Z", status: "UPCOMING" as const, category: "Photography",  capacity: null, order: 1 },
    { id: "z3", title: "F&B Lounge",      description: "Premium refreshments and hospitality",           location: "Hall B",    startTime: "2026-04-26T13:00:00Z", endTime: "2026-04-26T18:00:00Z", status: "UPCOMING" as const, category: "Hospitality",  capacity: 100, order: 2 },
    { id: "z4", title: "Match Screening", description: "Watch live matches on the big screen",           location: "Main Hall", startTime: "2026-04-26T15:30:00Z", endTime: "2026-04-26T18:00:00Z", status: "UPCOMING" as const, category: "Screening",    capacity: 200, order: 3 },
  ];

  for (const z of zones) {
    await prisma.zoneSchedule.upsert({
      where: { id: z.id },
      update: {},
      create: { ...z, startTime: new Date(z.startTime), endTime: new Date(z.endTime) },
    });
  }
  console.log("  ✓ Zone Schedule");

  // ── Prizes ──
  const prizes = [
    { id: "p1", title: "Trip to London",              description: "An all-expenses-paid trip for the winning team to London, England",  tier: "GRAND",     value: "Trip to London",      order: 0 },
    { id: "p2", title: "Emirates Stadium Experience",  description: "Exclusive behind-the-scenes access to the Emirates Stadium",         tier: "GRAND",     value: "Stadium Tour",        order: 1 },
    { id: "p3", title: "TCL Premium Kit",              description: "Full team kit and TCL premium electronics package",                  tier: "GRAND",     value: "Electronics Package", order: 2 },
    { id: "p4", title: "Champions Trophy",             description: "The official TCL × Arsenal Road to Greatness trophy",                tier: "GRAND",     value: "Trophy",              order: 3 },
    { id: "p5", title: "Runner-Up Package",            description: "TCL electronics and Arsenal merchandise",                            tier: "RUNNER_UP", value: "Electronics + Merch", order: 4 },
    { id: "p6", title: "MVP Award",                    description: "Special recognition for the tournament's most valuable player",      tier: "MVP",       value: "Individual Award",    order: 5 },
  ];

  for (const p of prizes) {
    await prisma.prizePackage.upsert({ where: { id: p.id }, update: {}, create: p });
  }
  console.log("  ✓ Prizes");

  // ── Highlights ──
  const highlights = [
    { id: "h1", title: "Desert Hawks Opening Goal",       description: "Stunning volley to open the tournament",      mediaUrl: "", mediaType: "video", matchId: "m1", category: "Goals",        order: 0, publishedAt: new Date("2026-03-25T16:15:00Z") },
    { id: "h2", title: "Incredible Save by Gulf United GK", description: "Point-blank save keeps the score close",    mediaUrl: "", mediaType: "video", matchId: "m1", category: "Saves",        order: 1, publishedAt: new Date("2026-03-25T16:30:00Z") },
    { id: "h3", title: "Falcon FC Celebration",            description: "Team celebration after equalizer",            mediaUrl: "", mediaType: "video", matchId: "m2", category: "Celebrations", order: 2, publishedAt: new Date("2026-03-25T16:40:00Z") },
    { id: "h4", title: "Sand Vipers Winner",               description: "Last-minute winner sends fans wild",          mediaUrl: "", mediaType: "video", matchId: "m3", category: "Goals",        order: 3, publishedAt: new Date("2026-03-25T17:40:00Z") },
    { id: "h5", title: "Opening Ceremony",                 description: "The Road to Greatness begins",                mediaUrl: "", mediaType: "video", matchId: null, category: "Event",        order: 4, publishedAt: new Date("2026-03-25T15:30:00Z") },
    { id: "h6", title: "Best Moments Day 1",               description: "Recap of all the action from Day 1",          mediaUrl: "", mediaType: "video", matchId: null, category: "Recap",        order: 5, publishedAt: new Date("2026-03-25T22:00:00Z") },
  ];

  for (const h of highlights) {
    await prisma.highlight.upsert({ where: { id: h.id }, update: {}, create: h });
  }
  console.log("  ✓ Highlights");

  // ── FAQ ──
  const faq = [
    { id: "f1", question: "What is TCL × Arsenal Road to Greatness?", answer: "TCL × Arsenal Road to Greatness is a premium football tournament bringing together 16 of the best grassroots teams for two days of elite competition, culminating in a trip to London and the Emirates Stadium for the champions.", category: "General", order: 0 },
    { id: "f2", question: "When and where is the event?", answer: "Event dates and venue details will be announced soon. Follow the app notifications to be the first to know.", category: "General", order: 1 },
    { id: "f3", question: "How do I register my team?", answer: "Team captains can apply through the app by tapping 'Apply as Captain' on the home page. Fill out the application form with your team details and you'll be notified about your selection status.", category: "Registration", order: 2 },
    { id: "f4", question: "How many players per team?", answer: "Each team should have a squad of 7-10 players. The minimum required to play is 5 players per match.", category: "Registration", order: 3 },
    { id: "f5", question: "What is the selection process?", answer: "Applications are reviewed by the tournament committee. Teams are selected based on their application quality, team composition, and community representation. You'll receive status updates through the app.", category: "Registration", order: 4 },
    { id: "f6", question: "What should I bring on match day?", answer: "Bring your team kit, football boots, shin guards, water, and a positive attitude. Team captains should ensure all squad members have completed their roster and agreement requirements in the app.", category: "Match Day", order: 5 },
    { id: "f7", question: "What time should I arrive?", answer: "Teams should arrive at least 45 minutes before their first scheduled match. Check your match schedule in the app for exact timings.", category: "Match Day", order: 6 },
    { id: "f8", question: "What is the Indoor Zone?", answer: "The Indoor Zone is an activation area that opens from the quarterfinal stage onward. It features gaming stations, photo opportunities, refreshments, and the match screening area.", category: "Indoor Zone", order: 7 },
    { id: "f9", question: "When does match screening start?", answer: "Match screening in the Indoor Zone begins at 7:30 PM during the knockout stage. Check the Zone page in the app for live status updates.", category: "Indoor Zone", order: 8 },
  ];

  for (const f of faq) {
    await prisma.faqItem.upsert({ where: { id: f.id }, update: {}, create: f });
  }
  console.log("  ✓ FAQ");

  // ── Hero Slides ──
  const heroSlides = [
    {
      id: "hs1",
      backgroundUrl: "",
      tag: "TCL × ARSENAL",
      title1: "Road to",
      title2: "Greatness",
      description: "16 teams. 2 days. 1 dream. The ultimate grassroots football tournament.",
      ctaText: "Apply as Captain",
      ctaHref: "/apply",
      cta2Text: "Learn More",
      cta2Href: "/faq",
      accent: "tcl-red",
      order: 0,
      isActive: true,
    },
    {
      id: "hs2",
      backgroundUrl: "",
      tag: "PRIZES",
      title1: "Win a Trip",
      title2: "to London",
      description: "Champions fly to London for the ultimate Emirates Stadium experience.",
      ctaText: "View Prizes",
      ctaHref: "/prizes",
      accent: "arsenal-gold",
      order: 1,
      isActive: true,
    },
  ];

  for (const hs of heroSlides) {
    await prisma.heroSlide.upsert({ where: { id: hs.id }, update: {}, create: hs });
  }
  console.log("  ✓ Hero Slides");

  // ── Notification Templates ──
  const templates = [
    { id: "nt1", key: "match_starting",  title: "Match Starting Soon",  body: "{{homeTeam}} vs {{awayTeam}} kicks off in 30 minutes on {{pitch}}", category: "match" },
    { id: "nt2", key: "match_goal",      title: "Goal! {{team}} {{score}}", body: "{{team}} score in the {{minute}}th minute", category: "match" },
    { id: "nt3", key: "match_fulltime",  title: "Full Time: {{homeTeam}} {{homeGoals}}-{{awayGoals}} {{awayTeam}}", body: "{{summary}}", category: "match" },
    { id: "nt4", key: "zone_opening",    title: "{{zone}} Opens Soon",  body: "{{zone}} opens at {{time}} with {{activities}}", category: "zone" },
    { id: "nt5", key: "highlights_ready", title: "Highlights Available", body: "{{title}} highlights are now available. Relive the best moments!", category: "general" },
    { id: "nt6", key: "app_status_update", title: "Application Update", body: "Your application for {{teamName}} has been updated to: {{status}}", category: "application" },
  ];

  for (const t of templates) {
    await prisma.notificationTemplate.upsert({ where: { id: t.id }, update: {}, create: t });
  }
  console.log("  ✓ Notification Templates");

  // ── Admin User (SUPER_ADMIN) ──
  const adminUser = await prisma.user.upsert({
    where: { phone: "+971500000000" },
    update: {},
    create: {
      id: "admin1",
      phone: "+971500000000",
      name: "TCL Admin",
      email: "admin@tcl-rtg.com",
      role: "SUPER_ADMIN",
      isVerified: true,
    },
  });
  console.log("  ✓ Admin User (phone: +971500000000)");

  // ── Site Content (key-value) ──
  const siteContent = [
    { key: "splash_title_1", value: "TCL × Arsenal", type: "text" },
    { key: "splash_title_2", value: "Road to Greatness", type: "text" },
    { key: "splash_subtitle", value: "Inspire Greatness", type: "text" },
    { key: "splash_footer", value: "Powered by TCL Mini LED", type: "text" },
    { key: "campaign_tagline", value: "Inspire It. Dream It. Do It.", type: "text" },
    { key: "campaign_description", value: "16 teams. 2 days. 1 dream. The ultimate grassroots football tournament.", type: "text" },
  ];

  for (const sc of siteContent) {
    await prisma.siteContent.upsert({
      where: { key: sc.key },
      update: {},
      create: sc,
    });
  }
  console.log("  ✓ Site Content");

  console.log("\n✅ Database seeded successfully!");
  console.log(`   Admin login: +971500000000`);
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => {
    console.error("❌ Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
