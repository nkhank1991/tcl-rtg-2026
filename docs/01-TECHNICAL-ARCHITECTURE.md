# Technical Architecture Document

## TCL x Arsenal Road to Greatness 2026

**Version:** 1.0
**Date:** 2026-03-26
**Classification:** Internal -- Senior Engineering Audience
**Application:** `tcl-app`
**Repository Root:** `tcl-app/`

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Technology Stack](#2-technology-stack)
3. [Application Architecture](#3-application-architecture)
4. [Authentication Flow](#4-authentication-flow)
5. [Database Architecture](#5-database-architecture)
6. [Frontend Architecture](#6-frontend-architecture)
7. [Deployment Architecture](#7-deployment-architecture)
8. [Security](#8-security)
9. [File Structure](#9-file-structure)

---

## 1. System Overview

### 1.1 High-Level Architecture

```
+-----------------------------------------------------------------------------------+
|                                   CLIENT LAYER                                     |
|  +---------------------------+  +---------------------------+  +--------------+    |
|  |  Mobile PWA (primary)     |  |  Desktop Browser          |  |  Admin SPA   |    |
|  |  standalone / portrait    |  |  responsive breakpoints   |  |  /admin/*    |    |
|  |  service worker (sw.js)   |  |  same bundle              |  |  sidebar UI  |    |
|  +-------------+-------------+  +-------------+-------------+  +------+-------+    |
+-----------------|-------------------------------|------------------------|---------+
                  |                               |                        |
                  +-------------------------------+------------------------+
                                                  |
                                        HTTPS / Vercel Edge
                                                  |
+-----------------------------------------------------------------------------------+
|                               VERCEL PLATFORM                                      |
|                                                                                    |
|  +---------------------+    +--------------------+    +-----------------------+    |
|  |  Next.js 16 App     |    |  Serverless Fns    |    |  Vercel Edge Network  |    |
|  |  Router (RSC + CSR) |    |  /api/*            |    |  CDN / Static Assets  |    |
|  |  Turbopack (dev)    |--->|  /api/admin/*      |    |  Image Optimization   |    |
|  +---------------------+    +--------+-----------+    +-----------------------+    |
|                                      |                                             |
+--------------------------------------|---------------------------------------------+
                                       |
                          +------------+------------+
                          |                         |
               +----------v----------+   +----------v----------+
               |  Neon PostgreSQL    |   |  Cloudinary         |
               |  (Serverless)      |   |  Media Storage      |
               |  Connection Pooler |   |  Image/Video CDN    |
               |  Region: bom1      |   |  Transformations    |
               +--------------------+   +---------------------+
```

### 1.2 Design Philosophy

| Principle | Implementation |
|---|---|
| **Mobile-first PWA** | `standalone` display mode, portrait orientation lock, `safe-area-inset` padding, bottom navigation bar, touch-optimized 44px tap targets |
| **Dark theme by default** | `<html class="dark">`, CSS custom properties for all colors, `#08080D` base background, glassmorphism surfaces |
| **Cinematic sports aesthetic** | Animated gradients, glow effects, shimmer text, noise textures, staggered entrance animations |
| **Real-time tournament data** | TanStack Query with 30s `staleTime`, network-first service worker for API calls, live match status polling |
| **Offline resilience** | Service worker caches app shell (8 routes), cache-first for static assets, fallback `offline.html` page |
| **Role-based progressive disclosure** | Public fan view, captain team management, admin tournament control -- each with distinct route groups and API guards |

### 1.3 Tournament Parameters

| Parameter | Value |
|---|---|
| Total Teams | 16 |
| Groups | 4 (4 teams per group) |
| Total Matches | 31 |
| Pitches | 4 (concurrent) |
| Event Days | 2 |
| Match Stages | GROUP, QUARTER_FINAL, SEMI_FINAL, THIRD_PLACE, FINAL |

---

## 2. Technology Stack

### 2.1 Core Dependencies

| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | `16.2.1` | Full-stack React framework (App Router, Turbopack, Server Components) |
| **React** | `19.2.4` | UI library (concurrent features, `use()` hook, server components) |
| **React DOM** | `19.2.4` | DOM renderer |
| **TypeScript** | `^5` | Static typing across the entire codebase |

### 2.2 Database & ORM

| Technology | Version | Purpose |
|---|---|---|
| **Prisma** | `7.5.0` | ORM with schema-first modeling and type-safe queries |
| **@prisma/client** | `^7.5.0` | Generated query client |
| **@prisma/adapter-pg** | `^7.5.0` | `PrismaPg` driver adapter for direct `pg` connection (Prisma 7 breaking change: replaces `@prisma/adapter-neon`) |
| **pg** | `^8.20.0` | PostgreSQL client (used by the adapter) |
| **PostgreSQL** | Neon Serverless | Managed serverless PostgreSQL with connection pooler |

> **Breaking Change (Prisma 7):** Prisma 7 requires the `adapter` pattern. The `PrismaClient` is instantiated with `new PrismaClient({ adapter })` where `adapter` is a `PrismaPg` instance wrapping the `DATABASE_URL`. The older `datasources.db.url` pattern no longer works for driver adapters.

### 2.3 Data Fetching & State

| Technology | Version | Purpose |
|---|---|---|
| **@tanstack/react-query** | `^5.95.2` | Server state management, caching, background refetching |
| **Zod** | `^4.3.6` | Runtime schema validation for API inputs (v4 -- new API surface) |

### 2.4 Authentication

| Technology | Version | Purpose |
|---|---|---|
| **jose** | `^6.2.2` | JWT signing/verification (HS256), edge-compatible (no Node.js `crypto` dependency) |

### 2.5 UI & Styling

| Technology | Version | Purpose |
|---|---|---|
| **Tailwind CSS** | `^4` | Utility-first CSS framework (v4: `@theme inline` block, no `tailwind.config.ts`) |
| **@tailwindcss/postcss** | `^4` | PostCSS plugin for Tailwind v4 |
| **clsx** | `^2.1.1` | Conditional class string construction |
| **tailwind-merge** | `^3.5.0` | Intelligent Tailwind class merging (deduplication) |
| **Radix UI** | Various | Accessible headless primitives |
| **lucide-react** | `^1.7.0` | Icon library (tree-shakeable SVG icons) |
| **next-cloudinary** | `^6.17.5` | Cloudinary image/video upload and transformation components |

### 2.6 Radix UI Primitives (Complete List)

| Package | Version | Used For |
|---|---|---|
| `@radix-ui/react-accordion` | `^1.2.12` | FAQ expandable items |
| `@radix-ui/react-avatar` | `^1.1.11` | User/team avatar with fallback |
| `@radix-ui/react-checkbox` | `^1.3.3` | Form checkboxes (agreements, filters) |
| `@radix-ui/react-dialog` | `^1.1.15` | Modal dialogs (admin forms, confirmations) |
| `@radix-ui/react-select` | `^2.2.6` | Dropdown selects (filters, status changes) |
| `@radix-ui/react-slot` | `^1.2.4` | Polymorphic component composition (`asChild`) |
| `@radix-ui/react-switch` | `^1.2.6` | Toggle switches (notification preferences) |
| `@radix-ui/react-tabs` | `^1.1.13` | Tab navigation (match stages, team views) |
| `@radix-ui/react-toast` | `^1.2.15` | Toast notifications (success/error feedback) |

### 2.7 Build & Dev Tools

| Technology | Version | Purpose |
|---|---|---|
| **ESLint** | `^9` | Linting (flat config via `eslint.config.mjs`) |
| **eslint-config-next** | `16.2.1` | Next.js-specific lint rules |
| **Turbopack** | Bundled with Next.js 16 | Dev server bundler (replaces Webpack in dev) |

---

## 3. Application Architecture

### 3.1 Route Group Topology

The application uses Next.js App Router with nested route groups to separate concerns without affecting URL paths:

```
src/app/
 |
 +-- layout.tsx                   # Root layout (fonts, providers, <html>)
 +-- globals.css                  # Tailwind + design tokens + animations
 |
 +-- (site)/                      # PUBLIC-FACING ROUTE GROUP
 |    +-- layout.tsx              #   -> Header + BottomNav + SplashScreen
 |    +-- page.tsx                #   -> / (homepage)
 |    +-- loading.tsx             #   -> Global loading state
 |    +-- not-found.tsx           #   -> 404 page
 |    +-- fan-interest/page.tsx   #   -> /fan-interest
 |    +-- register/               #   -> /register (own layout)
 |    |    +-- layout.tsx
 |    |    +-- page.tsx
 |    |
 |    +-- (public)/               #   NESTED: unauthenticated pages
 |    |    +-- faq/page.tsx       #     -> /faq
 |    |    +-- highlights/page.tsx#     -> /highlights
 |    |    +-- matches/           #     -> /matches, /matches/[matchId]
 |    |    +-- notifications/     #     -> /notifications
 |    |    +-- prize/page.tsx     #     -> /prize
 |    |    +-- standings/page.tsx #     -> /standings
 |    |    +-- teams/             #     -> /teams, /teams/[teamId]
 |    |    +-- zone/page.tsx      #     -> /zone
 |    |
 |    +-- (auth)/                 #   NESTED: authentication pages
 |    |    +-- login/page.tsx     #     -> /login
 |    |
 |    +-- (captain)/              #   NESTED: captain-only pages
 |         +-- layout.tsx         #     -> Captain guard layout
 |         +-- apply/page.tsx     #     -> /apply
 |         +-- status/page.tsx    #     -> /status
 |         +-- my-team/           #     -> /my-team, /my-team/roster,
 |              +-- page.tsx      #        /my-team/kit-sizes,
 |              +-- roster/       #        /my-team/agreements
 |              +-- kit-sizes/
 |              +-- agreements/
 |
 +-- (admin)/                     # ADMIN PORTAL ROUTE GROUP
 |    +-- admin/
 |         +-- layout.tsx         #   -> AdminAuthGuard + Sidebar + Topbar
 |         +-- page.tsx           #   -> /admin (dashboard)
 |         +-- applications/      #   -> /admin/applications
 |         +-- campaign/          #   -> /admin/campaign
 |         +-- content/           #   -> /admin/content
 |         +-- faq/               #   -> /admin/faq
 |         +-- hero-slides/       #   -> /admin/hero-slides
 |         +-- highlights/        #   -> /admin/highlights
 |         +-- matches/           #   -> /admin/matches, /admin/matches/[matchId]
 |         +-- notifications/     #   -> /admin/notifications
 |         +-- prizes/            #   -> /admin/prizes
 |         +-- standings/         #   -> /admin/standings
 |         +-- teams/             #   -> /admin/teams, /admin/teams/[teamId]
 |         +-- users/             #   -> /admin/users
 |         +-- zone/              #   -> /admin/zone
 |
 +-- api/                         # API ROUTES
      +-- auth/                   #   Authentication endpoints
      |    +-- otp/start/route.ts #     POST /api/auth/otp/start
      |    +-- otp/verify/route.ts#     POST /api/auth/otp/verify
      |    +-- me/route.ts        #     GET  /api/auth/me
      |    +-- logout/route.ts    #     POST /api/auth/logout
      |
      +-- bracket/route.ts        #   GET /api/bracket
      +-- campaign/route.ts       #   GET /api/campaign
      +-- faq/route.ts            #   GET /api/faq
      +-- highlights/route.ts     #   GET /api/highlights
      +-- matches/route.ts        #   GET /api/matches
      +-- matches/[matchId]/      #   GET /api/matches/:matchId
      +-- notifications/route.ts  #   GET /api/notifications
      +-- prize/route.ts          #   GET /api/prize
      +-- standings/route.ts      #   GET /api/standings
      +-- teams/route.ts          #   GET /api/teams
      +-- teams/[teamId]/         #   GET /api/teams/:teamId
      +-- zone/route.ts           #   GET /api/zone
      |
      +-- admin/                  #   ADMIN API ROUTES (all require ADMIN+ role)
           +-- applications/      #     GET/PATCH applications, [id] status
           +-- campaign/          #     GET/PATCH campaign state
           +-- content/           #     GET/PUT site content KV
           +-- faq/               #     CRUD + reorder
           +-- hero-slides/       #     CRUD + reorder
           +-- highlights/        #     CRUD
           +-- matches/           #     CRUD + [matchId]/events
           +-- notifications/     #     send/ + templates/
           +-- prizes/            #     CRUD
           +-- standings/         #     GET + recalculate/
           +-- stats/             #     GET dashboard stats
           +-- teams/             #     CRUD + [teamId]/players/
           +-- users/             #     GET/PATCH + [id] role
           +-- zone/              #     CRUD
```

### 3.2 Middleware

The middleware (`src/middleware.ts`) intercepts requests matching `/admin/:path*` and enforces authentication:

```typescript
// Middleware decision flow:
// 1. Extract JWT from cookie "tcl-session" or Authorization header
// 2. If no token -> redirect to /login
// 3. Verify JWT with jose (HS256)
// 4. If invalid or role not in [ADMIN, SUPER_ADMIN] -> redirect to /login
// 5. Otherwise -> NextResponse.next()
```

The matcher is configured as:
```typescript
export const config = {
  matcher: ["/admin/:path*"],
};
```

API routes under `/api/admin/*` are **not** covered by the middleware. They enforce authorization independently using the `requireRole()` helper within each route handler.

### 3.3 Layout Nesting

```
RootLayout (fonts, QueryProvider, AuthProvider)
  |
  +-- (site)/layout.tsx ............. SplashScreen + Header + BottomNav
  |     +-- (public)/ .............. No additional layout (inherits site)
  |     +-- (auth)/ ................ No additional layout (inherits site)
  |     +-- (captain)/layout.tsx ... Captain auth guard wrapper
  |     +-- register/layout.tsx .... Standalone register layout
  |
  +-- (admin)/admin/layout.tsx ..... AdminAuthGuard + Sidebar + Topbar
```

---

## 4. Authentication Flow

### 4.1 OTP-Based Phone Authentication

The application uses a passwordless, OTP-based authentication flow with phone numbers as the primary identity:

```
          User                    Client                  Server                    DB
           |                        |                       |                        |
           |  Enter phone number    |                       |                        |
           |----------------------->|                       |                        |
           |                        |  POST /api/auth/otp/start                     |
           |                        |  { phone }            |                        |
           |                        |---------------------->|                        |
           |                        |                       |  Find user by phone    |
           |                        |                       |----------------------->|
           |                        |                       |  Generate 6-digit OTP  |
           |                        |                       |  Store OtpCode record  |
           |                        |                       |  (expires: 5 minutes)  |
           |                        |                       |----------------------->|
           |                        |  { success, devCode } |                        |
           |                        |<----------------------|                        |
           |  Enter OTP code        |                       |                        |
           |----------------------->|                       |                        |
           |                        |  POST /api/auth/otp/verify                    |
           |                        |  { phone, code }      |                        |
           |                        |---------------------->|                        |
           |                        |                       |  Lookup OtpCode where  |
           |                        |                       |  phone+code+!verified  |
           |                        |                       |  +expiresAt > now()    |
           |                        |                       |----------------------->|
           |                        |                       |  Mark OTP verified     |
           |                        |                       |  Find or create User   |
           |                        |                       |  Set isVerified=true   |
           |                        |                       |----------------------->|
           |                        |                       |  Sign JWT (HS256, 7d)  |
           |                        |  Set-Cookie: tcl-session=<jwt>                |
           |                        |  { success, user }    |                        |
           |                        |<----------------------|                        |
           |  Redirected to app     |                       |                        |
           |<-----------------------|                       |                        |
```

### 4.2 JWT Structure

**Algorithm:** HS256
**Expiration:** 7 days
**Library:** `jose` (edge-compatible, no Node.js `crypto` dependency)

```typescript
// JWT Payload (Session type)
{
  userId: string;    // Prisma CUID
  phone:  string;    // E.164 format
  role:   UserRole;  // "FAN" | "CAPTAIN" | "ADMIN" | "SUPER_ADMIN"
  iat:    number;    // Issued at (auto-set by jose)
  exp:    number;    // Expiration (auto-set to iat + 7d)
}
```

### 4.3 Session Cookie

| Property | Value |
|---|---|
| Name | `tcl-session` |
| HttpOnly | `true` |
| Secure | Implied in production (HTTPS) |
| SameSite | `Lax` |
| Path | `/` |
| Max-Age | `604800` (7 days) |

### 4.4 Role Hierarchy

```
SUPER_ADMIN (3)   -- Full system access, user role management
      |
    ADMIN (2)     -- Tournament management, content CMS, match scoring
      |
   CAPTAIN (1)    -- Team management, roster, kit sizes, agreements
      |
     FAN (0)      -- Public browsing, notifications, favorites
```

The `requireRole()` helper uses numeric comparison, so requesting `ADMIN` also allows `SUPER_ADMIN`:

```typescript
export async function requireRole(request: NextRequest, role: UserRole): Promise<Session> {
  const session = await requireAuth(request);
  const roleHierarchy: Record<UserRole, number> = {
    FAN: 0, CAPTAIN: 1, ADMIN: 2, SUPER_ADMIN: 3,
  };
  if (roleHierarchy[session.role] < roleHierarchy[role]) {
    throw new Error("Forbidden");
  }
  return session;
}
```

### 4.5 Development Bypass

The OTP verification endpoint accepts `"123456"` as a universal bypass code:

```typescript
// In /api/auth/otp/verify
if (!otpRecord && code !== "123456") {
  return NextResponse.json({ ... }, { status: 401 });
}
```

> **Security note:** The `devCode` field is also returned in the `/api/auth/otp/start` response. Both of these must be removed or gated behind `NODE_ENV` checks before production deployment.

### 4.6 Client-Side Auth State

The `AuthProvider` (React Context) manages client-side auth state:

1. On mount, calls `GET /api/auth/me` to hydrate user from cookie
2. Exposes `login(phone, code)` which calls `/api/auth/otp/verify` then refreshes
3. Exposes `logout()` which calls `POST /api/auth/logout` (clears cookie)
4. Components access auth state via the `useAuth()` hook

---

## 5. Database Architecture

### 5.1 Connection Architecture

```typescript
// src/lib/prisma.ts
import { PrismaPg } from "@prisma/adapter-pg";

function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  return new PrismaClient({ adapter });
}

// Singleton pattern: cached on globalThis in development to survive HMR
export const prisma = globalForPrisma.prisma ?? createPrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

The `DATABASE_URL` points to a Neon connection pooler endpoint, enabling serverless-friendly connection reuse.

### 5.2 Prisma Configuration

```typescript
// prisma.config.ts (Prisma 7 new convention)
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations", seed: "npx tsx prisma/seed.ts" },
  datasource: { url: env("DATABASE_URL") },
});
```

### 5.3 Complete Model Reference

The schema contains **27 models** and **6 enums**. Below is the full entity catalog.

#### Enums

| Enum | Values |
|---|---|
| `CampaignState` | `PRE_LAUNCH`, `LAUNCH`, `SCREENING`, `LIVE`, `POST_EVENT` |
| `MatchStage` | `GROUP`, `QUARTER_FINAL`, `SEMI_FINAL`, `THIRD_PLACE`, `FINAL` |
| `MatchStatus` | `SCHEDULED`, `LIVE_FIRST_HALF`, `HALF_TIME`, `LIVE_SECOND_HALF`, `FULL_TIME`, `PENALTIES`, `COMPLETED`, `POSTPONED`, `CANCELLED` |
| `ZoneStatus` | `UPCOMING`, `ACTIVE`, `PAUSED`, `COMPLETED` |
| `UserRole` | `FAN`, `CAPTAIN`, `ADMIN`, `SUPER_ADMIN` |
| `ApplicationStatus` | `SUBMITTED`, `UNDER_REVIEW`, `SHORTLISTED`, `RESERVE`, `CONFIRMED`, `NOT_SELECTED` |

#### Campaign & Event Domain

| Model | Key Fields | Relationships |
|---|---|---|
| **Campaign** | `id`, `slug` (unique), `title`, `tagline`, `state` (CampaignState), `heroImageUrl`, `startDate`, `endDate`, `config` (JSON) | `eventDays` -> EventDay[] |
| **EventDay** | `id`, `campaignId`, `dayNumber`, `date`, `label` | `campaign` -> Campaign, `matches` -> Match[] |
| **Venue** | `id`, `name`, `address`, `mapUrl` | `pitches` -> Pitch[] |
| **Pitch** | `id`, `venueId`, `name`, `label` | `venue` -> Venue, `matches` -> Match[] |

#### Teams & Players Domain

| Model | Key Fields | Relationships |
|---|---|---|
| **Team** | `id`, `name`, `shortName`, `logoUrl`, `primaryColor`, `groupId`, `captainId` (unique), `seed`, `bio`, `source` | `group` -> Group?, `captain` -> User? (1:1), `players` -> Player[], `homeMatches` -> Match[], `awayMatches` -> Match[], `standings` -> Standing[], `bracketTeams` -> BracketNode[], `bracketWins` -> BracketNode[], `favorites` -> FavoriteTeam[] |
| **Player** | `id`, `teamId`, `name`, `position`, `number`, `photoUrl`, `isCaptain` | `team` -> Team (cascade delete), `rosterEntry` -> RosterMember? (1:1) |

#### Groups & Standings Domain

| Model | Key Fields | Relationships | Indexes |
|---|---|---|---|
| **Group** | `id`, `name`, `order` | `teams` -> Team[], `standings` -> Standing[], `matches` -> Match[] | -- |
| **Standing** | `id`, `groupId`, `teamId`, `played`, `won`, `drawn`, `lost`, `goalsFor`, `goalsAgainst`, `goalDifference`, `points`, `position` | `group` -> Group, `team` -> Team | `@@unique([groupId, teamId])`, `@@index([groupId, position])` |

#### Match Domain

| Model | Key Fields | Relationships | Indexes |
|---|---|---|---|
| **Match** | `id`, `eventDayId`, `groupId`, `pitchId`, `homeTeamId`, `awayTeamId`, `matchNumber`, `stage` (MatchStage), `status` (MatchStatus), `scheduledAt`, `startedAt`, `endedAt` | `eventDay` -> EventDay?, `group` -> Group?, `pitch` -> Pitch?, `homeTeam` -> Team?, `awayTeam` -> Team?, `score` -> Score? (1:1), `events` -> MatchEvent[] | `@@index([status])`, `@@index([stage])`, `@@index([scheduledAt])` |
| **Score** | `id`, `matchId` (unique), `homeGoals`, `awayGoals`, `homePenalties`, `awayPenalties` | `match` -> Match (1:1) | -- |
| **MatchEvent** | `id`, `matchId`, `type`, `minute`, `teamSide`, `playerName`, `detail` | `match` -> Match (cascade delete) | `@@index([matchId, minute])` |

#### Knockout Bracket Domain

| Model | Key Fields | Relationships | Indexes |
|---|---|---|---|
| **BracketNode** | `id`, `stage` (MatchStage), `position`, `teamId`, `winnerId`, `matchId`, `parentNodeId`, `label` | `team` -> Team?, `winner` -> Team? | `@@index([stage, position])` |

#### Zone, Prizes, Highlights, FAQ

| Model | Key Fields | Relationships |
|---|---|---|
| **ZoneSchedule** | `id`, `title`, `description`, `imageUrl`, `location`, `startTime`, `endTime`, `status` (ZoneStatus), `category`, `capacity`, `order` | -- (standalone) |
| **PrizePackage** | `id`, `title`, `description`, `imageUrl`, `value`, `tier`, `order` | -- (standalone) |
| **Highlight** | `id`, `title`, `description`, `mediaUrl`, `mediaType`, `thumbnailUrl`, `matchId`, `category`, `order`, `publishedAt` | -- (standalone, `matchId` is denormalized) |
| **FaqItem** | `id`, `question`, `answer`, `category`, `order` | -- (standalone) |

#### Auth & User Domain

| Model | Key Fields | Relationships |
|---|---|---|
| **User** | `id`, `phone` (unique), `name`, `email`, `avatarUrl`, `role` (UserRole), `isVerified` | `team` -> Team? (1:1 "TeamCaptain"), `captainProfile` -> CaptainProfile? (1:1), `applications` -> Application[], `notifications` -> Notification[], `preferences` -> NotificationPreference[], `favorites` -> FavoriteTeam[], `otpCodes` -> OtpCode[] |
| **OtpCode** | `id`, `userId`, `phone`, `code`, `expiresAt`, `verified`, `attempts` | `user` -> User? | `@@index([phone, code])` |
| **CaptainProfile** | `id`, `userId` (unique), `fullName`, `email`, `teamName`, `area`, `experience`, `source`, `sourceDetail` | `user` -> User (1:1) |

#### Application Flow Domain

| Model | Key Fields | Relationships |
|---|---|---|
| **Application** | `id`, `userId`, `status` (ApplicationStatus), `teamName`, `formData` (JSON), `notes`, `reviewedBy` | `user` -> User, `statusLogs` -> ApplicationStatusLog[] |
| **ApplicationStatusLog** | `id`, `applicationId`, `fromStatus`, `toStatus`, `changedBy`, `reason` | `application` -> Application (cascade delete) |

#### Captain Management Domain

| Model | Key Fields | Relationships |
|---|---|---|
| **RosterMember** | `id`, `playerId` (unique), `teamId`, `name`, `position`, `number`, `kitSize`, `isConfirmed` | `player` -> Player (1:1) |
| **KitSizeSubmission** | `id`, `teamId`, `submittedBy`, `sizes` (JSON), `isComplete` | -- (standalone) |
| **AgreementStatus** | `id`, `userId`, `agreementType`, `accepted`, `acceptedAt`, `ipAddress` | -- (standalone) |

#### Notifications Domain

| Model | Key Fields | Relationships | Indexes |
|---|---|---|---|
| **NotificationTemplate** | `id`, `key` (unique), `title`, `body`, `category` | -- (standalone) | -- |
| **Notification** | `id`, `userId`, `title`, `body`, `category`, `data` (JSON), `isRead` | `user` -> User (cascade delete) | `@@index([userId, isRead])`, `@@index([userId, createdAt])` |
| **NotificationPreference** | `id`, `userId`, `category`, `enabled` | `user` -> User (cascade delete) | `@@unique([userId, category])` |
| **FavoriteTeam** | `id`, `userId`, `teamId` | `user` -> User (cascade delete), `team` -> Team (cascade delete) | `@@unique([userId, teamId])` |

#### CMS Domain

| Model | Key Fields | Relationships |
|---|---|---|
| **HeroSlide** | `id`, `backgroundUrl`, `tag`, `title1`, `title2`, `description`, `ctaText`, `ctaHref`, `cta2Text`, `cta2Href`, `accent`, `order`, `isActive` | -- (standalone) |
| **SiteContent** | `id`, `key` (unique), `value`, `type` | -- (standalone, key-value store) |

### 5.4 Entity Relationship Diagram

```
Campaign 1---* EventDay 1---* Match
                                |
Venue 1---* Pitch 1---* --------+
                                |
Group 1---* Team *---1 User (captain)
  |           |          |
  |           +---* Player ---1? RosterMember
  |           |
  +---* Standing (unique: groupId+teamId)
  |
  +---* Match ---1? Score
            |
            +---* MatchEvent

BracketNode *---? Team (team)
BracketNode *---? Team (winner)

User 1---? CaptainProfile
User 1---* Application 1---* ApplicationStatusLog
User 1---* OtpCode
User 1---* Notification
User 1---* NotificationPreference (unique: userId+category)
User 1---* FavoriteTeam *---1 Team (unique: userId+teamId)

KitSizeSubmission (standalone, linked by teamId)
AgreementStatus   (standalone, linked by userId)
HeroSlide         (standalone CMS)
SiteContent       (standalone key-value CMS)
ZoneSchedule      (standalone)
PrizePackage      (standalone)
Highlight         (standalone)
FaqItem           (standalone)
NotificationTemplate (standalone)
```

---

## 6. Frontend Architecture

### 6.1 Component Hierarchy

```
<RootLayout>                              # src/app/layout.tsx
  fonts: Montserrat (display), Inter (body), JetBrains Mono (scores)
  providers: QueryProvider > AuthProvider
  |
  +-- <SiteLayout>                        # src/app/(site)/layout.tsx
  |     +-- <SplashScreen />              #   Animated brand intro
  |     +-- <Header />                    #   Top bar with logo + auth
  |     +-- {children}                    #   Page content
  |     +-- <BottomNav />                 #   Mobile bottom navigation (5 items)
  |     |
  |     +-- Pages use:
  |           +-- <PageContainer />       #   Consistent padding + max-width
  |           +-- <MatchCard />           #   Match result/live card
  |           +-- <MatchFilters />        #   Stage/status filter bar
  |           +-- <HeroSection />         #   Campaign hero carousel
  |           +-- <CountdownTimer />      #   Event countdown
  |           +-- <CtaButtons />          #   Campaign call-to-action
  |           +-- <VideoSection />        #   Embedded video player
  |           +-- <SocialShare />         #   Social sharing buttons
  |           +-- <EmptyState />          #   Empty data placeholder
  |           +-- <SocialShareButton />   #   Individual share button
  |
  +-- <AdminLayout>                       # src/app/(admin)/admin/layout.tsx
        +-- <AdminAuthGuard />            #   Client-side role check
        +-- <AdminSidebar />              #   Desktop sidebar navigation
        +-- <AdminTopbar />               #   Top bar with user info
        +-- {children}                    #   Admin page content
        |
        +-- Pages use:
              +-- <AdminPageHeader />     #   Page title + actions
```

### 6.2 UI Component Library

The `src/components/ui/` directory contains shared, design-system-level components built on Radix primitives:

| Component | File | Based On | Purpose |
|---|---|---|---|
| `Accordion` | `accordion.tsx` | `@radix-ui/react-accordion` | Expandable content sections |
| `Badge` | `badge.tsx` | Native `<span>` | Status/category labels |
| `Button` | `button.tsx` | `@radix-ui/react-slot` | Primary action component with variants |
| `Card` | `card.tsx` | Native `<div>` | Content container with glass styling |
| `Input` | `input.tsx` | Native `<input>` | Form text input |
| `Skeleton` | `skeleton.tsx` | Native `<div>` | Loading placeholder |
| `Tabs` | `tabs.tsx` | `@radix-ui/react-tabs` | Tab navigation |

### 6.3 State Management Strategy

| State Category | Solution | Configuration |
|---|---|---|
| **Server state** (matches, teams, standings, etc.) | TanStack Query v5 | `staleTime: 30s`, `refetchOnWindowFocus: false` |
| **Auth state** | React Context (`AuthProvider`) | Hydrated from `/api/auth/me` on mount |
| **UI state** (modals, filters, tabs) | React `useState` / `useReducer` | Component-local, no global store |
| **Form state** | React `useState` | Controlled inputs with Zod validation on submit |

### 6.4 Styling Architecture

#### Tailwind CSS v4 with `@theme inline`

Tailwind CSS v4 uses the new `@theme inline` block in CSS instead of a `tailwind.config.ts` file. All custom design tokens are declared in `src/app/globals.css`:

```css
@import "tailwindcss";

:root {
  --tcl-red: #E4002B;
  --tcl-red-dark: #B80023;
  --tcl-red-light: #FF1A47;
  --arsenal-gold: #EDBB4A;
  --bg-primary: #08080D;
  --bg-surface: #10101A;
  --bg-elevated: #181824;
  --bg-overlay: rgba(8, 8, 13, 0.85);
  --text-primary: #F0F0F4;
  --text-secondary: #9898A6;
  --text-muted: #5C5C6E;
  --text-inverse: #08080D;
  --border-default: #1C1C2A;
  --border-strong: #2C2C3C;
  --success: #10B981;
  --warning: #F59E0B;
  --error: #EF4444;
  --info: #3B82F6;
  --live: #EF4444;
}

@theme inline {
  --color-tcl-red: var(--tcl-red);
  --color-arsenal-gold: var(--arsenal-gold);
  --color-bg-primary: var(--bg-primary);
  /* ... mapped to Tailwind utility classes */
  --font-display: "Montserrat", system-ui, sans-serif;
  --font-body: "Inter", system-ui, sans-serif;
  --font-score: "JetBrains Mono", ui-monospace, monospace;
  --animate-pulse-live: pulse-live 2s ease-in-out infinite;
  --animate-fade-in: fade-in 0.4s ease-out;
  --animate-slide-up: slide-up 0.5s cubic-bezier(0.22, 1, 0.36, 1);
  /* ... more animation tokens */
}
```

This produces utility classes like `bg-tcl-red`, `text-arsenal-gold`, `bg-bg-primary`, `font-display`, `animate-pulse-live`, etc.

#### Design Token Color Palette

| Token | Hex | Usage |
|---|---|---|
| `tcl-red` | `#E4002B` | Primary brand color, CTAs, live indicators |
| `tcl-red-dark` | `#B80023` | Hover states, active states |
| `tcl-red-light` | `#FF1A47` | Accent highlights |
| `arsenal-gold` | `#EDBB4A` | Secondary brand, premium indicators |
| `bg-primary` | `#08080D` | Page background |
| `bg-surface` | `#10101A` | Card backgrounds |
| `bg-elevated` | `#181824` | Elevated surfaces (modals, dropdowns) |
| `bg-overlay` | `rgba(8,8,13,0.85)` | Modal overlays |
| `text-primary` | `#F0F0F4` | Primary text |
| `text-secondary` | `#9898A6` | Secondary text |
| `text-muted` | `#5C5C6E` | Disabled/tertiary text |
| `border-default` | `#1C1C2A` | Standard borders |
| `border-strong` | `#2C2C3C` | Emphasized borders |
| `success` | `#10B981` | Success states |
| `warning` | `#F59E0B` | Warning states |
| `error` | `#EF4444` | Error states |
| `info` | `#3B82F6` | Info states |
| `live` | `#EF4444` | Live match indicator |

#### Typography Scale

| Font Variable | Font Family | Usage |
|---|---|---|
| `--font-display` | Montserrat | Headings, hero text, section titles |
| `--font-body` | Inter | Body text, UI labels, form inputs |
| `--font-score` | JetBrains Mono | Match scores, countdown timers, stats |

#### Custom CSS Effects

The stylesheet includes a rich set of hand-crafted visual effects:

| Category | Classes |
|---|---|
| **Glassmorphism** | `.glass`, `.glass-strong`, `.glass-card`, `.glass-accent-red`, `.glass-accent-gold`, `.glass-accent-blue`, `.glass-accent-green`, `.glass-accent-amber`, `.glass-accent-purple` |
| **Gradient borders** | `.gradient-border` (pseudo-element with mask-composite) |
| **Glow effects** | `.glow-red`, `.glow-red-strong`, `.text-glow`, `.text-glow-gold` |
| **Animated text** | `.shimmer-text`, `.gradient-text-red`, `.gradient-text-gold`, `.text-reveal` |
| **Card styles** | `.visual-card`, `.card-cinematic` |
| **Overlays** | `.img-card-overlay`, `.img-card-overlay-top`, `.video-overlay`, `.hero-gradient` |
| **Decorative orbs** | `.orb`, `.orb-red`, `.orb-gold`, `.orb-blue` |
| **Layout utilities** | `.pb-safe`, `.scrollbar-hide`, `.section-line`, `.noise` |
| **Motion** | `.stagger-children` (cascade delay on children), `.marquee-track` |

### 6.5 PWA Configuration

#### Web App Manifest (`public/manifest.json`)

```json
{
  "name": "TCL x Arsenal Road to Greatness 2026",
  "short_name": "Road to Greatness",
  "display": "standalone",
  "orientation": "portrait",
  "theme_color": "#E4002B",
  "background_color": "#0A0A0F",
  "start_url": "/",
  "icons": [
    { "src": "/icons/icon-192.png",  "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png",  "sizes": "512x512", "type": "image/png" },
    { "src": "/icons/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

#### Service Worker (`public/sw.js`)

| Strategy | Applied To | Behavior |
|---|---|---|
| **Cache-first** | Static assets (images, CSS, JS, fonts) | Serve from cache, fetch in background if miss |
| **Network-first** | API routes (`/api/*`) | Fetch from network, cache response, serve cache on failure |
| **Network-first + offline fallback** | Navigation (HTML pages) | Fetch from network, cache, fall back to cached page or `/offline.html` |

App shell URLs pre-cached on install:

```
/, /matches, /standings, /teams, /faq, /highlights, /prize, /zone, /offline.html
```

#### Apple Web App Support

```html
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Road to Greatness">
```

### 6.6 Font Loading

Fonts are loaded via `next/font/google` with CSS variable injection:

```typescript
const montserrat = Montserrat({ variable: "--font-display", subsets: ["latin"], display: "swap" });
const inter = Inter({ variable: "--font-body", subsets: ["latin"], display: "swap" });
const jetbrainsMono = JetBrains_Mono({ variable: "--font-score", subsets: ["latin"], display: "swap" });
```

Applied to `<html>` element: `className={`${montserrat.variable} ${inter.variable} ${jetbrainsMono.variable} dark`}`

---

## 7. Deployment Architecture

### 7.1 Platform Configuration

```
+------------------+         +-------------------------+
|  GitHub Repo     |  push   |  Vercel                 |
|  main branch     |-------->|  Auto-deploy            |
+------------------+         |  Region: bom1 (Mumbai)  |
                             |  Framework: Next.js     |
                             +------------+------------+
                                          |
                         +----------------+----------------+
                         |                                 |
              +----------v----------+         +------------v-----------+
              |  Vercel Functions   |         |  Vercel Edge Network   |
              |  (Node.js runtime)  |         |  Static assets / CDN   |
              |  /api/* handlers    |         |  Image optimization    |
              +----------+----------+         +------------------------+
                         |
              +----------v----------+
              |  Neon PostgreSQL    |
              |  Serverless         |
              |  Region: matched    |
              +---------------------+
```

### 7.2 Build Configuration

**`vercel.json`:**

```json
{
  "buildCommand": "npx prisma generate && next build",
  "framework": "nextjs",
  "regions": ["bom1"],
  "headers": [
    {
      "source": "/sw.js",
      "headers": [
        { "key": "Cache-Control", "value": "no-cache" },
        { "key": "Service-Worker-Allowed", "value": "/" }
      ]
    },
    {
      "source": "/manifest.json",
      "headers": [
        { "key": "Content-Type", "value": "application/manifest+json" }
      ]
    }
  ]
}
```

Key details:
- `npx prisma generate` runs before `next build` to generate the Prisma client
- Deployed to **bom1** (Mumbai, India) region for proximity to primary user base
- Service worker served with `no-cache` to ensure immediate updates
- Manifest served with correct MIME type for PWA installability

### 7.3 Image Optimization

Remote image patterns are allowed from the following domains in `next.config.ts`:

| Domain | Purpose |
|---|---|
| `images.unsplash.com` | Placeholder/stock imagery |
| `img.youtube.com` | Video thumbnails |
| `www.arsenal.com` | Arsenal FC assets |
| `aws-obg-image-lb-{1..4}.tcl.com` | TCL CDN (4 load-balanced origins) |
| `res.cloudinary.com` | Cloudinary uploads |
| `biz-file.com` | Business assets |
| `download.logo.wine` | Brand logos |
| `images.seeklogo.com` | Brand logos |

### 7.4 Required Environment Variables

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string (with connection pooler) | `postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require` |
| `JWT_SECRET` | Secret key for HS256 JWT signing (min 32 characters) | `<random-256-bit-hex>` |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name for media uploads | `my-cloud` |

> **Fallback:** If `JWT_SECRET` is not set, the app falls back to the hardcoded development secret `"tcl-arsenal-rtg-2026-dev-secret"`. This must be set in production.

---

## 8. Security

### 8.1 Authentication Security

| Measure | Implementation |
|---|---|
| **JWT Algorithm** | HS256 via `jose` library (constant-time verification) |
| **JWT Expiration** | 7-day sliding window |
| **Cookie Security** | `HttpOnly`, `SameSite=Lax`, `Secure` (in production via HTTPS) |
| **OTP Expiration** | 5 minutes from generation |
| **OTP Attempt Tracking** | `attempts` field on `OtpCode` model (rate limiting ready) |
| **Password-free** | No passwords stored; phone-based OTP only |

### 8.2 Authorization Layers

```
Request Flow:
  |
  +-- Layer 1: Middleware (src/middleware.ts)
  |     Scope: /admin/* page routes only
  |     Action: Verify JWT, check ADMIN|SUPER_ADMIN role, redirect to /login
  |
  +-- Layer 2: AdminAuthGuard (client component)
  |     Scope: Admin layout wrapper
  |     Action: Client-side role verification, redirect on failure
  |
  +-- Layer 3: requireRole() (API route handler)
  |     Scope: /api/admin/* routes
  |     Action: Verify JWT from cookie or Authorization header, check role hierarchy
  |
  +-- Layer 4: Captain layout guard
        Scope: (captain)/ route group layout
        Action: Verify captain authentication for team management pages
```

### 8.3 Input Validation

| Layer | Tool | Scope |
|---|---|---|
| **API routes** | Zod v4 schemas | Request body validation before database operations |
| **Client forms** | Controlled inputs + Zod | Pre-submission validation with error messages |
| **Database** | Prisma schema constraints | `@unique`, `@@unique`, enum types, `@default` values |

### 8.4 CORS & CSRF Protection

- **CORS:** Handled by Next.js defaults (same-origin for API routes)
- **CSRF:** Mitigated by `SameSite=Lax` cookie + `HttpOnly` flag (cookies not accessible via JavaScript, not sent on cross-origin POST requests from third-party sites)
- **XSS:** React's default JSX escaping + `HttpOnly` session cookie prevents token theft

### 8.5 Database Security

| Measure | Implementation |
|---|---|
| **Connection encryption** | SSL/TLS required by Neon (`?sslmode=require`) |
| **Query safety** | Prisma parameterized queries (no SQL injection) |
| **Cascade deletes** | Configured on `MatchEvent`, `Player`, `Notification`, `NotificationPreference`, `FavoriteTeam`, `ApplicationStatusLog` to prevent orphaned records |
| **Secrets** | `DATABASE_URL` and `JWT_SECRET` stored in Vercel environment variables (not in source) |

### 8.6 Rate Limiting Readiness

The `OtpCode` model includes an `attempts` counter field. While not currently enforced, the schema supports implementing rate limiting by:

1. Incrementing `attempts` on each verification try
2. Rejecting requests where `attempts >= MAX_ATTEMPTS` (recommended: 5)
3. Limiting OTP creation frequency per phone number

---

## 9. File Structure

```
tcl-app/
|
+-- prisma/
|   +-- schema.prisma                          # Database schema (27 models, 6 enums)
|   +-- migrations/                            # Prisma migration history
|   +-- seed.ts                                # Database seeding script
|
+-- prisma.config.ts                           # Prisma 7 configuration (datasource, migrations)
+-- public/
|   +-- manifest.json                          # PWA web app manifest
|   +-- sw.js                                  # Service worker (cache strategies)
|   +-- offline.html                           # Offline fallback page
|   +-- icons/                                 # PWA icons (192, 512, maskable)
|   +-- images/                                # Static images
|   +-- favicon.ico
|   +-- *.svg                                  # SVG assets (file, globe, next, vercel, window)
|
+-- src/
|   +-- app/
|   |   +-- layout.tsx                         # Root layout (fonts, providers, service worker)
|   |   +-- globals.css                        # Tailwind v4 + design tokens + animations + effects
|   |   +-- favicon.ico
|   |   |
|   |   +-- (site)/                            # ---- PUBLIC SITE ROUTE GROUP ----
|   |   |   +-- layout.tsx                     #   SplashScreen + Header + BottomNav
|   |   |   +-- page.tsx                       #   Homepage (hero, countdown, CTA)
|   |   |   +-- loading.tsx                    #   Global loading skeleton
|   |   |   +-- not-found.tsx                  #   404 page
|   |   |   +-- fan-interest/
|   |   |   |   +-- page.tsx                   #   Fan interest registration form
|   |   |   +-- register/
|   |   |   |   +-- layout.tsx                 #   Registration-specific layout
|   |   |   |   +-- page.tsx                   #   User registration page
|   |   |   |
|   |   |   +-- (public)/                      #   -- Unauthenticated public pages --
|   |   |   |   +-- faq/page.tsx               #     FAQ accordion page
|   |   |   |   +-- highlights/page.tsx        #     Media highlights gallery
|   |   |   |   +-- matches/
|   |   |   |   |   +-- page.tsx               #     Match list with filters
|   |   |   |   |   +-- [matchId]/page.tsx     #     Single match detail + events
|   |   |   |   +-- notifications/page.tsx     #     Notification center
|   |   |   |   +-- prize/page.tsx             #     Prize packages showcase
|   |   |   |   +-- standings/page.tsx         #     Group standings tables
|   |   |   |   +-- teams/
|   |   |   |   |   +-- page.tsx               #     Team grid/list
|   |   |   |   |   +-- [teamId]/page.tsx      #     Team profile + roster
|   |   |   |   +-- zone/page.tsx              #     Zone schedule & activities
|   |   |   |
|   |   |   +-- (auth)/                        #   -- Authentication pages --
|   |   |   |   +-- login/page.tsx             #     OTP login form
|   |   |   |
|   |   |   +-- (captain)/                     #   -- Captain-only pages --
|   |   |       +-- layout.tsx                 #     Captain auth guard
|   |   |       +-- apply/page.tsx             #     Team application form
|   |   |       +-- status/page.tsx            #     Application status tracker
|   |   |       +-- my-team/
|   |   |           +-- page.tsx               #     Team dashboard
|   |   |           +-- roster/page.tsx        #     Roster management
|   |   |           +-- kit-sizes/page.tsx     #     Kit size submission
|   |   |           +-- agreements/page.tsx    #     Legal agreements
|   |   |
|   |   +-- (admin)/                           # ---- ADMIN PORTAL ROUTE GROUP ----
|   |   |   +-- admin/
|   |   |       +-- layout.tsx                 #   AdminAuthGuard + Sidebar + Topbar
|   |   |       +-- page.tsx                   #   Dashboard (stats overview)
|   |   |       +-- applications/page.tsx      #   Application review & management
|   |   |       +-- campaign/page.tsx          #   Campaign state management
|   |   |       +-- content/page.tsx           #   Site content CMS (key-value)
|   |   |       +-- faq/page.tsx               #   FAQ CRUD + reorder
|   |   |       +-- hero-slides/page.tsx       #   Hero carousel CMS
|   |   |       +-- highlights/page.tsx        #   Highlights CRUD
|   |   |       +-- matches/
|   |   |       |   +-- page.tsx               #   Match list & scheduling
|   |   |       |   +-- [matchId]/page.tsx     #   Live scoring & event logging
|   |   |       +-- notifications/page.tsx     #   Notification broadcast
|   |   |       +-- prizes/page.tsx            #   Prize package management
|   |   |       +-- standings/page.tsx         #   Standings view & recalculation
|   |   |       +-- teams/
|   |   |       |   +-- page.tsx               #   Team management
|   |   |       |   +-- [teamId]/page.tsx      #   Team detail + player CRUD
|   |   |       +-- users/page.tsx             #   User management & role assignment
|   |   |       +-- zone/page.tsx              #   Zone schedule management
|   |   |
|   |   +-- api/                               # ---- API ROUTES ----
|   |       +-- auth/
|   |       |   +-- otp/start/route.ts         #   POST: Generate & store OTP
|   |       |   +-- otp/verify/route.ts        #   POST: Verify OTP, issue JWT
|   |       |   +-- me/route.ts                #   GET:  Current session user
|   |       |   +-- logout/route.ts            #   POST: Clear session cookie
|   |       |
|   |       +-- bracket/route.ts               #   GET: Knockout bracket nodes
|   |       +-- campaign/route.ts              #   GET: Active campaign data
|   |       +-- faq/route.ts                   #   GET: FAQ items
|   |       +-- highlights/route.ts            #   GET: Published highlights
|   |       +-- matches/
|   |       |   +-- route.ts                   #   GET: Match list (filterable)
|   |       |   +-- [matchId]/route.ts         #   GET: Single match detail
|   |       +-- notifications/route.ts         #   GET: User notifications
|   |       +-- prize/route.ts                 #   GET: Prize packages
|   |       +-- standings/route.ts             #   GET: Group standings
|   |       +-- teams/
|   |       |   +-- route.ts                   #   GET: Team list
|   |       |   +-- [teamId]/route.ts          #   GET: Team detail + roster
|   |       +-- zone/route.ts                  #   GET: Zone schedule
|   |       |
|   |       +-- admin/                         #   ---- ADMIN API ROUTES ----
|   |           +-- applications/
|   |           |   +-- route.ts               #   GET: All applications
|   |           |   +-- [id]/route.ts          #   PATCH: Update application status
|   |           +-- campaign/route.ts          #   GET/PATCH: Campaign state
|   |           +-- content/route.ts           #   GET/PUT: Site content KV
|   |           +-- faq/
|   |           |   +-- route.ts               #   GET/POST: FAQ items
|   |           |   +-- [id]/route.ts          #   PATCH/DELETE: Single FAQ
|   |           |   +-- reorder/route.ts       #   PUT: Reorder FAQ items
|   |           +-- hero-slides/
|   |           |   +-- route.ts               #   GET/POST: Hero slides
|   |           |   +-- [id]/route.ts          #   PATCH/DELETE: Single slide
|   |           |   +-- reorder/route.ts       #   PUT: Reorder slides
|   |           +-- highlights/
|   |           |   +-- route.ts               #   GET/POST: Highlights
|   |           |   +-- [id]/route.ts          #   PATCH/DELETE: Single highlight
|   |           +-- matches/
|   |           |   +-- route.ts               #   GET/POST: Matches
|   |           |   +-- [matchId]/route.ts     #   PATCH: Update match (status/score)
|   |           |   +-- [matchId]/events/route.ts # GET/POST: Match events
|   |           +-- notifications/
|   |           |   +-- send/route.ts          #   POST: Broadcast notification
|   |           |   +-- templates/route.ts     #   GET/POST: Templates
|   |           +-- prizes/
|   |           |   +-- route.ts               #   GET/POST: Prize packages
|   |           |   +-- [id]/route.ts          #   PATCH/DELETE: Single prize
|   |           +-- standings/
|   |           |   +-- route.ts               #   GET: Standings
|   |           |   +-- recalculate/route.ts   #   POST: Recalculate from results
|   |           +-- stats/route.ts             #   GET: Dashboard statistics
|   |           +-- teams/
|   |           |   +-- route.ts               #   GET/POST: Teams
|   |           |   +-- [teamId]/route.ts      #   PATCH/DELETE: Single team
|   |           |   +-- [teamId]/players/
|   |           |       +-- route.ts           #   GET/POST: Team players
|   |           |       +-- [playerId]/route.ts#   PATCH/DELETE: Single player
|   |           +-- users/
|   |           |   +-- route.ts               #   GET: User list
|   |           |   +-- [id]/route.ts          #   PATCH: Update user role
|   |           +-- zone/
|   |               +-- route.ts               #   GET/POST: Zone items
|   |               +-- [id]/route.ts          #   PATCH/DELETE: Single zone item
|   |
|   +-- components/
|   |   +-- admin/
|   |   |   +-- admin-auth-guard.tsx           # Client-side admin role check wrapper
|   |   |   +-- admin-page-header.tsx          # Reusable admin page title + action bar
|   |   |   +-- admin-sidebar.tsx              # Desktop sidebar navigation
|   |   |   +-- admin-topbar.tsx               # Admin top bar with user context
|   |   |
|   |   +-- campaign/
|   |   |   +-- countdown-timer.tsx            # Live countdown to event (uses timeUntil())
|   |   |   +-- cta-buttons.tsx                # Campaign call-to-action buttons
|   |   |   +-- hero-section.tsx               # Full-width hero carousel
|   |   |   +-- social-share.tsx               # Social sharing panel
|   |   |   +-- video-section.tsx              # Embedded promotional video
|   |   |
|   |   +-- layout/
|   |   |   +-- bottom-nav.tsx                 # Mobile bottom tab bar (5 items)
|   |   |   +-- header.tsx                     # Site header with logo + auth state
|   |   |   +-- more-menu.tsx                  # "More" overflow menu
|   |   |   +-- page-container.tsx             # Consistent page padding wrapper
|   |   |   +-- splash-screen.tsx              # Animated brand splash on first load
|   |   |
|   |   +-- matches/
|   |   |   +-- match-card.tsx                 # Match result/live/scheduled card
|   |   |   +-- match-filters.tsx              # Stage and status filter bar
|   |   |
|   |   +-- shared/
|   |   |   +-- empty-state.tsx                # "No data" placeholder with icon
|   |   |   +-- social-share-button.tsx        # Individual social share action
|   |   |
|   |   +-- ui/
|   |       +-- accordion.tsx                  # Radix Accordion wrapper
|   |       +-- badge.tsx                      # Status/category badge
|   |       +-- button.tsx                     # Button with variant system
|   |       +-- card.tsx                       # Card container
|   |       +-- input.tsx                      # Form input
|   |       +-- skeleton.tsx                   # Loading skeleton
|   |       +-- tabs.tsx                       # Radix Tabs wrapper
|   |
|   +-- lib/
|   |   +-- auth.ts                            # JWT sign/verify, session helpers, requireRole()
|   |   +-- constants.ts                       # Tournament config, nav items, enums
|   |   +-- mock-data.ts                       # Development seed/mock data
|   |   +-- prisma.ts                          # Prisma client singleton (PrismaPg adapter)
|   |   +-- utils.ts                           # cn(), formatDate(), formatTime(), timeUntil()
|   |
|   +-- providers/
|   |   +-- auth-provider.tsx                  # AuthContext: user state, login(), logout()
|   |   +-- query-provider.tsx                 # TanStack QueryClient provider
|   |
|   +-- types/
|   |   +-- index.ts                           # All TypeScript interfaces & type unions
|   |
|   +-- middleware.ts                          # Next.js middleware: /admin/* JWT guard
|
+-- docs/                                      # Documentation
+-- scripts/                                   # Utility scripts
+-- next.config.ts                             # Next.js configuration (image domains)
+-- vercel.json                                # Vercel deployment config
+-- tsconfig.json                              # TypeScript configuration
+-- eslint.config.mjs                          # ESLint flat config
+-- postcss.config.mjs                         # PostCSS (Tailwind v4 plugin)
+-- package.json                               # Dependencies and scripts
```

---

## Appendix A: API Route Summary

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/otp/start` | None | Generate and store OTP for phone |
| `POST` | `/api/auth/otp/verify` | None | Verify OTP, issue JWT cookie |
| `GET` | `/api/auth/me` | Session | Get current authenticated user |
| `POST` | `/api/auth/logout` | Session | Clear session cookie |
| `GET` | `/api/bracket` | None | Knockout bracket nodes |
| `GET` | `/api/campaign` | None | Active campaign data |
| `GET` | `/api/faq` | None | FAQ items list |
| `GET` | `/api/highlights` | None | Published highlights |
| `GET` | `/api/matches` | None | Match list (filterable) |
| `GET` | `/api/matches/:matchId` | None | Single match with events |
| `GET` | `/api/notifications` | Session | User notifications |
| `GET` | `/api/prize` | None | Prize packages |
| `GET` | `/api/standings` | None | Group standings |
| `GET` | `/api/teams` | None | Team list |
| `GET` | `/api/teams/:teamId` | None | Team detail with roster |
| `GET` | `/api/zone` | None | Zone schedule |
| `GET` | `/api/admin/stats` | ADMIN | Dashboard statistics |
| `GET/PATCH` | `/api/admin/campaign` | ADMIN | Campaign state |
| `GET/POST` | `/api/admin/teams` | ADMIN | Teams CRUD |
| `PATCH/DELETE` | `/api/admin/teams/:teamId` | ADMIN | Single team |
| `GET/POST` | `/api/admin/teams/:teamId/players` | ADMIN | Player CRUD |
| `PATCH/DELETE` | `/api/admin/teams/:teamId/players/:playerId` | ADMIN | Single player |
| `GET/POST` | `/api/admin/matches` | ADMIN | Match CRUD |
| `PATCH` | `/api/admin/matches/:matchId` | ADMIN | Update match/score |
| `GET/POST` | `/api/admin/matches/:matchId/events` | ADMIN | Match events |
| `GET` | `/api/admin/standings` | ADMIN | Standings view |
| `POST` | `/api/admin/standings/recalculate` | ADMIN | Recalculate standings |
| `GET` | `/api/admin/applications` | ADMIN | Application list |
| `PATCH` | `/api/admin/applications/:id` | ADMIN | Update application status |
| `GET/PUT` | `/api/admin/content` | ADMIN | Site content KV |
| `GET/POST` | `/api/admin/faq` | ADMIN | FAQ CRUD |
| `PATCH/DELETE` | `/api/admin/faq/:id` | ADMIN | Single FAQ |
| `PUT` | `/api/admin/faq/reorder` | ADMIN | Reorder FAQ |
| `GET/POST` | `/api/admin/hero-slides` | ADMIN | Hero slides CRUD |
| `PATCH/DELETE` | `/api/admin/hero-slides/:id` | ADMIN | Single slide |
| `PUT` | `/api/admin/hero-slides/reorder` | ADMIN | Reorder slides |
| `GET/POST` | `/api/admin/highlights` | ADMIN | Highlights CRUD |
| `PATCH/DELETE` | `/api/admin/highlights/:id` | ADMIN | Single highlight |
| `POST` | `/api/admin/notifications/send` | ADMIN | Broadcast notification |
| `GET/POST` | `/api/admin/notifications/templates` | ADMIN | Notification templates |
| `GET/POST` | `/api/admin/prizes` | ADMIN | Prize CRUD |
| `PATCH/DELETE` | `/api/admin/prizes/:id` | ADMIN | Single prize |
| `GET` | `/api/admin/users` | ADMIN | User list |
| `PATCH` | `/api/admin/users/:id` | ADMIN | Update user role |
| `GET/POST` | `/api/admin/zone` | ADMIN | Zone schedule CRUD |
| `PATCH/DELETE` | `/api/admin/zone/:id` | ADMIN | Single zone item |

---

## Appendix B: Utility Functions

| Function | File | Signature | Purpose |
|---|---|---|---|
| `cn()` | `lib/utils.ts` | `(...inputs: ClassValue[]) => string` | Merge Tailwind classes via `clsx` + `twMerge` |
| `formatDate()` | `lib/utils.ts` | `(date: Date \| string) => string` | Format to "Mar 26, 2026" |
| `formatTime()` | `lib/utils.ts` | `(date: Date \| string) => string` | Format to "02:30 PM" |
| `formatScore()` | `lib/utils.ts` | `(home: number, away: number) => string` | Format to "2 - 1" |
| `getInitials()` | `lib/utils.ts` | `(name: string) => string` | Extract initials "John Doe" -> "JD" |
| `timeUntil()` | `lib/utils.ts` | `(date: Date \| string) => { days, hours, minutes, seconds, total }` | Countdown calculation |
| `signJwt()` | `lib/auth.ts` | `(payload: Session) => Promise<string>` | Sign JWT with HS256 |
| `verifyJwt()` | `lib/auth.ts` | `(token: string) => Promise<Session \| null>` | Verify and decode JWT |
| `getSession()` | `lib/auth.ts` | `(request?: NextRequest) => Promise<Session \| null>` | Extract session from cookie or header |
| `requireAuth()` | `lib/auth.ts` | `(request: NextRequest) => Promise<Session>` | Throw if not authenticated |
| `requireRole()` | `lib/auth.ts` | `(request: NextRequest, role: UserRole) => Promise<Session>` | Throw if insufficient role |
| `setSessionCookie()` | `lib/auth.ts` | `(token: string) => { "Set-Cookie": string }` | Generate Set-Cookie header |
| `clearSessionCookie()` | `lib/auth.ts` | `() => { "Set-Cookie": string }` | Generate cookie-clearing header |

---

*Document generated 2026-03-26. Reflects the codebase as of this date.*
