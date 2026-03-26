# TCL × Arsenal Road to Greatness 2026 — Quick Start Guide

> Get up and running in under 10 minutes.

---

## Live URLs

| Environment | URL |
|-------------|-----|
| **Production App** | https://tcl-app.vercel.app |
| **Admin Portal** | https://tcl-app.vercel.app/admin |
| **GitHub Repository** | https://github.com/nkhank1991/tcl-rtg-2026 |
| **Vercel Dashboard** | https://vercel.com/egl/tcl-app |
| **Neon Database** | https://console.neon.tech |

---

## Default Credentials

| Role | Phone | OTP Code |
|------|-------|----------|
| **Super Admin** | +971500000000 | 123456 (dev bypass) |
| **New Fan** | Any valid phone | 123456 (dev bypass) |

> **Production Warning**: Remove the dev bypass code "123456" in `src/app/api/auth/otp/verify/route.ts` before going live.

---

## Local Development Setup

```bash
# 1. Clone the repository
git clone https://github.com/nkhank1991/tcl-rtg-2026.git
cd tcl-rtg-2026

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your DATABASE_URL, JWT_SECRET, Cloudinary keys

# 4. Run database migration
npx prisma migrate deploy

# 5. Seed the database
npx prisma db seed

# 6. Start development server
npm run dev

# 7. Open http://localhost:3000
```

---

## Key Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (port 3000) |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npx prisma studio` | Open database GUI |
| `npx prisma migrate dev` | Create new migration |
| `npx prisma migrate deploy` | Apply pending migrations |
| `npx prisma db seed` | Seed database with sample data |
| `npx vercel --prod` | Deploy to production |
| `npx vercel env ls` | List Vercel env vars |

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | Yes | Secret for signing JWT tokens |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Yes | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Yes | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Yes | Cloudinary API secret |
| `TWILIO_ACCOUNT_SID` | No | Twilio SID for real SMS |
| `TWILIO_AUTH_TOKEN` | No | Twilio auth token |
| `TWILIO_VERIFY_SERVICE_SID` | No | Twilio Verify service |

---

## Project Structure Overview

```
tcl-app/
├── prisma/
│   ├── schema.prisma          # 27+ database models
│   ├── seed.ts                # Sample data seeder
│   └── migrations/            # SQL migrations
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── sw.js                  # Service worker
│   ├── offline.html           # Offline fallback
│   └── icons/                 # PWA icons (192, 512, maskable)
├── src/
│   ├── app/
│   │   ├── (admin)/admin/     # Admin portal (16 pages)
│   │   ├── (site)/            # Consumer app (10+ pages)
│   │   └── api/               # API routes (46 endpoints)
│   ├── components/            # React components
│   │   ├── admin/             # Admin UI components
│   │   ├── layout/            # Header, nav, splash
│   │   ├── matches/           # Match cards, filters
│   │   └── ui/                # Base UI components
│   ├── lib/                   # Auth, Prisma, utilities
│   ├── providers/             # Auth + Query providers
│   └── types/                 # TypeScript interfaces
├── .env.example               # Environment template
├── vercel.json                # Deployment config
└── package.json               # Dependencies
```

---

## Documentation Index

| # | Document | Audience | Description |
|---|----------|----------|-------------|
| 00 | **Quick Start** (this file) | Everyone | Get running in 10 minutes |
| 01 | **Technical Architecture** | Developers | System design, tech stack, database schema |
| 02 | **API Reference** | Developers | All 46 API endpoints with request/response shapes |
| 03 | **Operations Manual** | DevOps | Deployment, monitoring, maintenance |
| 04 | **Admin User Guide** | Ops Team | How to use the admin portal (non-technical) |
| 05 | **Consumer App Guide** | Fans/Users | How to use the fan-facing app |
| 06 | **Project Journey** | Educational | How the project was built, decisions, challenges |

---

## Tech Stack At a Glance

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 16.2.1 |
| Language | TypeScript | 5.x |
| UI Library | React | 19.2.4 |
| Styling | Tailwind CSS | 4.x |
| Database | PostgreSQL (Neon) | 16 |
| ORM | Prisma | 7.5.0 |
| Auth | JWT (jose) | 6.2.2 |
| Data Fetching | TanStack Query | 5.95.2 |
| Media | Cloudinary | next-cloudinary 6.17 |
| UI Primitives | Radix UI | Latest |
| Icons | Lucide React | 1.7.0 |
| Validation | Zod | 4.3.6 |
| Hosting | Vercel | Serverless |
| PWA | Custom SW + Manifest | — |

---

## Support & Links

- **Report Issues**: Create a GitHub issue at the repository
- **Vercel Docs**: https://vercel.com/docs
- **Neon Docs**: https://neon.tech/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Next.js Docs**: https://nextjs.org/docs
