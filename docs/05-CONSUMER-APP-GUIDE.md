# TCL x Arsenal Road to Greatness 2026 — Consumer App User Guide

> **Your complete guide to the TCL x Arsenal Road to Greatness mobile app.**
> Everything you need to follow the tournament, track your team, and experience the action — all from your phone.

---

## Table of Contents

- [Getting the App](#getting-the-app)
- [Home Page](#home-page)
- [Matches](#matches)
- [Standings](#standings)
- [Teams](#teams)
- [FAQ](#faq)
- [Highlights](#highlights)
- [Prize — Road to London](#prize--road-to-london)
- [The Zone](#the-zone)
- [Notifications](#notifications)
- [Registration & Captain Portal](#registration--captain-portal)
- [Login](#login)
- [Navigation](#navigation)
- [Tips & Tricks](#tips--tricks)

---

## Getting the App

The TCL x Arsenal Road to Greatness app is a **Progressive Web App (PWA)** — no app store download required.

### How to Install

1. **Open your browser** on your phone (Safari on iPhone, Chrome on Android)
2. **Navigate to:** [https://tcl-app.vercel.app](https://tcl-app.vercel.app)
3. **Add to your Home Screen:**

   **iPhone / iPad (Safari):**
   - Tap the **Share** button (square with arrow pointing up) at the bottom of the screen
   - Scroll down and tap **"Add to Home Screen"**
   - Tap **"Add"** in the top-right corner
   - The app icon will appear on your home screen

   **Android (Chrome):**
   - Tap the **three-dot menu** (top-right corner)
   - Tap **"Install app"** or **"Add to Home Screen"**
   - Tap **"Install"** to confirm
   - The app will appear in your app drawer and home screen

4. **Launch the app** from your home screen — it opens full-screen, just like a native app

### Offline Support

The app works offline for basic browsing. Previously loaded pages (matches, standings, teams) will remain accessible even without an internet connection. Live data (scores, notifications) requires an active connection.

---

## Home Page

The home page is your central hub for everything Road to Greatness. It is designed as a cinematic, scroll-based experience.

### Hero Carousel

At the top of the page, a **full-screen hero carousel** rotates through 6 slides every 6 seconds:

- **Road to Greatness** — Main tournament announcement with registration CTA
- **TCL x Arsenal** — Global partnership spotlight
- **Bukayo Saka** — Arsenal's #7 as TCL brand ambassador
- **Mini LED Brilliance** — TCL flagship TV showcase
- **Inspire Greatness** — TCL x UAE community spotlight
- **Road to London** — The grand prize announcement

Each slide features a background image, headline, description, and two call-to-action buttons. You can tap the **dot indicators** at the top to jump to any slide, or let them auto-rotate.

A **live countdown timer** at the bottom of the hero shows the time remaining until kickoff (April 26, 2026 at 10:00 AM UAE time).

### Featured Squads Spotlight

Scroll down to see a **horizontal card carousel** of featured teams. Each card shows:

- Team photo from the 2025 tournament
- Group assignment (e.g., Group A)
- Team name and bio
- Win record and goals scored

Tap any team card to visit their full team profile.

### Arsenal Stars Section

A horizontal scroll of **Arsenal player profile cards** featuring:

- **Bukayo Saka** (#7, Winger)
- **Martin Odegaard** (#8, Captain / CAM)
- **William Saliba** (#2, Centre-Back)
- **Declan Rice** (#41, Midfielder)
- **Kai Havertz** (#29, Forward)
- **David Raya** (#1, Goalkeeper)

Below the player cards, a **campaign banner** showcases the TCL x Bukayo Saka "Inspire Greatness, Together" partnership.

### Season Documentary / Highlights Reel

A cinematic video section with:

- **Featured highlight** — Full 2025 season recap (2:34) with play button
- **Highlight reel** — Horizontal scroll of video cards (Champions Crowned, Night Match Drama, Skills Challenge, Award Ceremony)

### TCL x Arsenal Partnership

An immersive section showcasing the global partnership:

- Official "Inspire Greatness" campaign banner
- Scrollable gallery of real campaign photography (stadium activations, LED boards, fan events, player meet & greets)
- Feature cards for Emirates Stadium, Fly to London, Arsenal Coaches, and TCL Mini LED

### TCL Mini LED TV Showcase

A product showcase section for the **TCL C955 QD-Mini LED TV** — the official screen of Road to Greatness:

- Flagship 2026 product card with specs
- Technical specifications: 5,000+ dimming zones, 144Hz refresh, 98" screen, 4K resolution, HDR 10+

### The Zone Preview

Four experience cards linking to the Indoor Zone page:

- **TCL Lounge** — Mini LED Showcase
- **Skills Zone** — Test Your Game
- **Precision** — Shooting Drill
- **Reaction** — Agility Test

### Match Day Section

- **Group A standings table** with a "View All Groups" link
- **Upcoming match cards** showing the next 2 matches
- Quick link to the full match schedule

### Quick Links & Additional Sections

Further down the home page:

- **Quick links grid** for all major sections (Matches, Standings, Teams, Zone, Prize, Highlights, FAQ)
- **Grand Prize** section with Road to London details
- **FAQ preview** showing the top 3 frequently asked questions

---

## Matches

**Path:** `/matches`

The Matches page shows the **complete tournament schedule** of all 31 matches across both match days (April 26-27, 2026).

### Tournament Overview

- **Dates:** April 26-27, 2026
- **Times:** 12:00 PM - 6:50 PM (Dubai time)
- **Total matches:** 31 (group stage + knockout rounds)

### Filtering Matches

**Stage Filters** — Three buttons at the top:

| Filter | What It Shows |
|--------|---------------|
| **All Matches** | Every match in the tournament |
| **Group Stage** | Only group stage matches |
| **Knockout** | Quarterfinals, Semifinals, and Final |

**Time Slot Filters** — Scrollable chips below the stage filters:

- 12:00 PM, 12:40 PM, 1:20 PM, 2:00 PM, 2:40 PM, 3:20 PM, 4:10 PM, 5:00 PM, 6:00 PM
- Tap a time slot to show only matches at that time
- Tap the same time slot again to clear the filter

### Match Cards

Each match is displayed as a card grouped by time slot. Cards show:

- Both team names and colors
- Match number and pitch assignment
- Stage label (Group, QF, SF, Final)
- Score (once the match has been played)
- Match status (upcoming, live, completed)

**Tap any match card** to open the full **Match Detail** page.

### Match Detail Page

When you tap a match, you see:

- Both team crests and names
- Scoreline (if played)
- Match stage and group information
- Date, time, and pitch assignment
- Match events (goals, cards, substitutions)
- Team lineups

### Summary Bar

At the bottom of the matches page, a summary bar shows:

- **Total** matches count
- **Group** stage match count (in red)
- **Knockout** match count (in gold)

---

## Standings

**Path:** `/standings`

Track every team's progress through the tournament.

### Group Tables

Four group tables are displayed (Groups A, B, C, D), each showing:

| Column | Meaning |
|--------|---------|
| **Team** | Team name with color badge |
| **P** | Played (matches completed) |
| **W** | Wins |
| **D** | Draws |
| **L** | Losses |
| **GD** | Goal Difference (goals scored minus goals conceded) |
| **Pts** | Points (3 for a win, 1 for a draw, 0 for a loss) |

The top 2 teams in each group (highlighted in red) advance to the knockout stage.

### Knockout Bracket

Below the group tables, the **Knockout Bracket** shows the tournament pathway:

**Quarterfinals:**
- QF1: A1 vs B2
- QF2: B1 vs A2
- QF3: C1 vs D2
- QF4: D1 vs C2

**Semifinals:**
- SF1: Winner of QF1 vs Winner of QF2
- SF2: Winner of QF3 vs Winner of QF4

**The Final:**
- Winner of SF1 vs Winner of SF2
- April 27, 2026 at 6:00 PM on Pitch A
- The winner earns the **Road to London** prize

---

## Teams

**Path:** `/teams`

Browse all **16 teams** competing in the tournament.

### Team Directory

- **Search bar** at the top — search teams by name or short name
- **Team cards** displayed in a 2-column grid
- Each card shows: team color badge, team name, and group assignment
- Badge showing "16" total teams

### Team Detail Page

**Path:** `/teams/[teamId]`

Tap any team to see their full profile:

- **Team header** with name, color badge, and group assignment
- **Squad roster** — Full list of players with names and positions
- **Group standings** — The team's current position in their group
- **Follow Team** button to stay updated on their matches

Use the **back arrow** to return to the full team list.

---

## FAQ

**Path:** `/faq`

Find answers to common questions about the tournament.

### How It Works

Questions are organized by **category**:

- **General** — Tournament overview, dates, format
- **Registration** — How to register, deadlines, requirements
- **Match Day** — Rules, schedule, what to bring
- **Indoor Zone** — Activities, access, timing

### Using the FAQ

- Each question appears as an **expandable accordion**
- Tap any question to reveal the answer
- Tap again to collapse it
- Only one answer is shown at a time for easy reading

---

## Highlights

**Path:** `/highlights`

Watch tournament highlights, goals, and memorable moments.

### Filter by Category

Four filter buttons at the top:

| Filter | Content |
|--------|---------|
| **All** | Everything |
| **Goals** | Goal highlights |
| **Saves** | Goalkeeper saves |
| **Celebrations** | Team celebrations |

### Featured Highlight

The top highlight is displayed as a **large card** with:

- Video thumbnail (aspect ratio 16:9)
- Play button overlay
- Title and description

### Highlight Grid

Below the featured highlight, remaining highlights are shown in a **2-column grid**:

- Video thumbnail with play button
- Duration badge (e.g., "1:24")
- Title and category label

### Follow Us

At the bottom of the page, links to social media channels:

- **Instagram**
- **TikTok**
- **X (Twitter)**
- **YouTube**

---

## Prize — Road to London

**Path:** `/prize`

Learn about the grand prize — an all-expenses-paid trip to London for the winning team.

### What the Winners Get

| Prize | Details |
|-------|---------|
| **Emirates Stadium** | Exclusive behind-the-scenes access |
| **Arsenal Coaches** | Training sessions with the pros |
| **Arsenal Legends** | Meet and greet with club icons |
| **Stadium Tour** | Full VIP stadium experience |
| **3-Day London Trip** | All-expenses-paid for the entire squad |

### The Journey Visualization

A timeline visualization showing the path to the prize:

1. **Group Stage** — 16 teams, 4 groups
2. **Quarterfinals** — Top 8 battle it out
3. **Semifinals & Final** — The road narrows
4. **London Bound** — Champions fly to Arsenal

---

## The Zone

**Path:** `/zone`

The Indoor Zone is an immersive activation space running alongside the tournament.

### Opening Time

The Zone opens from the **Quarterfinals onwards** at **7:30 PM**.

### Activities

Activities are displayed in a 2-column grid, each showing:

- Category icon (Gaming, Photography, Hospitality, Screening)
- Activity title
- Location within the venue

Activities include:

- **Gaming Zone** — Interactive gaming experiences
- **Photo Booth** — Get your tournament photo taken
- **F&B Lounge** — Food and beverage area
- **Match Screening** — Watch matches on TCL Mini LED TVs

### Live Countdown

At the bottom of the page, a **live countdown timer** shows the time remaining until the next screening begins (7:30 PM in the Main Hall). The countdown updates every second in real-time.

---

## Notifications

**Path:** `/notifications`

Stay updated on everything happening at the tournament.

### Accessing Notifications

- Tap the **bell icon** in the top-right corner of the header
- A **red dot** on the bell indicates unread notifications

### Notification Types

Each notification has an icon indicating its type:

| Icon | Category | Examples |
|------|----------|---------|
| Radio (red) | **Match** | Score updates, match starting soon, final results |
| Zap (yellow) | **Zone** | Zone opening, activity announcements |
| Info (gray) | **General** | Tournament announcements, schedule changes |
| Bell (green) | **Application** | Registration status, team updates |

### Reading Notifications

- **Unread notifications** have a highlighted background and a blue dot
- Each notification shows: title, message preview, and time ago (e.g., "5m ago", "2h ago")
- Tap **"Mark all read"** (top-right) to clear all unread indicators

---

## Registration & Captain Portal

### Team Application

**Path:** `/apply`

A **4-step application form** to enter the tournament:

**Step 1 — Personal Information:**
- Full name
- Mobile number
- Email address
- Area (Dubai, Abu Dhabi, Sharjah, Ajman, RAK, Fujairah, UAQ)

**Step 2 — Team Information:**
- Team name
- Team type (Community, Academy, Friends, Corporate)
- Squad size (5-15 players)
- Instagram / TikTok handle

**Step 3 — Additional Details:**
- How did you hear about us?
- Source detail
- Highlight link (optional video)
- Why should your team be selected?

**Step 4 — Review & Submit:**
- Review all entered information
- Accept tournament rules and terms
- Submit application

After submission, you receive a **reference number** (format: `TCL-XXXXXXX`) and a summary of next steps:
- Application reviewed within 5-7 business days
- SMS notification with status update
- Shortlisted teams invited to complete roster details

### Team Registration

**Path:** `/register`

The full team registration flow for accepted teams:

- Captain details (name, email, mobile, city/emirate)
- Player roster (full name, date of birth, Emirates ID, passport number, UK visa status)
- Team name and information

### Captain Dashboard (My Team)

**Path:** `/my-team`

Once your team is registered, the captain gets a dedicated dashboard:

**Team Identity Card:**
- Team name and group assignment
- Next upcoming match
- Captain Dashboard label

**Setup Checklist** — Track your preparation progress:

| Task | Status |
|------|--------|
| **Roster** | Progress bar (e.g., 3/8 players added) |
| **Kit Sizes** | Submit sizes for all players |
| **Participation Agreement** | Must be signed before the tournament |
| **Check-in Instructions** | Available after confirmation |

**Quick Actions:**
- **Edit Roster** — Add or modify players
- **Submit Kit Sizes** — Enter sizes for all squad members
- **Sign Agreement** — Complete the participation agreement
- **Share Team** — Share your team page via your phone's native share menu

### Captain Sub-Pages

- **Roster** (`/my-team/roster`) — Manage player list
- **Kit Sizes** (`/my-team/kit-sizes`) — Submit shirt sizes for all players
- **Agreements** (`/my-team/agreements`) — Sign the participation agreement

### Application Status

**Path:** `/status`

Check the current status of your team's application at any time.

### Fan Interest Registration

**Path:** `/fan-interest`

Not playing but want to stay connected? Register as a fan:

- Enter your name, contact, and area of interest
- Receive updates on fixtures, highlights, and event news

---

## Login

**Path:** `/login`

The app uses a **passwordless login** system via SMS OTP (One-Time Password).

### How to Sign In

1. **Enter your phone number**
   - The UAE country code (+971) is pre-filled
   - Enter your mobile number (e.g., 50 123 4567)

2. **Tap "Send OTP"**
   - A 6-digit code is sent to your phone via SMS

3. **Enter the 6-digit code**
   - Type the code in the verification field
   - The code appears in large, spaced digits for easy entry

4. **Tap "Verify"**
   - If correct, you are signed in and redirected to the Captain Dashboard

### Resending the Code

- After sending an OTP, there is a **60-second cooldown** before you can resend
- The countdown timer shows: "Resend code in XXs"
- Once the timer expires, tap **"Resend code"** to get a new OTP

### Why No Password?

The app uses OTP-based authentication for simplicity — no passwords to remember, no accounts to create. Just your phone number.

---

## Navigation

### Bottom Navigation Bar

The bottom of the screen has a fixed navigation bar with 5 tabs:

| Tab | Icon | Destination |
|-----|------|-------------|
| **Home** | House | Home page |
| **Matches** | Trophy | Tournament schedule |
| **Register** | Plus (red accent) | Team registration |
| **Standings** | Award | Group standings |
| **Teams** | Users | Team directory |

The active tab is highlighted in **TCL Red** with a top indicator line.

> Note: The bottom navigation bar is hidden on the Registration page to provide a distraction-free form experience.

### Header

The header is always visible at the top with:

- **TCL x Arsenal logo** (left) — Tap to return to the Home page
- **"Road to Greatness"** label
- **Bell icon** (right) — Tap to view Notifications. A red dot indicates unread notifications.

### More Menu

Additional sections are accessible through the home page quick links or deep links:

- Matches, Standings, Teams, Zone, Prize, Watch (Highlights), Alerts (Notifications), FAQ, My Team

---

## Tips & Tricks

- **Swipe horizontally** on card carousels to see more content (teams, highlights, partnership gallery)
- **Pull down to refresh** any page to get the latest data
- **Offline access** — Previously loaded pages are cached and available without internet
- **Add to Home Screen** for the best full-screen experience
- **Share** your team page or match results using your phone's native share function
- **Countdown timer** on the home page updates live — check back to track the days until kickoff
- The app is optimized for **mobile screens** — it looks best on phones with its dark theme and cinematic design

---

*TCL x Arsenal Road to Greatness 2026 — The UAE's premier grassroots 5-a-side tournament. April 26-27, 2026.*
