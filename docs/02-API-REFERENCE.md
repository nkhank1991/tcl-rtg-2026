# API Reference & Database Schema

**TCL x Arsenal Road to Greatness 2026**

> Complete reference for every API endpoint and the full Prisma/PostgreSQL database schema.
> Base URL in development: `http://localhost:3000`

---

## Table of Contents

1. [Public API Endpoints](#part-1-public-api-endpoints)
2. [Authentication API](#part-2-authentication-api)
3. [Admin API Endpoints](#part-3-admin-api-endpoints)
4. [Database Schema](#part-4-database-schema)

---

## Part 1: Public API Endpoints

These endpoints require **no authentication** (except where noted) and power the fan-facing mobile/web experience.

### Endpoint Summary

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/campaign` | Current campaign state |
| GET | `/api/matches` | List matches (filterable) |
| GET | `/api/matches/:matchId` | Single match detail |
| GET | `/api/standings` | Group standings |
| GET | `/api/teams` | All teams |
| GET | `/api/teams/:teamId` | Single team detail |
| GET | `/api/faq` | FAQ items |
| GET | `/api/highlights` | Highlight reels |
| GET | `/api/prize` | Prize packages |
| GET | `/api/zone` | Fan Zone schedule |
| GET | `/api/bracket` | Knockout bracket |
| GET | `/api/notifications` | User notifications (auth) |

---

### GET `/api/campaign`

Returns the first (current) campaign record.

**Response `200`**
```json
{
  "campaign": {
    "id": "cuid",
    "slug": "road-to-greatness-2026",
    "title": "Road to Greatness",
    "tagline": "Inspire It. Dream It. Do It.",
    "state": "PRE_LAUNCH",
    "heroImageUrl": "https://...",
    "startDate": "2026-03-26T00:00:00.000Z",
    "endDate": "2026-03-28T00:00:00.000Z",
    "config": {},
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

`campaign` will be `null` if no campaign exists.

---

### GET `/api/matches`

Returns all matches, with optional query-parameter filters.

**Query Parameters**

| Param | Type | Description |
|-------|------|-------------|
| `status` | `LIVE` \| `UPCOMING` \| `COMPLETED` | Convenience alias (see mapping below) |
| `stage` | `MatchStage` enum | Filter by tournament stage |

Status mapping:
- `LIVE` -- matches with status in `[LIVE_FIRST_HALF, HALF_TIME, LIVE_SECOND_HALF]`
- `UPCOMING` -- matches with status `SCHEDULED`
- `COMPLETED` -- matches with status in `[COMPLETED, FULL_TIME]`

**Response `200`**
```json
{
  "matches": [
    {
      "id": "cuid",
      "eventDayId": "cuid",
      "groupId": "cuid",
      "pitchId": "cuid",
      "homeTeamId": "cuid",
      "awayTeamId": "cuid",
      "matchNumber": 1,
      "stage": "GROUP",
      "status": "SCHEDULED",
      "scheduledAt": "2026-03-26T10:00:00.000Z",
      "startedAt": null,
      "endedAt": null,
      "homeTeam": { "id": "...", "name": "...", ... },
      "awayTeam": { "id": "...", "name": "...", ... },
      "score": { "homeGoals": 0, "awayGoals": 0, ... },
      "pitch": { "id": "...", "name": "Pitch 1", ... },
      "group": { "id": "...", "name": "Group A", ... },
      "events": [ { "id": "...", "type": "GOAL", "minute": 23, ... } ]
    }
  ]
}
```

---

### GET `/api/matches/:matchId`

Returns a single match by ID with all related data.

**Path Parameters**

| Param | Type | Description |
|-------|------|-------------|
| `matchId` | `string` | Match CUID |

**Response `200`**
```json
{
  "match": {
    "id": "...",
    "homeTeam": { ... },
    "awayTeam": { ... },
    "score": { ... },
    "pitch": { ... },
    "group": { ... },
    "events": [ ... ]
  }
}
```

**Response `404`**
```json
{ "error": "Match not found" }
```

---

### GET `/api/standings`

Returns all groups with their standings and teams, ordered by group order then position.

**Response `200`**
```json
{
  "groups": [
    {
      "id": "cuid",
      "name": "Group A",
      "order": 0,
      "teams": [ { "id": "...", "name": "...", ... } ],
      "standings": [
        {
          "id": "cuid",
          "groupId": "...",
          "teamId": "...",
          "played": 3,
          "won": 2,
          "drawn": 1,
          "lost": 0,
          "goalsFor": 7,
          "goalsAgainst": 2,
          "goalDifference": 5,
          "points": 7,
          "position": 1,
          "lastUpdated": "...",
          "team": { "id": "...", "name": "...", ... }
        }
      ]
    }
  ]
}
```

---

### GET `/api/teams`

Returns all teams with their group and player roster.

**Response `200`**
```json
{
  "teams": [
    {
      "id": "cuid",
      "name": "Team Alpha",
      "shortName": "ALP",
      "logoUrl": "https://...",
      "primaryColor": "#FF0000",
      "groupId": "cuid",
      "captainId": "cuid",
      "seed": 1,
      "bio": "...",
      "source": "open_trial",
      "createdAt": "...",
      "group": { "id": "...", "name": "Group A", ... },
      "players": [
        { "id": "...", "name": "...", "position": "MF", "number": 10, ... }
      ]
    }
  ]
}
```

---

### GET `/api/teams/:teamId`

Returns a single team with group, players, and standings.

**Path Parameters**

| Param | Type | Description |
|-------|------|-------------|
| `teamId` | `string` | Team CUID |

**Response `200`**
```json
{
  "team": {
    "id": "...",
    "name": "...",
    "group": { ... },
    "players": [ ... ],
    "standings": [
      {
        "id": "...",
        "played": 3,
        "points": 7,
        "position": 1,
        "group": { "id": "...", "name": "Group A" }
      }
    ]
  }
}
```

**Response `404`**
```json
{ "error": "Team not found" }
```

---

### GET `/api/faq`

Returns all FAQ items ordered by `order` ascending.

**Response `200`**
```json
{
  "items": [
    {
      "id": "cuid",
      "question": "How do I register?",
      "answer": "Visit the registration page...",
      "category": "registration",
      "order": 0
    }
  ]
}
```

---

### GET `/api/highlights`

Returns all highlights ordered by `publishedAt` descending (newest first).

**Response `200`**
```json
{
  "highlights": [
    {
      "id": "cuid",
      "title": "Best Goals - Day 1",
      "description": "...",
      "mediaUrl": "https://...",
      "mediaType": "video",
      "thumbnailUrl": "https://...",
      "matchId": "cuid",
      "category": "goals",
      "order": 0,
      "publishedAt": "2026-03-26T18:00:00.000Z"
    }
  ]
}
```

---

### GET `/api/prize`

Returns all prize packages ordered by `order` ascending.

**Response `200`**
```json
{
  "prizes": [
    {
      "id": "cuid",
      "title": "Grand Prize",
      "description": "...",
      "imageUrl": "https://...",
      "value": "AED 50,000",
      "tier": "GRAND",
      "order": 0
    }
  ]
}
```

---

### GET `/api/zone`

Returns the Fan Zone schedule with a top-level status and screening time.

**Response `200`**
```json
{
  "status": "UPCOMING",
  "screeningTime": "2026-03-26T19:30:00Z",
  "items": [
    {
      "id": "cuid",
      "title": "DJ Set",
      "description": "...",
      "imageUrl": "https://...",
      "location": "Main Stage",
      "startTime": "2026-03-26T16:00:00.000Z",
      "endTime": "2026-03-26T17:30:00.000Z",
      "status": "UPCOMING",
      "category": "entertainment",
      "capacity": 500,
      "order": 0
    }
  ]
}
```

---

### GET `/api/bracket`

Returns the knockout bracket tree.

**Response `200`**
```json
{
  "bracket": [
    {
      "id": "cuid",
      "stage": "QUARTER_FINAL",
      "position": 1,
      "teamId": "cuid",
      "team": { "id": "...", "name": "..." },
      "winnerId": null,
      "winner": null,
      "matchId": "cuid",
      "parentNodeId": "cuid",
      "label": "QF1",
      "createdAt": "..."
    }
  ]
}
```

Ordered by `stage` ascending, then `position` ascending.

---

### GET `/api/notifications`

Returns notifications for the authenticated user. If no session exists, returns an empty array (does **not** return 401).

**Authentication:** Session cookie (optional -- degrades gracefully)

**Response `200`**
```json
{
  "notifications": [
    {
      "id": "cuid",
      "userId": "cuid",
      "title": "Match Starting Soon",
      "body": "Your favorite team plays in 15 minutes!",
      "category": "match",
      "data": { "matchId": "cuid" },
      "isRead": false,
      "createdAt": "2026-03-26T09:45:00.000Z"
    }
  ]
}
```

---

## Part 2: Authentication API

Authentication uses phone-based OTP. Sessions are stored as signed JWT cookies.

### Endpoint Summary

| Method | URL | Description |
|--------|-----|-------------|
| POST | `/api/auth/otp/start` | Request an OTP code |
| POST | `/api/auth/otp/verify` | Verify OTP and create session |
| GET | `/api/auth/me` | Get current authenticated user |
| POST | `/api/auth/logout` | Clear session cookie |

---

### POST `/api/auth/otp/start`

Generates a 6-digit OTP code, stores it in the database (5-minute expiry), and sends it via SMS (in production). In development, the code is returned in the response.

**Request Body**
```json
{
  "phone": "+971501234567"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `phone` | `string` | Yes | Minimum 8 characters |

**Response `200`**
```json
{
  "success": true,
  "message": "OTP sent",
  "devCode": "482917"
}
```

> `devCode` is only present in development builds. In production, the OTP is sent via SMS only.

**Response `400`**
```json
{ "success": false, "message": "Invalid phone number" }
```

**Response `500`**
```json
{ "success": false, "message": "Internal server error" }
```

---

### POST `/api/auth/otp/verify`

Verifies the OTP code, creates or finds the user, signs a JWT, and sets a `session` cookie.

**Request Body**
```json
{
  "phone": "+971501234567",
  "code": "482917"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `phone` | `string` | Yes | Must be non-empty |
| `code` | `string` | Yes | Exactly 6 digits |

> Dev bypass: code `123456` is always accepted.

**Response `200`** (+ `Set-Cookie: session=<jwt>`)
```json
{
  "success": true,
  "user": {
    "id": "cuid",
    "phone": "+971501234567",
    "name": null,
    "email": null,
    "avatarUrl": null,
    "role": "FAN"
  }
}
```

**Response `400`**
```json
{ "success": false, "message": "Invalid request" }
```

**Response `401`**
```json
{ "success": false, "message": "Invalid or expired verification code" }
```

---

### GET `/api/auth/me`

Returns the currently authenticated user from the session cookie. Fetches fresh data from the database.

**Authentication:** Session cookie required.

**Response `200`**
```json
{
  "success": true,
  "user": {
    "id": "cuid",
    "phone": "+971501234567",
    "name": "John Doe",
    "email": "john@example.com",
    "avatarUrl": "https://...",
    "role": "FAN"
  }
}
```

**Response `401`**
```json
{ "success": false, "message": "Not authenticated" }
```
or
```json
{ "success": false, "message": "User not found" }
```

---

### POST `/api/auth/logout`

Clears the session cookie.

**Response `200`** (+ `Set-Cookie` to clear session)
```json
{ "success": true }
```

---

## Part 3: Admin API Endpoints

All admin endpoints require authentication via session cookie. Most require `ADMIN` or `SUPER_ADMIN` role (checked via `requireRole`). Users and user-management endpoints require `SUPER_ADMIN`.

**Common Error Responses (all admin endpoints)**

| Status | Body | Condition |
|--------|------|-----------|
| `401` | `{ "error": "Unauthorized" }` | Missing/invalid session or insufficient role |
| `400` | `{ "error": "Validation failed", "issues": [...] }` | Zod validation failure |
| `500` | `{ "error": "Failed to ..." }` | Server error |

---

### 3.1 Dashboard Stats

#### GET `/api/admin/stats`

**Role:** ADMIN

Returns aggregate counts for the admin dashboard.

**Response `200`**
```json
{
  "teams": 16,
  "matches": 24,
  "applications": 42,
  "campaignState": "LIVE"
}
```

---

### 3.2 Campaign Management

#### GET `/api/admin/campaign`

**Role:** ADMIN

Returns the most recent campaign (ordered by `createdAt` desc).

**Response `200`**
```json
{ "campaign": { "id": "...", "slug": "...", "title": "...", "state": "LIVE", ... } }
```

**Response `404`**
```json
{ "error": "No campaign found" }
```

#### PATCH `/api/admin/campaign`

**Role:** ADMIN

Updates campaign fields. All fields are optional.

**Request Body**
```json
{
  "state": "LIVE",
  "title": "Road to Greatness 2026",
  "tagline": "Inspire It. Dream It. Do It.",
  "startDate": "2026-03-26T00:00:00.000Z",
  "endDate": "2026-03-28T00:00:00.000Z"
}
```

| Field | Type | Notes |
|-------|------|-------|
| `state` | `CampaignState` enum | Optional |
| `title` | `string` (min 1) | Optional |
| `tagline` | `string` (min 1) | Optional |
| `startDate` | `string \| null` | ISO 8601, nullable |
| `endDate` | `string \| null` | ISO 8601, nullable |

**Response `200`**
```json
{ "campaign": { ... } }
```

---

### 3.3 Match Management

#### GET `/api/admin/matches`

**Role:** ADMIN

Returns all matches with related teams, score, pitch, and group. Ordered by `scheduledAt` asc, then `matchNumber` asc.

**Query Parameters**

| Param | Type | Description |
|-------|------|-------------|
| `stage` | `MatchStage` | Filter by stage |
| `status` | `MatchStatus` | Filter by exact status |

**Response `200`** -- flat array of match objects (not wrapped in `{ matches }`)
```json
[
  {
    "id": "...",
    "stage": "GROUP",
    "status": "SCHEDULED",
    "homeTeam": { ... },
    "awayTeam": { ... },
    "score": null,
    "pitch": { ... },
    "group": { ... },
    ...
  }
]
```

#### PATCH `/api/admin/matches/:matchId`

**Role:** ADMIN

Updates a match and optionally upserts the score.

**Request Body**
```json
{
  "status": "LIVE_FIRST_HALF",
  "stage": "GROUP",
  "homeTeamId": "cuid",
  "awayTeamId": "cuid",
  "pitchId": "cuid",
  "matchNumber": 1,
  "scheduledAt": "2026-03-26T10:00:00.000Z",
  "startedAt": "2026-03-26T10:02:00.000Z",
  "endedAt": null,
  "score": {
    "homeGoals": 2,
    "awayGoals": 1,
    "homePenalties": null,
    "awayPenalties": null
  }
}
```

| Field | Type | Notes |
|-------|------|-------|
| `status` | `MatchStatus` enum | Optional |
| `stage` | `MatchStage` enum | Optional |
| `homeTeamId` | `string \| null` | Optional |
| `awayTeamId` | `string \| null` | Optional |
| `pitchId` | `string \| null` | Optional |
| `matchNumber` | `int \| null` | Optional |
| `scheduledAt` | `string` | ISO 8601, optional |
| `startedAt` | `string \| null` | ISO 8601, nullable, optional |
| `endedAt` | `string \| null` | ISO 8601, nullable, optional |
| `score` | `object` | Optional; upserts Score record |
| `score.homeGoals` | `int >= 0` | Required if score present |
| `score.awayGoals` | `int >= 0` | Required if score present |
| `score.homePenalties` | `int >= 0 \| null` | Optional |
| `score.awayPenalties` | `int >= 0 \| null` | Optional |

**Response `200`** -- updated match object (flat, not wrapped)

---

### 3.4 Match Events

#### GET `/api/admin/matches/:matchId/events`

**Role:** ADMIN

Returns all events for a match, ordered by `minute` ascending.

**Response `200`** -- flat array
```json
[
  {
    "id": "cuid",
    "matchId": "cuid",
    "type": "GOAL",
    "minute": 23,
    "teamSide": "HOME",
    "playerName": "Ahmed K.",
    "detail": "Left foot, bottom corner",
    "createdAt": "..."
  }
]
```

#### POST `/api/admin/matches/:matchId/events`

**Role:** ADMIN

Creates a new match event.

**Request Body**
```json
{
  "type": "GOAL",
  "minute": 23,
  "teamSide": "HOME",
  "playerName": "Ahmed K.",
  "detail": "Left foot, bottom corner"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `type` | `string` | Yes | `GOAL`, `YELLOW_CARD`, `RED_CARD`, `SUBSTITUTION`, `PENALTY` |
| `minute` | `int` | Yes | >= 0 |
| `teamSide` | `string` | Yes | `HOME` or `AWAY` |
| `playerName` | `string \| null` | No | |
| `detail` | `string \| null` | No | |

**Response `201`** -- created event object

---

### 3.5 Team Management

#### GET `/api/admin/teams`

**Role:** ADMIN

Returns all teams with group and player count, ordered by name.

**Response `200`** -- flat array
```json
[
  {
    "id": "cuid",
    "name": "Team Alpha",
    "shortName": "ALP",
    "logoUrl": "...",
    "primaryColor": "#FF0000",
    "groupId": "cuid",
    "bio": "...",
    "source": "open_trial",
    "createdAt": "...",
    "group": { "id": "...", "name": "Group A", ... },
    "_count": { "players": 15 }
  }
]
```

#### POST `/api/admin/teams`

**Role:** ADMIN

Creates a new team.

**Request Body**
```json
{
  "name": "Team Alpha",
  "shortName": "ALP",
  "logoUrl": "https://...",
  "primaryColor": "#FF0000",
  "groupId": "cuid",
  "bio": "...",
  "source": "open_trial"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `name` | `string` | Yes | Min 1 char |
| `shortName` | `string \| null` | No | |
| `logoUrl` | `string \| null` | No | Must be valid URL |
| `primaryColor` | `string \| null` | No | |
| `groupId` | `string \| null` | No | |
| `bio` | `string \| null` | No | |
| `source` | `string \| null` | No | |

**Response `201`** -- created team object (includes `group` and `_count`)

#### PATCH `/api/admin/teams/:teamId`

**Role:** ADMIN

Updates a team. All fields optional (same schema as POST without `name` being required).

**Response `200`** -- updated team object

#### DELETE `/api/admin/teams/:teamId`

**Role:** ADMIN

Deletes a team.

**Response `200`**
```json
{ "success": true }
```

---

### 3.6 Player Management

#### GET `/api/admin/teams/:teamId/players`

**Role:** ADMIN

Returns all players for a team, ordered by number then name.

**Response `200`** -- flat array
```json
[
  {
    "id": "cuid",
    "teamId": "cuid",
    "name": "Ahmed K.",
    "position": "MF",
    "number": 10,
    "photoUrl": "https://...",
    "isCaptain": true
  }
]
```

#### POST `/api/admin/teams/:teamId/players`

**Role:** ADMIN

Creates a new player on the team.

**Request Body**
```json
{
  "name": "Ahmed K.",
  "position": "MF",
  "number": 10,
  "photoUrl": "https://...",
  "isCaptain": true
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `name` | `string` | Yes | Min 1 char |
| `position` | `string \| null` | No | |
| `number` | `int \| null` | No | 1-99 |
| `photoUrl` | `string \| null` | No | Must be valid URL |
| `isCaptain` | `boolean` | No | Defaults `false` |

**Response `201`** -- created player object

#### PATCH `/api/admin/teams/:teamId/players/:playerId`

**Role:** ADMIN

Updates a player. All fields optional (same schema as POST).

**Response `200`** -- updated player object

#### DELETE `/api/admin/teams/:teamId/players/:playerId`

**Role:** ADMIN

Deletes a player.

**Response `200`**
```json
{ "success": true }
```

---

### 3.7 Standings

#### GET `/api/admin/standings`

**Role:** ADMIN

Returns groups with standings and team details (subset of team fields).

**Response `200`**
```json
{
  "groups": [
    {
      "id": "...",
      "name": "Group A",
      "order": 0,
      "standings": [
        {
          "id": "...",
          "groupId": "...",
          "teamId": "...",
          "played": 3,
          "won": 2,
          "drawn": 1,
          "lost": 0,
          "goalsFor": 7,
          "goalsAgainst": 2,
          "goalDifference": 5,
          "points": 7,
          "position": 1,
          "lastUpdated": "...",
          "team": {
            "id": "...",
            "name": "Team Alpha",
            "shortName": "ALP",
            "logoUrl": "...",
            "primaryColor": "#FF0000"
          }
        }
      ]
    }
  ]
}
```

#### POST `/api/admin/standings/recalculate`

**Role:** ADMIN

Recalculates all group standings from completed group-stage matches. Sorting: points desc, goal difference desc, goals for desc.

**Request Body:** None

**Response `200`**
```json
{
  "success": true,
  "matchesProcessed": 24,
  "groupsUpdated": 4,
  "lastUpdated": "2026-03-26T18:30:00.000Z"
}
```

---

### 3.8 Hero Slides (CMS)

#### GET `/api/admin/hero-slides`

**Role:** ADMIN

Returns all hero slides ordered by `order` ascending.

**Response `200`** -- flat array of HeroSlide objects

#### POST `/api/admin/hero-slides`

**Role:** ADMIN

Creates a new hero slide.

**Request Body**
```json
{
  "backgroundUrl": "https://...",
  "tag": "LIVE NOW",
  "title1": "Road to",
  "title2": "Greatness",
  "description": "Join the journey...",
  "ctaText": "Watch Live",
  "ctaHref": "/live",
  "cta2Text": "Learn More",
  "cta2Href": "/about",
  "accent": "tcl-red",
  "order": 0,
  "isActive": true
}
```

| Field | Type | Required | Default |
|-------|------|----------|---------|
| `backgroundUrl` | `string` | Yes | -- |
| `tag` | `string` | No | -- |
| `title1` | `string` | Yes | -- |
| `title2` | `string` | Yes | -- |
| `description` | `string` | Yes | -- |
| `ctaText` | `string` | No | -- |
| `ctaHref` | `string` | No | -- |
| `cta2Text` | `string` | No | -- |
| `cta2Href` | `string` | No | -- |
| `accent` | `string` | No | `"tcl-red"` |
| `order` | `int` | No | `0` |
| `isActive` | `boolean` | No | `true` |

**Response `201`** -- created slide object

#### PATCH `/api/admin/hero-slides/:id`

**Role:** ADMIN

Updates a hero slide. All fields optional.

| Field | Type | Notes |
|-------|------|-------|
| `backgroundUrl` | `string` | Valid URL |
| `tag` | `string \| null` | Nullable |
| `title1` | `string` | Min 1 |
| `title2` | `string` | Min 1 |
| `description` | `string` | Min 1 |
| `ctaText` | `string \| null` | Nullable |
| `ctaHref` | `string \| null` | Nullable |
| `cta2Text` | `string \| null` | Nullable |
| `cta2Href` | `string \| null` | Nullable |
| `accent` | `string` | |
| `order` | `int` | |
| `isActive` | `boolean` | |

**Response `200`** -- updated slide object

#### DELETE `/api/admin/hero-slides/:id`

**Role:** ADMIN

Deletes a hero slide.

**Response `200`**
```json
{ "success": true }
```

#### PATCH `/api/admin/hero-slides/reorder`

**Role:** ADMIN

Sets the order of all slides based on array position.

**Request Body**
```json
{
  "ids": ["cuid_1", "cuid_2", "cuid_3"]
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `ids` | `string[]` | Yes | Min 1 element |

Each slide's `order` is set to its index in the array (0-based). Executed as a Prisma transaction.

**Response `200`**
```json
{ "success": true }
```

---

### 3.9 FAQ Management

#### GET `/api/admin/faq`

**Role:** ADMIN

Returns all FAQ items ordered by `order` ascending.

**Response `200`** -- flat array of FaqItem objects

#### POST `/api/admin/faq`

**Role:** ADMIN

Creates a new FAQ item. Auto-assigns `order` to max+1 if not provided.

**Request Body**
```json
{
  "question": "How do I register my team?",
  "answer": "Visit the registration page...",
  "category": "registration",
  "order": 5
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `question` | `string` | Yes | Min 1 char |
| `answer` | `string` | Yes | Min 1 char |
| `category` | `string` | No | |
| `order` | `number` | No | Auto-increments |

**Response `201`** -- created FAQ item

#### PATCH `/api/admin/faq/:id`

**Role:** ADMIN

Updates a FAQ item. All fields optional.

**Response `200`** -- updated FAQ item

#### DELETE `/api/admin/faq/:id`

**Role:** ADMIN

Deletes a FAQ item.

**Response `200`**
```json
{ "success": true }
```

#### PATCH `/api/admin/faq/reorder`

**Role:** ADMIN

Reorders FAQ items by array position (same pattern as hero-slides/reorder).

**Request Body**
```json
{ "ids": ["cuid_1", "cuid_2", "cuid_3"] }
```

**Response `200`**
```json
{ "success": true }
```

---

### 3.10 Highlights Management

#### GET `/api/admin/highlights`

**Role:** ADMIN

Returns all highlights ordered by `order` ascending.

**Response `200`** -- flat array of Highlight objects

#### POST `/api/admin/highlights`

**Role:** ADMIN

Creates a new highlight. Auto-assigns `order` if not provided.

**Request Body**
```json
{
  "title": "Best Goals - Day 1",
  "description": "Top 5 goals from the opening day",
  "mediaUrl": "https://youtube.com/...",
  "mediaType": "video",
  "thumbnailUrl": "https://...",
  "matchId": "cuid",
  "category": "goals",
  "order": 0,
  "publishedAt": "2026-03-26T18:00:00.000Z"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `title` | `string` | Yes | Min 1 char |
| `description` | `string` | No | |
| `mediaUrl` | `string` | Yes | Valid URL |
| `mediaType` | `string` | No | `"video"` or `"image"`, defaults `"video"` |
| `thumbnailUrl` | `string` | No | Valid URL |
| `matchId` | `string` | No | |
| `category` | `string` | No | |
| `order` | `number` | No | Auto-increments |
| `publishedAt` | `date` | No | Defaults to `now()` |

**Response `201`** -- created highlight object

#### PATCH `/api/admin/highlights/:id`

**Role:** ADMIN

Updates a highlight. All fields optional (nullable fields accept `null`).

**Response `200`** -- updated highlight object

#### DELETE `/api/admin/highlights/:id`

**Role:** ADMIN

Deletes a highlight.

**Response `200`**
```json
{ "success": true }
```

---

### 3.11 Prize Management

#### GET `/api/admin/prizes`

**Role:** ADMIN

Returns all prize packages ordered by `order` ascending.

**Response `200`** -- flat array of PrizePackage objects

#### POST `/api/admin/prizes`

**Role:** ADMIN

Creates a new prize package.

**Request Body**
```json
{
  "title": "Grand Prize",
  "description": "Full Arsenal experience...",
  "imageUrl": "https://...",
  "value": "AED 50,000",
  "tier": "GRAND",
  "order": 0
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `title` | `string` | Yes | Min 1 char |
| `description` | `string` | No | |
| `imageUrl` | `string` | No | Valid URL |
| `value` | `string` | No | |
| `tier` | `string` | Yes | `GRAND`, `RUNNER_UP`, or `MVP` |
| `order` | `number` | No | Auto-increments |

**Response `201`** -- created prize object

#### PATCH `/api/admin/prizes/:id`

**Role:** ADMIN

Updates a prize. All fields optional.

**Response `200`** -- updated prize object

#### DELETE `/api/admin/prizes/:id`

**Role:** ADMIN

Deletes a prize.

**Response `200`**
```json
{ "success": true }
```

---

### 3.12 Zone Schedule Management

#### GET `/api/admin/zone`

**Role:** ADMIN

Returns all zone schedule items ordered by `order` ascending.

**Response `200`** -- flat array of ZoneSchedule objects

#### POST `/api/admin/zone`

**Role:** ADMIN

Creates a new zone schedule item.

**Request Body**
```json
{
  "title": "DJ Set",
  "description": "Live music...",
  "imageUrl": "https://...",
  "location": "Main Stage",
  "startTime": "2026-03-26T16:00:00.000Z",
  "endTime": "2026-03-26T17:30:00.000Z",
  "status": "UPCOMING",
  "category": "entertainment",
  "capacity": 500,
  "order": 0
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `title` | `string` | Yes | Min 1 char |
| `description` | `string` | No | |
| `imageUrl` | `string` | No | Valid URL |
| `location` | `string` | No | |
| `startTime` | `date` | Yes | ISO 8601 |
| `endTime` | `date` | Yes | ISO 8601 |
| `status` | `ZoneStatus` | No | Defaults `UPCOMING` |
| `category` | `string` | No | |
| `capacity` | `int` | No | Positive integer |
| `order` | `number` | No | Auto-increments |

**Response `201`** -- created zone schedule object

#### PATCH `/api/admin/zone/:id`

**Role:** ADMIN

Updates a zone schedule item. All fields optional (nullable fields accept `null`).

**Response `200`** -- updated zone schedule object

#### DELETE `/api/admin/zone/:id`

**Role:** ADMIN

Deletes a zone schedule item.

**Response `200`**
```json
{ "success": true }
```

---

### 3.13 Notification Templates & Sending

#### GET `/api/admin/notifications/templates`

**Role:** ADMIN

Returns all notification templates ordered by `key`.

**Response `200`** -- flat array
```json
[
  {
    "id": "cuid",
    "key": "match_starting",
    "title": "Match Starting Soon",
    "body": "{{teamName}} plays in 15 minutes!",
    "category": "match"
  }
]
```

#### POST `/api/admin/notifications/templates`

**Role:** ADMIN

Creates or updates (upserts by `key`) a notification template.

**Request Body**
```json
{
  "key": "match_starting",
  "title": "Match Starting Soon",
  "body": "{{teamName}} plays in 15 minutes!",
  "category": "match"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `key` | `string` | Yes | Min 1 char, unique |
| `title` | `string` | Yes | Min 1 char |
| `body` | `string` | Yes | Min 1 char |
| `category` | `string` | Yes | Min 1 char |

**Response `200`** -- upserted template object

#### POST `/api/admin/notifications/send`

**Role:** ADMIN

Sends a notification to all users matching the target audience. Creates one `Notification` row per user.

**Request Body**
```json
{
  "title": "Match Starting!",
  "body": "Team Alpha vs Team Bravo kicks off now!",
  "category": "match",
  "target": "ALL",
  "data": { "matchId": "cuid" }
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `title` | `string` | Yes | Min 1 char |
| `body` | `string` | Yes | Min 1 char |
| `category` | `string` | Yes | Min 1 char |
| `target` | `string` | Yes | `ALL`, `FAN`, or `CAPTAIN` |
| `data` | `object` | No | Arbitrary JSON metadata |

**Response `200`**
```json
{
  "success": true,
  "count": 342
}
```

**Response `400`**
```json
{ "error": "No users found for the selected audience" }
```

---

### 3.14 Site Content (CMS Key-Value)

#### GET `/api/admin/content`

**Role:** ADMIN

Returns all site content entries ordered by `key`.

**Response `200`** -- flat array
```json
[
  {
    "id": "cuid",
    "key": "about_heading",
    "value": "About the Tournament",
    "type": "text"
  }
]
```

#### POST `/api/admin/content`

**Role:** ADMIN

Creates or updates (upserts by `key`) a site content entry.

**Request Body**
```json
{
  "key": "about_heading",
  "value": "About the Tournament",
  "type": "text"
}
```

| Field | Type | Required | Default |
|-------|------|----------|---------|
| `key` | `string` | Yes | -- |
| `value` | `string` | Yes | -- |
| `type` | `string` | No | `"text"` |

**Response `200`** -- upserted content object

---

### 3.15 Application Management

#### GET `/api/admin/applications`

**Role:** ADMIN

Returns all team applications with user info and status logs.

**Query Parameters**

| Param | Type | Description |
|-------|------|-------------|
| `status` | `ApplicationStatus` | Filter by status |

**Response `200`** -- flat array
```json
[
  {
    "id": "cuid",
    "userId": "cuid",
    "status": "SUBMITTED",
    "teamName": "Street FC",
    "formData": { ... },
    "notes": null,
    "reviewedBy": null,
    "createdAt": "...",
    "updatedAt": "...",
    "user": {
      "id": "cuid",
      "name": "John",
      "phone": "+971...",
      "email": "john@example.com"
    },
    "statusLogs": [
      {
        "id": "cuid",
        "applicationId": "cuid",
        "fromStatus": "SUBMITTED",
        "toStatus": "UNDER_REVIEW",
        "changedBy": "admin-cuid",
        "reason": null,
        "createdAt": "..."
      }
    ]
  }
]
```

#### PATCH `/api/admin/applications/:id`

**Role:** ADMIN

Updates an application's status and/or notes. If the status changes, an `ApplicationStatusLog` entry is created in a transaction.

**Request Body**
```json
{
  "status": "CONFIRMED",
  "notes": "Strong team, confirmed for tournament",
  "reason": "Met all criteria"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `status` | `ApplicationStatus` | No | One of the enum values |
| `notes` | `string` | No | |
| `reason` | `string` | No | Recorded in status log |

**Response `200`** -- updated application (includes `user` and `statusLogs`)

**Response `404`**
```json
{ "error": "Application not found" }
```

---

### 3.16 User Management

#### GET `/api/admin/users`

**Role:** SUPER_ADMIN

Returns paginated list of users with search capability.

**Query Parameters**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `search` | `string` | `""` | Searches name (case-insensitive) and phone |
| `page` | `int` | `1` | Page number (min 1) |
| `limit` | `int` | `20` | Items per page (1-100) |

**Response `200`**
```json
{
  "users": [
    {
      "id": "cuid",
      "phone": "+971501234567",
      "name": "John Doe",
      "email": "john@example.com",
      "avatarUrl": null,
      "role": "FAN",
      "isVerified": true,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 342,
    "totalPages": 18
  }
}
```

#### PATCH `/api/admin/users/:id`

**Role:** SUPER_ADMIN

Updates a user's role or name.

**Request Body**
```json
{
  "role": "ADMIN",
  "name": "John Admin"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `role` | `UserRole` | No | `FAN`, `CAPTAIN`, `ADMIN`, `SUPER_ADMIN` |
| `name` | `string` | No | Min 1 char |

**Response `200`** -- updated user object

**Response `404`**
```json
{ "error": "User not found" }
```

---

## Part 4: Database Schema

**Provider:** PostgreSQL via Prisma ORM

### 4.1 Entity-Relationship Overview

```
Campaign 1---* EventDay 1---* Match
                                |
Group 1---* Team                |---1 Score
  |    \---* Standing           |---* MatchEvent
  |         (team)              |
  \---* Match                   |
                                |
Team 1---* Player              Match *---1 Pitch *---1 Venue
  |  \---* Standing
  |  \---* BracketNode (team/winner)
  |  \---* FavoriteTeam
  |
User 1---? Team (captain)
  |  \---1? CaptainProfile
  |  \---* Application ---* ApplicationStatusLog
  |  \---* Notification
  |  \---* NotificationPreference
  |  \---* FavoriteTeam
  |  \---* OtpCode
```

### 4.2 All Enums

#### CampaignState
```
PRE_LAUNCH | LAUNCH | SCREENING | LIVE | POST_EVENT
```

#### MatchStage
```
GROUP | QUARTER_FINAL | SEMI_FINAL | THIRD_PLACE | FINAL
```

#### MatchStatus
```
SCHEDULED | LIVE_FIRST_HALF | HALF_TIME | LIVE_SECOND_HALF |
FULL_TIME | PENALTIES | COMPLETED | POSTPONED | CANCELLED
```

#### ZoneStatus
```
UPCOMING | ACTIVE | PAUSED | COMPLETED
```

#### UserRole
```
FAN | CAPTAIN | ADMIN | SUPER_ADMIN
```

#### ApplicationStatus
```
SUBMITTED | UNDER_REVIEW | SHORTLISTED | RESERVE | CONFIRMED | NOT_SELECTED
```

### 4.3 All Models

#### Campaign

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `String` | PK, `cuid()` | |
| `slug` | `String` | Unique | URL-safe identifier |
| `title` | `String` | | Campaign name |
| `tagline` | `String` | Default `"Inspire It. Dream It. Do It."` | |
| `state` | `CampaignState` | Default `PRE_LAUNCH` | |
| `heroImageUrl` | `String?` | Nullable | |
| `startDate` | `DateTime?` | Nullable | |
| `endDate` | `DateTime?` | Nullable | |
| `config` | `Json?` | Nullable | Arbitrary config |
| `createdAt` | `DateTime` | Default `now()` | |
| `updatedAt` | `DateTime` | `@updatedAt` | |

**Relations:** `eventDays` (1:N EventDay)

#### EventDay

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `String` | PK, `cuid()` | |
| `campaignId` | `String` | FK -> Campaign | |
| `dayNumber` | `Int` | | 1, 2, 3... |
| `date` | `DateTime` | | |
| `label` | `String` | | e.g. "Day 1 - Group Stage" |

**Relations:** `campaign` (N:1 Campaign), `matches` (1:N Match)

#### Venue

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `String` | PK, `cuid()` | |
| `name` | `String` | | |
| `address` | `String?` | Nullable | |
| `mapUrl` | `String?` | Nullable | |

**Relations:** `pitches` (1:N Pitch)

#### Pitch

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `String` | PK, `cuid()` | |
| `venueId` | `String` | FK -> Venue | |
| `name` | `String` | | e.g. "Pitch 1" |
| `label` | `String?` | Nullable | |

**Relations:** `venue` (N:1 Venue), `matches` (1:N Match)

#### Team

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `String` | PK, `cuid()` | |
| `name` | `String` | | |
| `shortName` | `String?` | Nullable | 3-letter code |
| `logoUrl` | `String?` | Nullable | |
| `primaryColor` | `String?` | Nullable | Hex color |
| `groupId` | `String?` | FK -> Group, nullable | |
| `captainId` | `String?` | FK -> User, unique | |
| `seed` | `Int?` | Nullable | Tournament seeding |
| `bio` | `String?` | Nullable | |
| `source` | `String?` | Nullable | How team was sourced |
| `createdAt` | `DateTime` | Default `now()` | |

**Relations:** `group` (N:1 Group), `captain` (1:1 User), `players` (1:N Player), `homeMatches`/`awayMatches` (1:N Match), `standings` (1:N Standing), `bracketTeams`/`bracketWins` (1:N BracketNode), `favorites` (1:N FavoriteTeam)

#### Player

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `String` | PK, `cuid()` | |
| `teamId` | `String` | FK -> Team (cascade delete) | |
| `name` | `String` | | |
| `position` | `String?` | Nullable | GK, DF, MF, FW |
| `number` | `Int?` | Nullable | Squad number |
| `photoUrl` | `String?` | Nullable | |
| `isCaptain` | `Boolean` | Default `false` | |

**Relations:** `team` (N:1 Team), `rosterEntry` (1:1? RosterMember)

#### Group

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `String` | PK, `cuid()` | |
| `name` | `String` | | e.g. "Group A" |
| `order` | `Int` | Default `0` | Sort order |

**Relations:** `teams` (1:N Team), `standings` (1:N Standing), `matches` (1:N Match)

#### Standing

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `String` | PK, `cuid()` | |
| `groupId` | `String` | FK -> Group | |
| `teamId` | `String` | FK -> Team | |
| `played` | `Int` | Default `0` | |
| `won` | `Int` | Default `0` | |
| `drawn` | `Int` | Default `0` | |
| `lost` | `Int` | Default `0` | |
| `goalsFor` | `Int` | Default `0` | |
| `goalsAgainst` | `Int` | Default `0` | |
| `goalDifference` | `Int` | Default `0` | |
| `points` | `Int` | Default `0` | |
| `position` | `Int` | Default `0` | Rank within group |
| `lastUpdated` | `DateTime` | Default `now()` | |

**Constraints:** `@@unique([groupId, teamId])`, `@@index([groupId, position])`

#### Match

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `String` | PK, `cuid()` | |
| `eventDayId` | `String?` | FK -> EventDay, nullable | |
| `groupId` | `String?` | FK -> Group, nullable | Null for knockout |
| `pitchId` | `String?` | FK -> Pitch, nullable | |
| `homeTeamId` | `String?` | FK -> Team, nullable | TBD for bracket |
| `awayTeamId` | `String?` | FK -> Team, nullable | TBD for bracket |
| `matchNumber` | `Int?` | Nullable | Sequence number |
| `stage` | `MatchStage` | Default `GROUP` | |
| `status` | `MatchStatus` | Default `SCHEDULED` | |
| `scheduledAt` | `DateTime` | | |
| `startedAt` | `DateTime?` | Nullable | |
| `endedAt` | `DateTime?` | Nullable | |

**Indexes:** `@@index([status])`, `@@index([stage])`, `@@index([scheduledAt])`

**Relations:** `eventDay`, `group`, `pitch`, `homeTeam`, `awayTeam`, `score` (1:1 Score), `events` (1:N MatchEvent)

#### Score

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `String` | PK, `cuid()` | |
| `matchId` | `String` | FK -> Match, unique | |
| `homeGoals` | `Int` | Default `0` | |
| `awayGoals` | `Int` | Default `0` | |
| `homePenalties` | `Int?` | Nullable | |
| `awayPenalties` | `Int?` | Nullable | |
| `updatedAt` | `DateTime` | `@updatedAt` | |

#### MatchEvent

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `String` | PK, `cuid()` | |
| `matchId` | `String` | FK -> Match (cascade delete) | |
| `type` | `String` | | GOAL, YELLOW_CARD, RED_CARD, SUBSTITUTION, PENALTY |
| `minute` | `Int` | | Match minute |
| `teamSide` | `String` | | HOME or AWAY |
| `playerName` | `String?` | Nullable | |
| `detail` | `String?` | Nullable | |
| `createdAt` | `DateTime` | Default `now()` | |

**Index:** `@@index([matchId, minute])`

#### BracketNode

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `String` | PK, `cuid()` | |
| `stage` | `MatchStage` | | QF, SF, etc. |
| `position` | `Int` | | Slot position |
| `teamId` | `String?` | FK -> Team, nullable | |
| `winnerId` | `String?` | FK -> Team, nullable | |
| `matchId` | `String?` | Nullable | Reference to Match |
| `parentNodeId` | `String?` | Nullable | For tree structure |
| `label` | `String?` | Nullable | e.g. "QF1" |
| `createdAt` | `DateTime` | Default `now()` | |

**Index:** `@@index([stage, position])`

#### ZoneSchedule

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `String` | PK, `cuid()` | |
| `title` | `String` | | |
| `description` | `String?` | Nullable | |
| `imageUrl` | `String?` | Nullable | |
| `location` | `String?` | Nullable | |
| `startTime` | `DateTime` | | |
| `endTime` | `DateTime` | | |
| `status` | `ZoneStatus` | Default `UPCOMING` | |
| `category` | `String?` | Nullable | |
| `capacity` | `Int?` | Nullable | |
| `order` | `Int` | Default `0` | |

#### PrizePackage

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `String` | PK, `cuid()` | |
| `title` | `String` | | |
| `description` | `String?` | Nullable | |
| `imageUrl` | `String?` | Nullable | |
| `value` | `String?` | Nullable | Display string (e.g. "AED 50,000") |
| `tier` | `String` | | GRAND, RUNNER_UP, MVP |
| `order` | `Int` | Default `0` | |

#### Highlight

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `String` | PK, `cuid()` | |
| `title` | `String` | | |
| `description` | `String?` | Nullable | |
| `mediaUrl` | `String` | | Video/image URL |
| `mediaType` | `String` | Default `"video"` | `"video"` or `"image"` |
| `thumbnailUrl` | `String?` | Nullable | |
| `matchId` | `String?` | Nullable | Associated match |
| `category` | `String?` | Nullable | |
| `order` | `Int` | Default `0` | |
| `publishedAt` | `DateTime` | Default `now()` | |

#### FaqItem

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `String` | PK, `cuid()` | |
| `question` | `String` | | |
| `answer` | `String` | | |
| `category` | `String?` | Nullable | |
| `order` | `Int` | Default `0` | |

#### User

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `String` | PK, `cuid()` | |
| `phone` | `String` | Unique | Primary identifier |
| `name` | `String?` | Nullable | |
| `email` | `String?` | Nullable | |
| `avatarUrl` | `String?` | Nullable | |
| `role` | `UserRole` | Default `FAN` | |
| `isVerified` | `Boolean` | Default `false` | Set on OTP verify |
| `createdAt` | `DateTime` | Default `now()` | |
| `updatedAt` | `DateTime` | `@updatedAt` | |

**Relations:** `team` (1:1? as captain), `captainProfile` (1:1?), `applications` (1:N), `notifications` (1:N), `preferences` (1:N NotificationPreference), `favorites` (1:N FavoriteTeam), `otpCodes` (1:N)

#### OtpCode

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `String` | PK, `cuid()` | |
| `userId` | `String?` | FK -> User, nullable | Null for new users |
| `phone` | `String` | | |
| `code` | `String` | | 6-digit code |
| `expiresAt` | `DateTime` | | 5 min from creation |
| `verified` | `Boolean` | Default `false` | |
| `attempts` | `Int` | Default `0` | |
| `createdAt` | `DateTime` | Default `now()` | |

**Index:** `@@index([phone, code])`

#### CaptainProfile

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `String` | PK, `cuid()` | |
| `userId` | `String` | FK -> User, unique | |
| `fullName` | `String` | | |
| `email` | `String` | | |
| `teamName` | `String` | | |
| `area` | `String?` | Nullable | |
| `experience` | `String?` | Nullable | |
| `source` | `String?` | Nullable | |
| `sourceDetail` | `String?` | Nullable | |

#### Application

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `String` | PK, `cuid()` | |
| `userId` | `String` | FK -> User | |
| `status` | `ApplicationStatus` | Default `SUBMITTED` | |
| `teamName` | `String` | | |
| `formData` | `Json` | | Full application form |
| `notes` | `String?` | Nullable | Admin notes |
| `reviewedBy` | `String?` | Nullable | Admin user ID |
| `createdAt` | `DateTime` | Default `now()` | |
| `updatedAt` | `DateTime` | `@updatedAt` | |

**Relations:** `user` (N:1), `statusLogs` (1:N ApplicationStatusLog)

#### ApplicationStatusLog

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `String` | PK, `cuid()` | |
| `applicationId` | `String` | FK -> Application (cascade delete) | |
| `fromStatus` | `ApplicationStatus?` | Nullable | Previous status |
| `toStatus` | `ApplicationStatus` | | New status |
| `changedBy` | `String?` | Nullable | Admin user ID |
| `reason` | `String?` | Nullable | |
| `createdAt` | `DateTime` | Default `now()` | |

#### RosterMember

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `String` | PK, `cuid()` | |
| `playerId` | `String` | FK -> Player, unique | |
| `teamId` | `String` | | |
| `name` | `String` | | |
| `position` | `String?` | Nullable | |
| `number` | `Int?` | Nullable | |
| `kitSize` | `String?` | Nullable | S, M, L, XL, XXL |
| `isConfirmed` | `Boolean` | Default `false` | |

#### KitSizeSubmission

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `String` | PK, `cuid()` | |
| `teamId` | `String` | | |
| `submittedBy` | `String` | | User ID |
| `sizes` | `Json` | | Map of player -> size |
| `isComplete` | `Boolean` | Default `false` | |
| `submittedAt` | `DateTime` | Default `now()` | |

#### AgreementStatus

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `String` | PK, `cuid()` | |
| `userId` | `String` | | |
| `agreementType` | `String` | | e.g. "waiver", "rules" |
| `accepted` | `Boolean` | Default `false` | |
| `acceptedAt` | `DateTime?` | Nullable | |
| `ipAddress` | `String?` | Nullable | |

#### NotificationTemplate

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `String` | PK, `cuid()` | |
| `key` | `String` | Unique | Template identifier |
| `title` | `String` | | |
| `body` | `String` | | Supports `{{var}}` placeholders |
| `category` | `String` | | |

#### Notification

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `String` | PK, `cuid()` | |
| `userId` | `String` | FK -> User (cascade delete) | |
| `title` | `String` | | |
| `body` | `String` | | |
| `category` | `String` | | |
| `data` | `Json?` | Nullable | Arbitrary metadata |
| `isRead` | `Boolean` | Default `false` | |
| `createdAt` | `DateTime` | Default `now()` | |

**Indexes:** `@@index([userId, isRead])`, `@@index([userId, createdAt])`

#### NotificationPreference

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `String` | PK, `cuid()` | |
| `userId` | `String` | FK -> User (cascade delete) | |
| `category` | `String` | | Matches notification category |
| `enabled` | `Boolean` | Default `true` | |

**Constraint:** `@@unique([userId, category])`

#### FavoriteTeam

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `String` | PK, `cuid()` | |
| `userId` | `String` | FK -> User (cascade delete) | |
| `teamId` | `String` | FK -> Team (cascade delete) | |

**Constraint:** `@@unique([userId, teamId])`

#### HeroSlide

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `String` | PK, `cuid()` | |
| `backgroundUrl` | `String` | | Image URL |
| `tag` | `String?` | Nullable | e.g. "LIVE NOW" |
| `title1` | `String` | | First line of title |
| `title2` | `String` | | Second line of title |
| `description` | `String` | | |
| `ctaText` | `String?` | Nullable | Primary button text |
| `ctaHref` | `String?` | Nullable | Primary button link |
| `cta2Text` | `String?` | Nullable | Secondary button text |
| `cta2Href` | `String?` | Nullable | Secondary button link |
| `accent` | `String` | Default `"tcl-red"` | Color theme |
| `order` | `Int` | Default `0` | Sort order |
| `isActive` | `Boolean` | Default `true` | |

#### SiteContent

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `String` | PK, `cuid()` | |
| `key` | `String` | Unique | Content key identifier |
| `value` | `String` | | Content value |
| `type` | `String` | Default `"text"` | text, html, json, etc. |

---

### 4.4 Key Indexes & Constraints Summary

| Model | Index / Constraint | Type |
|-------|--------------------|------|
| Campaign | `slug` | Unique |
| Team | `captainId` | Unique |
| Standing | `(groupId, teamId)` | Unique composite |
| Standing | `(groupId, position)` | Index |
| Match | `status` | Index |
| Match | `stage` | Index |
| Match | `scheduledAt` | Index |
| Score | `matchId` | Unique |
| MatchEvent | `(matchId, minute)` | Index |
| BracketNode | `(stage, position)` | Index |
| User | `phone` | Unique |
| OtpCode | `(phone, code)` | Index |
| CaptainProfile | `userId` | Unique |
| Notification | `(userId, isRead)` | Index |
| Notification | `(userId, createdAt)` | Index |
| NotificationPreference | `(userId, category)` | Unique composite |
| FavoriteTeam | `(userId, teamId)` | Unique composite |
| NotificationTemplate | `key` | Unique |
| SiteContent | `key` | Unique |
| RosterMember | `playerId` | Unique |

---

*Document generated from source code in `src/app/api/` route files and `prisma/schema.prisma`.*
