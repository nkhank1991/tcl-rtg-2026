# TCL x Arsenal Road to Greatness 2026 — Project Journey & Educational Document

> **How this project was built, the decisions that shaped it, the challenges we overcame, and the lessons learned along the way.**
> An educational narrative for anyone learning modern web development.

---

## Table of Contents

- [Project Vision](#project-vision)
- [Technology Decisions & Why](#technology-decisions--why)
- [Architecture Journey](#architecture-journey)
- [Key Challenges & Solutions](#key-challenges--solutions)
- [What We Built (By the Numbers)](#what-we-built-by-the-numbers)
- [Lessons Learned](#lessons-learned)

---

## Project Vision

### The Partnership

TCL, the world's No. 2 TV brand, partnered with Arsenal Football Club to bring grassroots football to the UAE. The **Road to Greatness** is a 5-a-side tournament where 16 teams compete across two days for the ultimate prize: an all-expenses-paid trip to London to train at Emirates Stadium with Arsenal coaches and meet Arsenal legends.

### The Problem

Running a two-day tournament with 16 teams, 31 matches, an indoor activation zone, and hundreds of fans requires serious operational tooling. Previous events relied on spreadsheets, WhatsApp groups, and manual score updates. The organizers needed:

- A **fan-facing app** where spectators could follow matches, check standings, browse teams, and receive real-time notifications
- An **admin CMS** where the operations team could manage matches, update scores, publish highlights, send notifications, and handle team registrations
- Everything had to work on **mobile** — fans are at the venue on their phones, not sitting at desktops

### The Goal

Build a **Progressive Web App (PWA)** that serves two audiences from a single codebase:

1. **Fans** — A beautiful, dark-themed mobile experience for following the tournament
2. **Operations** — A full admin dashboard for managing every aspect of the event

Key requirements:

- **Mobile-first** — Designed for phones first, responsive for larger screens
- **Dark theme** — Premium, cinematic aesthetic matching the TCL x Arsenal brand
- **Real-time data** — Live scores, standings, and notifications from a real database
- **Offline capable** — Basic pages work without internet (PWA service worker)
- **Fast deployment** — Ship to production in weeks, not months

---

## Technology Decisions & Why

Every technology choice was made with purpose. Here is the reasoning behind each one.

### Why Next.js 16 (App Router, React Server Components, Turbopack)

**The choice:** Next.js 16.2.1 with the App Router

**Why:**
- **App Router** is the modern standard for Next.js, replacing the legacy Pages Router. It enables React Server Components, nested layouts, loading states, and route groups out of the box.
- **React Server Components (RSC)** let us render pages on the server without shipping JavaScript to the client. For pages like the admin dashboard that fetch data and render tables, RSC means faster initial loads and less client-side JavaScript.
- **Turbopack** is the new bundler replacing Webpack. Development server startup went from ~8 seconds (Webpack) to under 2 seconds. Hot module replacement is nearly instant.
- **Route Groups** — Using `(site)` and `(admin)` route groups lets us have completely different layouts for the consumer app (bottom nav, mobile header) and admin dashboard (sidebar, topbar) while sharing the same codebase.

**What we use from Next.js 16:**
- `app/` directory with nested layouts
- Route groups: `(site)`, `(admin)`, `(public)`, `(auth)`, `(captain)`
- `loading.tsx` for instant loading states
- `not-found.tsx` for 404 handling
- Middleware for admin route protection
- API routes for backend endpoints
- `next/image` for optimized image loading
- Dynamic routes with `[matchId]`, `[teamId]` parameters

### Why Prisma 7 (Type-Safe ORM, Migrations, Seeding)

**The choice:** Prisma 7.5.0 with the `@prisma/adapter-pg` driver adapter

**Why:**
- **Type safety** — Prisma generates TypeScript types from your database schema. When you change the schema, the types update automatically. No more guessing column names or types.
- **Migrations** — `prisma migrate dev` creates versioned SQL migration files. You can track every schema change in git.
- **Seeding** — `prisma db seed` populates the database with realistic tournament data (16 teams, 31 matches, group standings, FAQ items, etc.)
- **Query builder** — Prisma's query API is intuitive: `prisma.match.findMany({ include: { homeTeam: true } })` reads like English.

**Why not Drizzle or raw SQL?**
- Prisma's developer experience is unmatched for rapid prototyping. The auto-generated types and the visual Studio (Prisma Studio) made iteration fast.
- For a project with 27+ models and complex relations (teams -> players -> matches -> events -> standings), an ORM saves hundreds of lines of manual SQL.

**The Prisma 7 breaking changes** (more on this in Challenges):
- Prisma 7 removed `datasourceUrl` from the client constructor — you must use driver adapters
- The client engine now requires explicit adapter configuration
- This was a significant migration from Prisma 6 patterns

### Why PostgreSQL / Neon (Serverless, Free Tier, Connection Pooler)

**The choice:** Neon PostgreSQL (serverless) with connection pooling

**Why:**
- **Serverless PostgreSQL** — Neon scales to zero when idle (no cost) and spins up in milliseconds when a request arrives. Perfect for a tournament app that has bursty traffic on event days and near-zero traffic otherwise.
- **Free tier** — Neon's free tier includes 512 MB storage and 100 hours of compute. More than enough for a tournament database.
- **Connection pooler** — Serverless functions (Vercel) create a new database connection on every cold start. Without a connection pooler, you quickly exhaust PostgreSQL's connection limit. Neon's built-in pooler (PgBouncer) solves this automatically.
- **Branching** — Neon supports database branching for development. You can create a copy of production data in seconds for testing.

**Why not Supabase or PlanetScale?**
- Supabase adds its own auth and API layer — we wanted full control with Prisma.
- PlanetScale is MySQL-based; Prisma's PostgreSQL support is more mature.
- Neon + Prisma + Vercel is a proven stack with first-party integration support.

### Why TanStack Query (Client-Side Caching, Refetching, Optimistic Updates)

**The choice:** TanStack React Query 5.95.2

**Why:**
- **Automatic caching** — When a user visits the Matches page, the data is cached. Navigate away and come back — the data loads instantly from cache while refetching in the background.
- **Query keys** — Each query has a unique key (e.g., `["matches"]`, `["team", teamId]`). This enables targeted cache invalidation when an admin updates a match score.
- **Loading and error states** — `isLoading`, `isError`, and `data` are returned from every query hook, making it trivial to show skeleton loaders.
- **Stale-while-revalidate** — Show cached data immediately, then update silently in the background. The user never sees a loading spinner on repeat visits.
- **Devtools** — TanStack Query Devtools shows every cached query, its state, and timing. Invaluable for debugging.

**Why not SWR?**
- TanStack Query has richer features: query invalidation, optimistic updates, infinite queries, and better devtools.
- The community and documentation are more extensive.

### Why Tailwind CSS v4 (New @theme Inline Syntax, No Config File)

**The choice:** Tailwind CSS 4.x with the new `@theme` inline syntax

**Why:**
- **No config file** — Tailwind v4 removes `tailwind.config.js` entirely. Theme customization happens inline in your CSS using `@theme { }` blocks. One less file to maintain.
- **CSS-first configuration** — Colors, fonts, spacing, and breakpoints are defined in CSS, not JavaScript. This feels more natural and keeps the configuration close to where it is used.
- **Performance** — Tailwind v4's new engine is significantly faster at build time.
- **Design tokens** — Our custom tokens (`--color-tcl-red`, `--color-arsenal-gold`, `--color-bg-primary`, `--color-bg-surface`, etc.) are defined in the `@theme` block and used as Tailwind classes (`bg-tcl-red`, `text-arsenal-gold`).

**Our custom theme includes:**
- TCL Red (`#E4002B`) and Arsenal Gold (`#EDBB4A`) brand colors
- Dark theme surface colors (`bg-primary`, `bg-surface`, `bg-elevated`)
- Custom font families (`font-display` for headings, `font-score` for numbers)
- Custom animations (`slide-up`, `fade-in`, `pulse-live`, `heroProgress`)

### Why JWT Over Sessions (Stateless, Serverless-Friendly)

**The choice:** JSON Web Tokens using the `jose` library

**Why:**
- **Stateless** — JWTs are self-contained. The server does not need to store session data in a database or Redis. The token itself contains the user ID, role, and expiry.
- **Serverless-friendly** — Vercel serverless functions are ephemeral. There is no persistent memory between requests. Session-based auth would require a database lookup on every request. JWT verification is a local cryptographic operation — no network call needed.
- **Cookie-based** — The JWT is stored in an HTTP-only cookie (`tcl-session`), which is automatically sent with every request. No client-side token management needed.
- **Role-based access** — The JWT payload includes the user's role (FAN, CAPTAIN, ADMIN, SUPER_ADMIN). Middleware checks this role to protect admin routes.

**Why not NextAuth / Auth.js?**
- NextAuth adds significant complexity for what we needed. Our auth flow is simple: phone number -> OTP -> JWT. No OAuth providers, no social logins.

### Why OTP Over Passwords (UAE Market, Mobile-First, Frictionless)

**The choice:** SMS-based One-Time Password (6-digit code)

**Why:**
- **UAE market** — The UAE has near-universal mobile phone penetration. Every potential user has a phone number. Not everyone has a strong password manager habit.
- **Mobile-first** — Typing passwords on mobile is tedious. Typing a 6-digit number is fast.
- **Frictionless** — No account creation, no password reset, no "forgot password" flows. Enter phone number, receive code, done.
- **Security** — OTPs are time-limited (60 seconds) and single-use. No passwords to leak, no passwords to reuse.

**The flow:**
1. User enters phone number with +971 prefix
2. Server generates a 6-digit OTP, stores its hash with an expiry
3. OTP is sent via SMS
4. User enters the code
5. Server verifies the code, creates/finds the user, issues a JWT
6. User is redirected to the Captain Dashboard

### Why Cloudinary (Unsigned Uploads, CDN, Image Transformations)

**The choice:** Cloudinary via `next-cloudinary` (v6.17.5)

**Why:**
- **Unsigned uploads** — Admin users can upload images directly from the browser to Cloudinary without routing through our server. This reduces server load and simplifies the upload flow.
- **CDN** — Images are served from Cloudinary's global CDN. A fan in Dubai and a fan in London both get fast image loads.
- **On-the-fly transformations** — Cloudinary can resize, crop, and optimize images via URL parameters. We specify `w_600`, `c_fill`, `f_auto`, `q_auto` to get perfectly sized, compressed images for mobile.
- **Integration with Next.js** — The `next-cloudinary` package provides a `CldImage` component that works with Next.js image optimization.

### Why Vercel (Best Next.js Support, Edge Network, Serverless Functions)

**The choice:** Vercel for deployment

**Why:**
- **First-party Next.js support** — Vercel built Next.js. Their platform handles App Router, RSC, middleware, and API routes natively. Zero configuration needed.
- **Edge network** — Static assets and cached pages are served from edge locations worldwide.
- **Serverless functions** — API routes automatically become serverless functions. They scale to zero when idle and handle thousands of concurrent requests on match day.
- **Preview deployments** — Every git push creates a unique preview URL. The operations team can review changes before they go live.
- **Zero-ops** — No servers to manage, no Docker containers, no Kubernetes. Push to git and it deploys.

---

## Architecture Journey

The project was built in phases, each building on the foundation of the previous one.

### Phase 0: Foundation (Prisma, Database, Auth)

**Goal:** Get the data layer and authentication working.

**What we built:**
- Prisma schema with 27+ models (User, Team, Player, Match, MatchEvent, Group, Standing, Highlight, Notification, FaqItem, ZoneScheduleItem, HeroSlide, Application, Campaign, PrizeInfo, Content, and more)
- Database migrations and seed script with realistic tournament data
- JWT-based authentication with OTP flow
- Auth provider (`useAuth` hook) for client-side auth state
- Middleware for admin route protection

**Key decisions:**
- Used Prisma's relation system extensively: `Match` has `homeTeam` and `awayTeam` relations, `Standing` belongs to both `Team` and `Group`, `Player` belongs to `Team`
- Designed 4 user roles from the start: `FAN`, `CAPTAIN`, `ADMIN`, `SUPER_ADMIN`
- Built the seed script to create a complete tournament: 16 teams across 4 groups, 31 matches with realistic schedules, pre-populated standings

### Phase 1: Admin Shell + Auth Guard

**Goal:** Build the admin dashboard layout and protect it.

**What we built:**
- Admin layout with sidebar navigation and topbar
- Auth guard component that redirects unauthorized users
- Admin route group `(admin)` with its own layout
- Middleware checking JWT role for `/admin/*` routes

**Key decisions:**
- Used a route group `(admin)` to completely separate admin layout from consumer layout
- Built `AdminAuthGuard` as a client component wrapper that checks auth on mount
- Sidebar navigation with sections for all 14 admin pages

### Phase 2: Admin UI Components

**Goal:** Build the reusable UI components needed across admin pages.

**What we built:**
- Admin page header component with consistent styling
- Admin sidebar with collapsible sections
- Admin topbar with user info and logout
- Shared UI components: Button, Card, Input, Badge, Tabs, Accordion, Skeleton, Dialog, Select, Switch, Toast, Checkbox, Avatar

**Key decisions:**
- Used Radix UI primitives for accessible components (Accordion, Dialog, Select, Switch, Tabs, Toast, Checkbox, Avatar)
- Built a `cn()` utility combining `clsx` and `tailwind-merge` for clean conditional class merging
- Designed components with the dark theme from the start — no light mode variant needed

### Phase 3: Migrate Public APIs from Mock Data to Prisma

**Goal:** Replace hardcoded mock data with real database queries.

**What we built:**
- Public API routes: `/api/matches`, `/api/matches/[matchId]`, `/api/teams`, `/api/teams/[teamId]`, `/api/standings`, `/api/faq`, `/api/highlights`, `/api/notifications`, `/api/zone`, `/api/hero-slides`, `/api/campaign`, `/api/prizes`, `/api/content`
- Each API route queries Prisma, formats the response, and returns JSON
- Client-side pages updated to fetch from APIs using TanStack Query

**Key decisions:**
- All public APIs are read-only GET endpoints — no authentication required
- Admin APIs require JWT authentication and role checks
- Used TanStack Query with cache keys matching the API paths for predictable caching
- Designed API responses with nested includes (e.g., match includes homeTeam and awayTeam)

### Phase 4: Admin CRUD Pages (14 Sections)

**Goal:** Build full create/read/update/delete interfaces for every data type.

**What we built — 14 admin sections:**

| # | Section | Path | Capabilities |
|---|---------|------|-------------|
| 1 | Dashboard | `/admin` | Overview stats, recent activity |
| 2 | Matches | `/admin/matches` | List, create, edit scores, manage events |
| 3 | Match Detail | `/admin/matches/[matchId]` | Score entry, event timeline, status management |
| 4 | Teams | `/admin/teams` | List, create, edit teams |
| 5 | Team Detail | `/admin/teams/[teamId]` | Roster management, player CRUD |
| 6 | Standings | `/admin/standings` | View/recalculate group standings |
| 7 | Highlights | `/admin/highlights` | Upload, categorize, manage highlights |
| 8 | Notifications | `/admin/notifications` | Create and send notifications |
| 9 | FAQ | `/admin/faq` | Manage FAQ items by category |
| 10 | Zone | `/admin/zone` | Manage indoor zone schedule |
| 11 | Hero Slides | `/admin/hero-slides` | Manage homepage carousel |
| 12 | Campaign | `/admin/campaign` | Partnership content management |
| 13 | Prizes | `/admin/prizes` | Prize information management |
| 14 | Content | `/admin/content` | General content blocks |
| 15 | Applications | `/admin/applications` | Review team applications |
| 16 | Users | `/admin/users` | User management, role assignment |

### Phase 5: Polish, PWA, Deployment

**Goal:** Make it production-ready.

**What we built:**
- PWA manifest (`manifest.json`) with app name, icons, theme color, and display mode
- Service worker for offline caching of static assets and previously visited pages
- Splash screen with animated TCL logo
- Custom loading states with skeleton loaders for every page
- Error boundaries and 404 pages
- Image optimization using Next.js `Image` component with proper `sizes` attributes
- Cinematic animations: slide-up, fade-in, stagger-children, pulse-live, hero progress bar
- Responsive design verification across iPhone SE, iPhone 14 Pro, Samsung Galaxy, iPad
- Deployment to Vercel with Neon PostgreSQL connection

---

## Key Challenges & Solutions

### 1. Prisma 7 Breaking Changes

**The problem:** Prisma 7 introduced fundamental changes to how the client connects to the database. The familiar pattern from Prisma 6 no longer worked:

```typescript
// Prisma 6 — THIS NO LONGER WORKS IN PRISMA 7
const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } }
});
```

Prisma 7 removed `datasourceUrl` from the client constructor entirely. Instead, it requires a **driver adapter** pattern.

**The solution:** We switched to the `@prisma/adapter-pg` driver adapter:

```typescript
// Prisma 7 — The new way
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
```

This also required adding `@types/pg` and `pg` as direct dependencies — packages that Prisma 6 handled internally.

### 2. Next.js 16 Async Params

**The problem:** In Next.js 16, dynamic route parameters (`params`) changed from a synchronous object to a **Promise**. Every dynamic page broke:

```typescript
// Next.js 15 — params is an object
export default function Page({ params }: { params: { matchId: string } }) {
  const id = params.matchId; // Works
}

// Next.js 16 — params is a Promise
export default function Page({ params }: { params: { matchId: string } }) {
  const id = params.matchId; // ERROR: Cannot read property of Promise
}
```

**The solution:** Use React's `use()` hook to unwrap the Promise:

```typescript
import { use } from "react";

export default function Page({ params }: { params: Promise<{ matchId: string }> }) {
  const { matchId } = use(params);
  // Now matchId is a string as expected
}
```

This affected every dynamic route: `/matches/[matchId]`, `/teams/[teamId]`, and all admin detail pages.

### 3. Turbopack Parser Issues with Conditional JSX

**The problem:** Turbopack's parser occasionally choked on complex conditional JSX patterns, especially ternary expressions spanning many lines with nested components. The dev server would crash with cryptic parser errors.

**The solution:** We refactored complex ternaries into early returns and extracted conditional blocks into separate components. For example, instead of:

```tsx
return (
  <div>
    {isLoading ? (
      <LoadingSkeleton />
    ) : error ? (
      <ErrorDisplay />
    ) : (
      <ComplexContent with={many} nested={elements} />
    )}
  </div>
);
```

We used:

```tsx
if (isLoading) return <LoadingSkeleton />;
if (error) return <ErrorDisplay />;

return (
  <div>
    <ComplexContent with={many} nested={elements} />
  </div>
);
```

This made the code more readable anyway — a happy side effect of working around a parser bug.

### 4. Route Group Restructuring

**The problem:** The initial file structure had all pages at the top level of `app/`. As the project grew, we needed different layouts for different sections:

- Consumer pages needed a bottom nav, mobile header, and dark mobile theme
- Admin pages needed a sidebar, topbar, and desktop-first layout
- Auth pages needed a minimal layout with no navigation
- Captain pages needed auth-protected routes with a specific layout

**The solution:** Restructured into nested route groups:

```
app/
  (site)/                  # Consumer app layout (header + bottom nav)
    (public)/              # Public pages (no auth required)
      matches/
      standings/
      teams/
      faq/
      highlights/
      prize/
      zone/
      notifications/
    (auth)/                # Auth pages (minimal layout)
      login/
    (captain)/             # Captain pages (auth required)
      my-team/
      apply/
      status/
    register/              # Registration (no bottom nav)
    fan-interest/
    page.tsx               # Home page
    layout.tsx             # Consumer layout with header + bottom nav
  (admin)/                 # Admin dashboard layout
    admin/
      layout.tsx           # Admin layout with sidebar + topbar
      page.tsx             # Dashboard
      matches/
      teams/
      ...14 more sections
  layout.tsx               # Root layout (html, body, fonts, providers)
```

This restructuring was done in a single session but required updating every import and link path across the codebase.

### 5. Auth Flow: Connecting OTP to Real Database Users

**The problem:** The initial auth implementation used a mock flow — send any OTP, verify with any 6 digits, get a fake token. Connecting this to real users required:

- Finding or creating a user by phone number
- Storing OTP hashes (not plaintext) with expiry timestamps
- Generating JWTs with real user data
- Handling edge cases (expired OTP, wrong code, max attempts)

**The solution:** Built a complete auth pipeline:

1. **`/api/auth/otp/start`** — Receives phone number, generates 6-digit code, hashes it with a salt, stores in database with 60-second expiry, triggers SMS
2. **`/api/auth/otp/verify`** — Receives phone + code, finds the stored OTP, verifies hash, checks expiry, creates/finds user, generates JWT, sets HTTP-only cookie
3. **`/api/auth/me`** — Verifies JWT from cookie, returns current user data
4. **Auth provider** — React context that calls `/api/auth/me` on mount and provides `user`, `isLoading`, `refresh`, and `logout` to the component tree
5. **Middleware** — Checks JWT on every `/admin/*` request, redirects to login if invalid

### 6. Mock Data Migration: 11 Pages Converted to API Fetching

**The problem:** The initial consumer app was built with hardcoded mock data to move fast on UI development. Every page had inline arrays of matches, teams, standings, etc. Once the database and APIs were ready, all 11 pages needed to be converted.

**The solution:** A systematic migration approach:

1. Built the API route (e.g., `/api/matches`)
2. Added TanStack Query with a query key and fetch function
3. Replaced the mock data variable with the query result
4. Added loading skeleton UI
5. Added error handling
6. Tested with real data
7. Removed the mock data

Pages migrated:
- Home page (4 separate queries: matches, standings, FAQ, teams)
- Matches page
- Match detail page
- Standings page
- Teams page
- Team detail page
- Highlights page
- Notifications page
- FAQ page
- Zone page
- Prize page (static, but connected to API for admin-managed content)

The TanStack Query pattern made this consistent across all pages:

```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ["matches"],
  queryFn: async () => {
    const res = await fetch("/api/matches");
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  },
});
```

---

## What We Built (By the Numbers)

### Codebase Statistics

| Metric | Count |
|--------|-------|
| **Total source files** | ~173 |
| **Lines of code** | ~21,000 |
| **React components** | 50+ |
| **Database models** | 27+ |

### API Routes

| Category | Count | Examples |
|----------|-------|---------|
| **Public APIs** | 14 | `/api/matches`, `/api/teams`, `/api/standings`, `/api/faq`, `/api/highlights`, `/api/notifications`, `/api/zone`, `/api/hero-slides`, `/api/campaign`, `/api/prizes`, `/api/content` |
| **Admin APIs** | 32 | CRUD for all 14 admin sections (list, create, update, delete per section) |
| **Auth APIs** | 3 | `/api/auth/otp/start`, `/api/auth/otp/verify`, `/api/auth/me` |
| **Total** | ~46+ | |

### Pages

| Category | Count | Details |
|----------|-------|---------|
| **Consumer pages** | 10 | Home, Matches, Match Detail, Standings, Teams, Team Detail, Highlights, Prize, Zone, Notifications, FAQ, Register, Apply, Status, Fan Interest, Login |
| **Admin pages** | 16 | Dashboard, Matches, Match Detail, Teams, Team Detail, Standings, Highlights, Notifications, FAQ, Zone, Hero Slides, Campaign, Prizes, Content, Applications, Users |
| **Total** | ~26 | |

### User Roles

| Role | Access Level |
|------|-------------|
| **FAN** | Public pages only |
| **CAPTAIN** | Public pages + Captain portal (My Team, Roster, Kit Sizes, Agreements) |
| **ADMIN** | Public pages + Admin dashboard (read + write) |
| **SUPER_ADMIN** | Everything + User management + role assignment |

### Database Models (27+)

Core models include: User, Team, Player, Match, MatchEvent, Group, Standing, Highlight, Notification, FaqItem, ZoneScheduleItem, HeroSlide, Application, Campaign, PrizeInfo, Content, OtpCode, and supporting junction/metadata models.

### PWA Features

- `manifest.json` with app name, icons (192x192, 512x512), theme color, background color
- Service worker for offline caching
- "Add to Home Screen" support on iOS and Android
- Splash screen with animated loading
- Full-screen display mode (no browser chrome)

### Third-Party Integrations

| Integration | Purpose |
|-------------|---------|
| **Neon PostgreSQL** | Serverless database |
| **Vercel** | Hosting, serverless functions, edge network |
| **Cloudinary** | Image uploads, CDN, transformations |
| **TanStack Query** | Client-side data caching |
| **Radix UI** | Accessible component primitives |
| **Lucide React** | Icon library |
| **Jose** | JWT signing and verification |
| **Zod** | Runtime schema validation |

---

## Lessons Learned

### 1. Always Read the Docs for New Major Versions

Prisma 7 and Next.js 16 both had breaking changes that were not obvious from the previous version's patterns. The Prisma 7 migration from `datasourceUrl` to driver adapters cost several hours of debugging. The Next.js 16 async params change broke every dynamic route.

**Takeaway:** When upgrading to a new major version, read the migration guide first. Do not assume APIs are backward-compatible across major versions. The `AGENTS.md` file in the project root exists specifically to warn about this.

### 2. Start with Real Data Flow Early

The project started with hardcoded mock data to move fast on UI development. This was useful for the first few days, but the migration from mock data to real API calls affected 11 pages and took significant effort.

**Takeaway:** Build the database schema and API routes early, even if the data is seeded. Having `useQuery` with a real API endpoint from day one means no migration later. Mock data is fine for prototyping a single component, but not for an entire app.

### 3. PWA Is Mostly Just manifest.json + Service Worker

Adding PWA support felt intimidating at first — the term "Progressive Web App" sounds complex. In practice, it required:

- A `manifest.json` file (app name, icons, colors, display mode) — ~20 lines
- A service worker for caching — ~50 lines
- A `<link rel="manifest">` tag in the HTML head — 1 line
- Meta tags for iOS (apple-mobile-web-app-capable, status-bar-style) — 3 lines

The "Add to Home Screen" prompt is handled by the browser automatically once these are in place.

**Takeaway:** PWA is not a framework or a library. It is a set of web standards. The barrier to entry is much lower than most developers expect.

### 4. Vercel + Neon = Zero-Ops Deployment

The deployment pipeline is remarkably simple:

1. Push code to git
2. Vercel automatically builds and deploys
3. Neon database is always running (serverless, scales to zero)
4. Preview URLs are generated for every push

There are no servers to manage, no Docker files, no CI/CD pipelines to configure, no SSL certificates to renew, no scaling policies to tune. The entire infrastructure cost for development and staging is $0.

**Takeaway:** For projects that fit the serverless model (stateless request/response, moderate database usage, no long-running processes), the Vercel + Neon combination eliminates nearly all operational complexity.

### 5. Route Groups Are Architectural Gold

Next.js route groups (directories wrapped in parentheses like `(site)` and `(admin)`) do not affect the URL path but allow completely different layouts. This single feature enabled:

- Consumer app with mobile header + bottom nav
- Admin dashboard with sidebar + topbar
- Auth pages with minimal chrome
- Captain pages with auth protection

Without route groups, we would have needed complex conditional layout logic or a separate project for the admin dashboard.

**Takeaway:** Plan your route group structure early. It is much easier to set up the right architecture from the start than to restructure later (as we learned when we moved pages into the `(site)` group mid-project).

### 6. TanStack Query Eliminates an Entire Category of Bugs

Before TanStack Query, managing server state in React meant `useState` + `useEffect` + manual loading/error states + manual refetching + stale data bugs. TanStack Query handles all of this with a single hook.

The cache key system (`["matches"]`, `["team", teamId]`) makes cache invalidation predictable. When an admin updates a match score, invalidating `["matches"]` refreshes every component that depends on match data.

**Takeaway:** If your React app fetches data from an API, use TanStack Query (or SWR). The investment in learning the API pays off immediately in fewer bugs and less boilerplate.

### 7. Dark Theme Should Be the Default, Not an Afterthought

This project was designed dark-first. Every component, every surface color, every text opacity was tuned for dark backgrounds. The result is a cohesive, cinematic aesthetic that matches the TCL x Arsenal brand.

Retrofitting a dark theme onto a light-first design is painful — colors that look good on white often look washed out on dark backgrounds, shadows work differently, borders need different opacities, and text contrast ratios change completely.

**Takeaway:** If your design calls for a dark theme, start with it. Define your surface hierarchy (primary, surface, elevated) and text hierarchy (primary, secondary, muted) as design tokens from day one.

### 8. Mobile-First Is Not Just Smaller Screens

Building mobile-first meant:

- Touch targets are at least 44x44px
- Bottom navigation (thumb-friendly) instead of top navigation
- Horizontal scroll carousels instead of multi-column grids
- Large, tappable match cards instead of compact table rows
- Skeleton loaders that match the real content dimensions
- Safe area padding for notched phones (`pb-safe`)

**Takeaway:** Mobile-first is a design philosophy, not just a CSS breakpoint direction. Every interaction pattern changes when the user is holding a phone with one hand.

---

*Built with Next.js 16, Prisma 7, TanStack Query, Tailwind CSS v4, Neon PostgreSQL, and deployed on Vercel.*

*TCL x Arsenal Road to Greatness 2026 — From concept to production.*
