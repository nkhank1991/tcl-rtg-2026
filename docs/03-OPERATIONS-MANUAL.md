# Operations & Deployment Manual

**TCL x Arsenal — Road to Greatness 2026**

> Audience: DevOps engineers and developers setting up or maintaining this project.
>
> Last updated: 2026-03-26

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Local Development Setup](#2-local-development-setup)
3. [Environment Variables](#3-environment-variables)
4. [Database Management](#4-database-management)
5. [Deployment to Vercel](#5-deployment-to-vercel)
6. [Cloudinary Setup](#6-cloudinary-setup)
7. [SMS / OTP Setup (Production)](#7-smsotp-setup-production)
8. [Monitoring & Troubleshooting](#8-monitoring--troubleshooting)
9. [Updating & Maintenance](#9-updating--maintenance)
10. [Security Checklist](#10-security-checklist)

---

## 1. Prerequisites

Before you begin, make sure the following are installed or provisioned:

| Requirement | Minimum Version | Notes |
|---|---|---|
| **Node.js** | 20.x LTS or later | Check with `node -v` |
| **npm** | 10.x (ships with Node 20) | Check with `npm -v` |
| **PostgreSQL** | 15+ (Neon serverless recommended) | Local install or Neon cloud |
| **Git** | 2.40+ | For cloning and version control |
| **Cloudinary account** | Free tier is sufficient | Media uploads in admin portal |
| **Vercel account** | Hobby or Pro | Hosting and serverless functions |

### Installing Node.js

Download from <https://nodejs.org> or use a version manager:

```bash
# Using nvm (macOS/Linux)
nvm install 20
nvm use 20

# Using fnm (Windows/macOS/Linux)
fnm install 20
fnm use 20
```

Verify:

```bash
node -v   # should print v20.x.x or later
npm -v    # should print 10.x.x or later
```

### PostgreSQL Options

- **Neon (recommended for production):** Create a free project at <https://neon.tech>. Neon provides a serverless PostgreSQL with connection pooling, branching, and automatic scaling.
- **Local PostgreSQL:** Install via your OS package manager or <https://www.postgresql.org/download/>.

---

## 2. Local Development Setup

Follow these steps to get the app running locally from a clean checkout.

### 2.1 Clone the Repository

```bash
git clone <repository-url> tcl-app
cd tcl-app
```

### 2.2 Install Dependencies

```bash
npm install
```

This installs all production and development dependencies, including:

- **Next.js 16.2.1** (React 19)
- **Prisma 7.5** (ORM with PostgreSQL adapter)
- **next-cloudinary 6.x** (media uploads)
- **jose** (JWT handling)
- **Zod 4.x** (validation)
- **Radix UI** (component primitives)
- **TanStack React Query 5.x** (data fetching)

### 2.3 Create the Environment File

```bash
cp .env.example .env
```

Open `.env` and fill in the values (see [Section 3](#3-environment-variables) for the full reference). At a minimum you need:

```
DATABASE_URL="postgresql://user:password@localhost:5432/tcl_rtg?sslmode=disable"
JWT_SECRET="change-me-to-a-random-64-char-string"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

> **Tip:** If using Neon, copy the connection string from the Neon dashboard. It will look like:
> `postgresql://neondb_owner:xxxx@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require`

### 2.4 Run Database Migrations

```bash
npx prisma migrate deploy
```

This applies all migrations from `prisma/migrations/` to your database. The command is idempotent -- safe to run multiple times.

### 2.5 Seed the Database

```bash
npx prisma db seed
```

The seed script (`prisma/seed.ts`) populates the database with:

- 1 campaign ("Road to Greatness", slug `rtg-2026`)
- 2 event days (April 26-27 2026)
- 1 venue ("TCL Arena") with 4 pitches
- 4 groups (A through D)
- 16 teams with group assignments and standings
- 31 matches (24 group-stage + 7 knockout)
- 4 zone schedules, 6 prizes, 6 highlights, 9 FAQ items
- 2 hero slides, 6 notification templates, 6 site-content entries
- 1 super-admin user (phone: `+971500000000`)

### 2.6 Start the Development Server

```bash
npm run dev
```

The app starts at **http://localhost:3000**.

### 2.7 Log In as Admin

1. Open **http://localhost:3000** in your browser.
2. Tap "Sign In" or navigate to the login screen.
3. Enter the phone number: **+971500000000**
4. Enter the OTP code: **123456** (dev bypass code, always accepted).
5. You are now logged in as `SUPER_ADMIN` and have full access to the admin portal at `/admin`.

> **Important:** The dev bypass code `123456` is hardcoded in `src/app/api/auth/otp/verify/route.ts`. This MUST be removed before any production deployment. See [Section 10](#10-security-checklist).

---

## 3. Environment Variables

All environment variables are defined in `.env` (local) or in Vercel's project settings (production).

| Variable | Required | Description | Example |
|---|---|---|---|
| `DATABASE_URL` | **Yes** | PostgreSQL connection string. Use `?sslmode=require` for Neon. | `postgresql://user:pass@host:5432/dbname?sslmode=require` |
| `JWT_SECRET` | **Yes** | Secret key for signing JWT session tokens (via `jose` library). Must be a strong random string in production. | `k8Fj2mNpQrStUv...` (64+ random chars) |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | **Yes** | Your Cloudinary cloud name. This is a public variable (exposed to the browser). | `my-cloud-name` |
| `CLOUDINARY_API_KEY` | **Yes** | Cloudinary API key (server-side only). | `123456789012345` |
| `CLOUDINARY_API_SECRET` | **Yes** | Cloudinary API secret (server-side only). Never expose in client code. | `aBcDeFgHiJkLmNoPqRsT` |
| `TWILIO_ACCOUNT_SID` | Optional | Twilio account SID for production SMS/OTP delivery. | `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` |
| `TWILIO_AUTH_TOKEN` | Optional | Twilio auth token. | `your_auth_token` |
| `TWILIO_VERIFY_SERVICE_SID` | Optional | Twilio Verify service SID for OTP. | `VAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` |

### Notes on Environment Variables

- **`NEXT_PUBLIC_` prefix:** Only `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` uses this prefix, making it available in browser JavaScript. All other variables are server-side only.
- **Twilio variables:** When not set, the OTP flow operates in "dev mode" -- it stores OTPs in the database and returns the generated code in the API response (`devCode` field). The bypass code `123456` is also always accepted. In production, you must integrate Twilio Verify and remove the bypass.
- **`DATABASE_URL`:** Prisma 7 reads this from `prisma.config.ts` using `env("DATABASE_URL")`, not from `schema.prisma`. The schema's `datasource` block has no `url` field.

---

## 4. Database Management

This project uses **Prisma 7** with the **PostgreSQL adapter pattern** (`@prisma/adapter-pg`). This is different from earlier Prisma versions.

### 4.1 Prisma 7 Architecture

**Key files:**

| File | Purpose |
|---|---|
| `prisma.config.ts` | Defines the datasource URL, schema path, migration directory, and seed command. Replaces the `url` field in `schema.prisma`. |
| `prisma/schema.prisma` | Model definitions. The `datasource db` block specifies only the provider (`postgresql`), not the URL. |
| `src/lib/prisma.ts` | Application-level Prisma client singleton using the `PrismaPg` adapter. |
| `prisma/seed.ts` | Seed script (invoked by `npx prisma db seed`). |

**prisma.config.ts:**

```ts
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
```

**prisma/schema.prisma (datasource block):**

```prisma
datasource db {
  provider = "postgresql"
}
```

Note: No `url` in the schema. Prisma 7 reads the URL exclusively from `prisma.config.ts`.

**src/lib/prisma.ts (adapter pattern):**

```ts
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
export const prisma = new PrismaClient({ adapter });
```

This adapter-based approach connects directly via the `pg` driver rather than the Prisma engine binary.

### 4.2 Running Migrations

**Create a new migration (development):**

```bash
npx prisma migrate dev --name <migration_name>
```

This generates a new SQL migration in `prisma/migrations/`, applies it to your database, and regenerates the Prisma client.

**Apply existing migrations (production / CI):**

```bash
npx prisma migrate deploy
```

This applies all pending migrations without generating new ones. Safe for automated pipelines.

### 4.3 Seeding

```bash
npx prisma db seed
```

The seed command is configured in both `prisma.config.ts` and `package.json`:

```json
"prisma": {
  "seed": "npx tsx prisma/seed.ts"
}
```

The seed script uses `upsert` operations, so it is idempotent and safe to run repeatedly.

### 4.4 Resetting the Database

```bash
npx prisma migrate reset
```

This drops the database, re-applies all migrations, and re-runs the seed script. **Use only in development.** You will lose all data.

### 4.5 Prisma Studio

```bash
npx prisma studio
```

Opens a visual database browser at **http://localhost:5555**. Use it to:

- Inspect and edit records directly
- Add new admin users (set `role` to `SUPER_ADMIN`)
- Verify seed data
- Debug data issues

### 4.6 Backup Strategies (Neon)

Neon provides built-in backup capabilities:

1. **Point-in-time restore:** Neon retains a history of changes. Go to the Neon dashboard > your project > "Branches" > "Restore" to roll back to any point in time (within your plan's retention window).

2. **Database branching:** Create a branch before risky operations:
   - In the Neon dashboard, click "Create Branch" from your main branch.
   - This creates an instant copy-on-write clone.
   - Test migrations against the branch. If they succeed, apply to main.

3. **Manual pg_dump:**
   ```bash
   pg_dump "postgresql://user:pass@host/dbname?sslmode=require" > backup_$(date +%Y%m%d).sql
   ```

4. **Scheduled backups:** Set up a cron job or GitHub Action to run `pg_dump` on a regular schedule and upload the output to cloud storage (S3, GCS).

---

## 5. Deployment to Vercel

### 5.1 Install the Vercel CLI

```bash
npm i -g vercel
```

### 5.2 Link the Project

```bash
vercel link
```

Follow the prompts to:
1. Log in to your Vercel account.
2. Select or create a Vercel project.
3. Confirm the project root directory.

This creates a `.vercel/` directory with your project and org IDs.

### 5.3 Set Environment Variables

Add each required environment variable to Vercel:

```bash
vercel env add DATABASE_URL
vercel env add JWT_SECRET
vercel env add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
vercel env add CLOUDINARY_API_KEY
vercel env add CLOUDINARY_API_SECRET
```

For each command, you will be prompted to:
1. Enter the value.
2. Select which environments to apply it to (Production, Preview, Development).

Alternatively, set them all at once in the Vercel dashboard:
**Project Settings > Environment Variables**

### 5.4 Build Configuration

The build command is defined in `vercel.json`:

```json
{
  "buildCommand": "npx prisma generate && next build",
  "framework": "nextjs",
  "regions": ["bom1"]
}
```

- **`npx prisma generate`** runs before `next build` to generate the Prisma client.
- **`regions: ["bom1"]`** deploys serverless functions to Mumbai (closest to the UAE target audience). Change this if your database is in a different region.
- Headers are configured for the service worker (`/sw.js`) and manifest (`/manifest.json`).

> **Important:** Match the Vercel function region to your Neon database region to minimize latency. If your Neon project is in `aws-me-south-1` (Bahrain), `bom1` (Mumbai) is the closest Vercel region.

### 5.5 Deploy

**Preview deployment (from current branch):**

```bash
vercel
```

**Production deployment:**

```bash
vercel --prod
```

### 5.6 Custom Domain Setup

1. Go to the Vercel dashboard > your project > **Settings > Domains**.
2. Add your domain (e.g., `rtg.tcl.com`).
3. Vercel provides DNS records to configure:
   - **CNAME:** Point your domain to `cname.vercel-dns.com`.
   - Or use Vercel's nameservers for full DNS management.
4. SSL/TLS is provisioned automatically by Vercel (Let's Encrypt).
5. Wait for DNS propagation (usually 5-30 minutes).

### 5.7 Database Migrations in Production

After deploying new code with schema changes:

```bash
# Run from your local machine against the production DATABASE_URL
DATABASE_URL="postgresql://..." npx prisma migrate deploy
```

Or add it to your CI/CD pipeline before the Vercel build.

---

## 6. Cloudinary Setup

Cloudinary handles all media uploads (images and videos) in the admin portal, including hero slides, team logos, player photos, highlight videos, zone images, and prize images.

### 6.1 Create a Cloudinary Account

1. Sign up at <https://cloudinary.com>.
2. Note your **Cloud Name**, **API Key**, and **API Secret** from the dashboard.

### 6.2 Create an Unsigned Upload Preset

The admin portal uses client-side unsigned uploads via `next-cloudinary`. You must create an upload preset:

1. In the Cloudinary dashboard, go to **Settings > Upload**.
2. Scroll to **Upload presets** and click **Add upload preset**.
3. Set the following:
   - **Preset name:** `tcl_unsigned`
   - **Signing mode:** Unsigned
   - **Folder:** `tcl-rtg` (optional, for organization)
   - **Allowed formats:** `jpg, png, webp, gif, mp4, webm` (recommended)
4. Click **Save**.

### 6.3 Configure Environment Variables

Add these to your `.env` file (local) and Vercel environment variables (production):

```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your_api_secret_here
```

### 6.4 How Uploads Work in the Admin Portal

The admin portal uses the `CldUploadWidget` component from `next-cloudinary` in these pages:

| Admin Page | Upload Type | Path |
|---|---|---|
| Hero Slides (`/admin/hero-slides`) | Background images | `src/app/(admin)/admin/hero-slides/page.tsx` |
| Teams (`/admin/teams/[teamId]`) | Team logos, player photos | `src/app/(admin)/admin/teams/[teamId]/page.tsx` |
| Highlights (`/admin/highlights`) | Video clips, thumbnails | `src/app/(admin)/admin/highlights/page.tsx` |
| Prizes (`/admin/prizes`) | Prize images | `src/app/(admin)/admin/prizes/page.tsx` |
| Zone Schedule (`/admin/zone`) | Zone images | `src/app/(admin)/admin/zone/page.tsx` |

**Upload flow:**
1. Admin clicks an upload button in the admin UI.
2. The Cloudinary upload widget opens (browser-side).
3. The file is uploaded directly to Cloudinary using the `tcl_unsigned` preset.
4. Cloudinary returns a secure URL.
5. The admin portal saves the URL to the database via a server action or API call.

### 6.5 Image Optimization

The `next.config.ts` allows images from `res.cloudinary.com` via `remotePatterns`, enabling Next.js `<Image>` optimization for all Cloudinary-hosted media.

---

## 7. SMS/OTP Setup (Production)

### 7.1 Current Development Behavior

In development, OTP works as follows:

1. **`POST /api/auth/otp/start`**: Generates a random 6-digit code, stores it in the `OtpCode` table, and returns the code in the response body as `devCode`.
2. **`POST /api/auth/otp/verify`**: Checks the code against the database. Additionally, the code **`123456`** is always accepted as a hardcoded bypass.

No SMS is sent. The generated code is returned directly in the API response.

### 7.2 Twilio Verify Integration (Production)

To enable real SMS delivery in production:

1. **Create a Twilio account** at <https://www.twilio.com>.

2. **Create a Verify Service:**
   - Go to Twilio Console > Verify > Services.
   - Click "Create new".
   - Name it (e.g., "TCL RTG OTP").
   - Note the **Service SID** (starts with `VA`).

3. **Set environment variables:**
   ```
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_VERIFY_SERVICE_SID=VAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

4. **Modify `src/app/api/auth/otp/start/route.ts`** to call Twilio Verify instead of returning `devCode`:

   ```ts
   // Replace the dev response with:
   const twilio = require("twilio")(
     process.env.TWILIO_ACCOUNT_SID,
     process.env.TWILIO_AUTH_TOKEN
   );

   await twilio.verify.v2
     .services(process.env.TWILIO_VERIFY_SERVICE_SID)
     .verifications.create({ to: phone, channel: "sms" });

   return NextResponse.json({ success: true, message: "OTP sent" });
   // Do NOT return devCode in production
   ```

5. **Modify `src/app/api/auth/otp/verify/route.ts`** to:
   - Remove the `code !== "123456"` bypass on line 29.
   - Optionally verify via Twilio Verify's check API as a secondary validation.

### 7.3 CRITICAL: Remove the Dev Bypass

The following line in `src/app/api/auth/otp/verify/route.ts` (line 29) MUST be changed for production:

```ts
// BEFORE (dev mode -- accepts 123456 for any phone number):
if (!otpRecord && code !== "123456") {

// AFTER (production -- only accepts valid OTP records):
if (!otpRecord) {
```

Failing to remove this bypass means anyone can log in to any account (including SUPER_ADMIN) with the code `123456`.

---

## 8. Monitoring & Troubleshooting

### 8.1 Vercel Logs

- **Runtime logs:** Vercel Dashboard > your project > **Logs**. Filter by function name, status code, or time range.
- **Build logs:** Vercel Dashboard > your project > **Deployments** > click a deployment > **Build Logs**.
- **CLI access:**
  ```bash
  vercel logs <deployment-url>
  ```

### 8.2 Neon Dashboard

- **Query monitoring:** Neon Dashboard > your project > **Monitoring**. View active queries, connection count, and compute usage.
- **Connection pooling:** Neon uses PgBouncer by default. Your `DATABASE_URL` should use the pooled connection endpoint for production (port 5432, with `?sslmode=require`).

### 8.3 Common Errors and Solutions

#### Database Connection Errors

| Error | Cause | Solution |
|---|---|---|
| `ECONNREFUSED` / `Connection refused` | Database not running or wrong host | Verify `DATABASE_URL`. For local PG, ensure the service is running. For Neon, check the connection string in the dashboard. |
| `SSL connection is required` | Missing `?sslmode=require` | Add `?sslmode=require` to your `DATABASE_URL` for Neon. |
| `Too many clients already` | Connection pool exhausted | Use the Neon pooled endpoint. In the app, the singleton pattern in `src/lib/prisma.ts` prevents creating multiple clients in dev. |
| `relation "X" does not exist` | Migrations not applied | Run `npx prisma migrate deploy`. |

#### Build Failures

| Error | Cause | Solution |
|---|---|---|
| `Cannot find module '@prisma/client'` | Prisma client not generated | Ensure `vercel.json` `buildCommand` includes `npx prisma generate && next build`. |
| `Environment variable not found: DATABASE_URL` | Missing env var in Vercel | Add it via `vercel env add DATABASE_URL` or in the Vercel dashboard. |
| `Type error` during build | TypeScript strict mode | Fix the type error locally with `npm run build` before deploying. |
| `prisma.config.ts` not found | Wrong working directory | Ensure `prisma.config.ts` is in the project root. |

#### Authentication Errors

| Error | Cause | Solution |
|---|---|---|
| `Invalid or expired verification code` | OTP expired (5-minute TTL) or wrong code | Request a new OTP. In dev, use the `devCode` from the response or `123456`. |
| JWT errors / `JWSInvalid` | `JWT_SECRET` mismatch between environments | Ensure the same `JWT_SECRET` is used consistently. Changing it invalidates all existing sessions. |
| User has wrong role | Seeded data out of date | Check the user's `role` field in Prisma Studio. Update if needed. |

#### Cloudinary Errors

| Error | Cause | Solution |
|---|---|---|
| Upload widget does not appear | Wrong cloud name | Verify `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` matches your Cloudinary dashboard. |
| `Upload preset not found` | Missing upload preset | Create the `tcl_unsigned` preset in Cloudinary Settings > Upload. See [Section 6.2](#62-create-an-unsigned-upload-preset). |
| Images not loading | `remotePatterns` missing | Verify `res.cloudinary.com` is listed in `next.config.ts` `images.remotePatterns`. |

---

## 9. Updating & Maintenance

### 9.1 Updating Dependencies

```bash
# Check for outdated packages
npm outdated

# Update all dependencies (within semver ranges)
npm update

# Update a specific package to latest
npm install next@latest
```

After updating Prisma, always regenerate the client:

```bash
npm install prisma@latest @prisma/client@latest @prisma/adapter-pg@latest
npx prisma generate
```

### 9.2 Running New Migrations

When the schema changes:

```bash
# 1. Edit prisma/schema.prisma
# 2. Create migration
npx prisma migrate dev --name describe_your_change

# 3. Test locally
npm run dev

# 4. Deploy to production
vercel --prod

# 5. Apply migration to production database
DATABASE_URL="<production-url>" npx prisma migrate deploy
```

### 9.3 Adding New Admin Users

**Option A: Prisma Studio**

```bash
npx prisma studio
```

1. Navigate to the `User` table.
2. Click "Add record".
3. Set:
   - `phone`: the admin's phone number (e.g., `+971501234567`)
   - `role`: `SUPER_ADMIN` or `ADMIN`
   - `isVerified`: `true`
   - `name`: the admin's name
4. Click "Save".

The new admin can now log in with their phone number and the OTP flow.

**Option B: Script**

```bash
npx tsx -e "
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
prisma.user.create({
  data: { phone: '+971501234567', name: 'New Admin', role: 'SUPER_ADMIN', isVerified: true }
}).then(u => { console.log('Created:', u.id); prisma.\$disconnect(); });
"
```

### 9.4 Updating Seed Data

Edit `prisma/seed.ts` to add or modify seed records. The seed uses `upsert` operations, so existing records are not duplicated:

```bash
# Re-run seed (safe -- idempotent)
npx prisma db seed
```

To completely reset and re-seed:

```bash
# WARNING: Drops all data
npx prisma migrate reset
```

### 9.5 Cache Invalidation

The app uses Next.js `revalidatePath` for on-demand cache invalidation in server actions. When admin updates data (e.g., match scores, hero slides), the relevant pages are automatically revalidated.

To manually force revalidation of all pages after a data change:

- Re-deploy the app: `vercel --prod` (rebuilds all static pages).
- Or call `revalidatePath("/")` from a server action to invalidate the homepage and its descendants.

### 9.6 Database Schema Changes Checklist

1. Edit `prisma/schema.prisma`.
2. Run `npx prisma migrate dev --name <name>` locally.
3. Test thoroughly with `npm run dev`.
4. Commit the generated migration SQL file in `prisma/migrations/`.
5. Push to your repository.
6. Deploy to Vercel: `vercel --prod`.
7. Run `npx prisma migrate deploy` against the production database.

---

## 10. Security Checklist

Complete every item before going to production.

### 10.1 Authentication & Secrets

- [ ] **Change `JWT_SECRET`** to a cryptographically random string (64+ characters). Generate one with:
  ```bash
  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
  ```
- [ ] **Remove the dev OTP bypass.** In `src/app/api/auth/otp/verify/route.ts`, change line 29 from:
  ```ts
  if (!otpRecord && code !== "123456") {
  ```
  to:
  ```ts
  if (!otpRecord) {
  ```
- [ ] **Remove `devCode` from the OTP start response.** In `src/app/api/auth/otp/start/route.ts`, remove the `devCode: code` field from the JSON response and replace it with actual Twilio SMS sending.
- [ ] **Set Twilio environment variables** (`TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_VERIFY_SERVICE_SID`) so OTPs are delivered via SMS.

### 10.2 Infrastructure

- [ ] **HTTPS only.** Vercel enforces HTTPS by default. No action needed unless using a custom proxy.
- [ ] **Neon SSL.** Ensure `?sslmode=require` is in your `DATABASE_URL`. Neon rejects non-SSL connections by default.
- [ ] **Enable Vercel Deployment Protection.** Go to Vercel Dashboard > Project Settings > Deployment Protection. Enable "Standard Protection" to require authentication for preview deployments.
- [ ] **Restrict Vercel environment variable scopes.** Set production-only secrets (e.g., `TWILIO_AUTH_TOKEN`) to the Production environment only, not Preview or Development.

### 10.3 Cloudinary

- [ ] **Restrict the upload preset.** In Cloudinary settings, limit the `tcl_unsigned` preset:
  - Set maximum file size (e.g., 10 MB for images, 100 MB for video).
  - Restrict allowed resource types to `image` and `video`.
  - Optionally enable eager transformations for consistent sizing.

### 10.4 Database

- [ ] **Rotate the Neon database password** if it was ever shared or committed to version control.
- [ ] **Enable Neon IP Allow List** (paid plan) to restrict database access to Vercel's IP ranges.
- [ ] **Audit the `User` table** to confirm no unintended `SUPER_ADMIN` or `ADMIN` accounts exist.

### 10.5 Application

- [ ] **Review `next.config.ts` `remotePatterns`** and remove any image hostnames you do not actually use.
- [ ] **Run `npm audit`** and resolve any critical or high vulnerabilities.
- [ ] **Enable Vercel Web Analytics and Speed Insights** for production monitoring.

---

## Quick Reference: Key Commands

```bash
# Local development
npm run dev                        # Start dev server (http://localhost:3000)
npm run build                      # Production build locally
npm run lint                       # Run ESLint

# Database
npx prisma migrate dev --name X   # Create + apply migration (dev)
npx prisma migrate deploy         # Apply pending migrations (prod)
npx prisma db seed                # Run seed script
npx prisma migrate reset          # Drop + recreate + seed (dev only)
npx prisma studio                 # Visual database browser
npx prisma generate               # Regenerate Prisma client

# Deployment
vercel link                        # Link local project to Vercel
vercel env add VAR_NAME            # Add environment variable
vercel                             # Preview deployment
vercel --prod                      # Production deployment
vercel logs <url>                  # View runtime logs
```
