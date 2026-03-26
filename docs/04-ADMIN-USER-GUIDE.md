# TCL x Arsenal Road to Greatness 2026 -- Admin Portal User Guide

> **Audience:** Marketing and operations team (non-technical staff)
> **Last updated:** March 2026
> **Print this document and keep it handy on match day.**

---

## Table of Contents

1. [Getting Started](#1-getting-started)
2. [Campaign Management](#2-campaign-management)
3. [Match Management](#3-match-management)
4. [Team Management](#4-team-management)
5. [Standings](#5-standings)
6. [Hero Slides](#6-hero-slides)
7. [FAQ Management](#7-faq-management)
8. [Highlights](#8-highlights)
9. [Prize Management](#9-prize-management)
10. [Zone Schedule](#10-zone-schedule)
11. [Notifications](#11-notifications)
12. [Content Management](#12-content-management)
13. [Applications](#13-applications)
14. [User Management](#14-user-management--super_admin-only)
15. [Match Day Workflow](#15-match-day-workflow-step-by-step)

---

## 1. Getting Started

### How to access the admin portal

Open your web browser and go to your app's URL followed by `/admin`. For example:

```
https://your-app-domain.com/admin
```

If you are not already logged in, the system will redirect you to the login page.

### Logging in

1. On the login page, enter your **phone number**.
2. You will receive a **one-time password (OTP)** via SMS.
3. Enter the OTP to complete login.
4. If your account has admin privileges, you will be taken to the Admin Dashboard. If not, you will be redirected to the public site.

> **Tip:** Make sure the phone number you use matches the one registered in the system with an admin role. If you cannot log in, ask a Super Admin to check your account.

### Admin roles

There are two admin roles:

| Role | What you can do |
|------|----------------|
| **ADMIN** | Access all admin pages except User Management. Can manage matches, teams, content, and everything else covered in this guide. |
| **SUPER_ADMIN** | Everything an ADMIN can do, plus the ability to manage user accounts and change anyone's role (including promoting someone to ADMIN). |

### Dashboard overview

When you first enter the admin portal, you land on the **Dashboard**. It shows:

- **Four stat cards** at the top:
  - **Teams** -- total number of teams in the tournament
  - **Matches** -- total number of matches
  - **Applications** -- total team applications received
  - **Campaign** -- the current campaign state (e.g., "Pre-Launch", "Live")

- **Quick Actions** section below with shortcuts to the most common tasks:
  - Manage Matches
  - Edit Hero Slides
  - Review Applications
  - Update FAQ
  - Upload Highlights
  - Send Notification

Click any quick action card to jump straight to that section.

### Navigation

The **left sidebar** lists all admin sections. You can collapse or expand the sidebar using the arrow button at the top. At the bottom of the sidebar, there is a "Back to public site" link that takes you to the fan-facing website.

---

## 2. Campaign Management

**Where:** Sidebar > **Campaign** (or go to `/admin/campaign`)

The campaign page controls the overall state of the tournament and its public-facing information.

### Campaign states

The tournament moves through five stages, always in this order:

| State | What it means for the public site |
|-------|----------------------------------|
| **Pre-Launch** | The site is in teaser/countdown mode. Registration is not yet open. |
| **Launch** | Registration is open. Fans and teams can sign up. |
| **Screening** | Applications are being reviewed. Registration may be closed. |
| **Live** | The tournament is actively happening. Match scores and standings are featured. |
| **Post-Event** | The tournament is over. Highlights, results, and winner content are shown. |

### How to change the campaign state

1. At the top of the Campaign page, you will see a **state timeline** showing all five stages. The current stage is highlighted in red.
2. Below the timeline, you will see one or two buttons:
   - **"Advance to [Next State]"** (red button) -- moves the campaign forward one step.
   - **"Back to [Previous State]"** (outline button) -- moves the campaign back one step if needed.
3. Click the appropriate button. The change takes effect immediately.

> **Warning:** Changing the campaign state affects what visitors see on the public website right away. Always coordinate with your team before advancing the state.

### Editing campaign details

Below the state controls, you will find editable fields:

- **Title** -- the campaign name (e.g., "Road to Greatness 2026")
- **Tagline** -- a short subtitle
- **Start Date** -- the tournament start date and time
- **End Date** -- the tournament end date and time

After making changes, click the **"Save Changes"** button. You will see a green "Saved successfully" confirmation, or a red error message if something went wrong.

---

## 3. Match Management

**Where:** Sidebar > **Matches** (or go to `/admin/matches`)

### Viewing all matches

The matches page shows a table of all matches with these columns:

- **#** -- match number
- **Teams** -- home team vs away team
- **Score** -- current score (or "-" if no score yet)
- **Status** -- current match status (color-coded)
- **Stage** -- GROUP, QUARTER FINAL, SEMI FINAL, THIRD PLACE, or FINAL
- **Pitch** -- which pitch the match is assigned to
- **Scheduled** -- date and time of the match
- **Actions** -- a "Detail" button to open the match

### Filtering matches

At the top of the page, use the two dropdown filters:

- **Stage filter** -- show only matches from a specific stage (Group, Quarter Final, etc.)
- **Status filter** -- show only matches with a specific status

Click **"Clear Filters"** to remove all filters and see every match again.

### Match statuses

Matches move through these statuses:

| Status | Meaning |
|--------|---------|
| **SCHEDULED** | Match has not started yet |
| **LIVE FIRST HALF** | First half is in progress |
| **HALF TIME** | Half-time break |
| **LIVE SECOND HALF** | Second half is in progress |
| **FULL TIME** | Regular time has ended |
| **PENALTIES** | Penalty shootout in progress |
| **COMPLETED** | Match is finished, result is final |
| **POSTPONED** | Match has been delayed |
| **CANCELLED** | Match will not be played |

### Match detail page

Click any match row (or the "Detail" button) to open the match detail page. Here you will find two main sections side by side:

**Left side -- Score and Status:**
- **Status dropdown** -- change the match status by selecting from the dropdown
- **Home Goals / Away Goals** -- enter the score using the number fields
- **Home Penalties / Away Penalties** -- only needed for knockout matches that go to a penalty shootout (leave blank otherwise)
- Click **"Save Match"** to apply your changes

**Right side -- Team and Pitch Assignment:**
- **Home Team / Away Team** -- select teams from the dropdowns (useful for knockout matches where teams are determined by earlier results)
- **Pitch** -- assign or change the pitch
- An info box shows the match's stage, group, and scheduled time

> **Tip:** When updating scores during a live match, remember to also update the match status. For example, change it from "SCHEDULED" to "LIVE FIRST HALF" when the match kicks off.

### Adding match events

Below the score section, you will find the **Match Events** area. Events are the individual things that happen during a match.

To add an event:
1. **Type** -- choose from: GOAL, YELLOW CARD, RED CARD, SUBSTITUTION, or PENALTY
2. **Minute** -- enter the minute the event happened (e.g., 23)
3. **Side** -- select HOME or AWAY
4. **Player** -- type the player's name (optional but recommended)
5. **Detail** -- add any extra detail (optional, e.g., "penalty kick" or "own goal")
6. Click the **"Add"** button

Events appear in a list below the form, shown with icons:
- Green ball icon = Goal
- Yellow square = Yellow card
- Red square = Red card
- Blue arrows = Substitution
- Orange dot = Penalty

> **Important:** Adding a goal event does NOT automatically update the score. You must also update the Home Goals or Away Goals number and click "Save Match." Events are for the match timeline that fans see on the public site.

### How standings auto-update

When you save match scores and mark a match as COMPLETED, the standings system can recalculate. See the Standings section below for how to trigger a recalculation.

---

## 4. Team Management

**Where:** Sidebar > **Teams** (or go to `/admin/teams`)

### Viewing the team grid

The teams page shows all teams in a grid of cards. Each card displays:
- Team logo (or colored initials if no logo is uploaded)
- Team name and short name
- Primary color dot
- Group assignment (if any)
- Number of players on the roster

Click any team card to go to its detail page.

### Adding a new team

1. Click the **"Add Team"** button in the top right
2. A dialog box will appear with these fields:
   - **Team Name** (required)
   - **Short Name** (e.g., "ABC" -- used for abbreviated displays)
   - **Primary Color** (click the color picker or type a hex code)
   - **Group** (select which tournament group the team belongs to)
3. Click **"Create Team"**

### Editing team details

Click a team card to open the team detail page. Here you can edit:

- **Team Name** (required)
- **Short Name**
- **Primary Color** -- use the color picker or type a hex code like #E4002B
- **Group** -- reassign the team to a different group
- **Source** -- where the team is from
- **Logo** -- click "Upload Logo" to open the image uploader (powered by Cloudinary). You can also click "Remove" to delete the current logo.
- **Bio** -- a text description of the team

Click **"Save Changes"** when done.

> **Tip:** For the color picker, you can click the colored square to open a visual picker, or type the exact hex code in the text field next to it.

### Uploading team logos

1. On the team detail page, find the Logo field
2. Click **"Upload Logo"** (or "Change Logo" if one already exists)
3. A Cloudinary upload window will open
4. Drag and drop an image, or browse your computer to select one
5. The image will upload automatically and appear as a preview
6. Click "Save Changes" to save the new logo

### Managing players (roster)

Below the team info form, you will see the **Player Roster** section showing all players on the team.

**To add a player:**
1. Click **"Add Player"**
2. Fill in:
   - **Player Name** (required)
   - **Position** (e.g., Goalkeeper, Midfielder, Forward)
   - **Number** (shirt number, 1-99)
   - **Team Captain** checkbox (tick this if the player is the captain)
3. Click **"Add Player"**

**To edit a player:**
1. Hover over the player's row
2. Click the pencil icon
3. Update the fields in the dialog
4. Click **"Update Player"**

**To remove a player:**
1. Click the trash icon next to the player
2. Confirm the removal in the dialog that appears

> **Warning:** Removing a player cannot be undone.

### Deleting a team

On the team detail page, click the red **"Delete"** button in the top right. A confirmation dialog will appear. Deleting a team also permanently removes all its players.

---

## 5. Standings

**Where:** Sidebar > **Standings** (or go to `/admin/standings`)

### Viewing group tables

The standings page shows a table for each tournament group. Each table displays the standard football standings columns:

| Column | Meaning |
|--------|---------|
| # | Position in the group |
| Team | Team name and logo |
| P | Matches played |
| W | Wins |
| D | Draws |
| L | Losses |
| GF | Goals for (scored) |
| GA | Goals against (conceded) |
| GD | Goal difference |
| Pts | Total points |

A "Last updated" timestamp at the top tells you when standings were last calculated.

### Recalculating standings

Click the **"Recalculate"** button (top right, red button) to rebuild all standings from the current match results. After recalculation, you will see a green message confirming how many matches were processed and how many groups were updated.

> **Tip:** Always recalculate standings after entering scores for completed matches. This ensures the public site shows accurate group tables.

> **Important:** If you see empty tables with the message "No standings yet. Click Recalculate to generate," it means standings have never been calculated. Click Recalculate to generate them for the first time.

---

## 6. Hero Slides

**Where:** Sidebar > **Hero Slides** (or go to `/admin/hero-slides`)

Hero slides are the large banner images that appear in the carousel at the top of the homepage.

### Viewing slides

Slides are shown as a grid of cards. Each card shows:
- A preview of the background image
- An "Active" or "Inactive" badge
- The slide's position number (e.g., #1, #2, #3)
- The slide's title and description text

### Adding a new slide

1. Click **"Add Slide"** (top right)
2. A form dialog will open with these fields:
   - **Background Image** -- click "Upload Image" to open the Cloudinary uploader. Select or drag-and-drop your image. (Required -- you cannot save without an image.)
   - **Tag** (optional) -- a small label that appears on the slide (e.g., "NEW SEASON")
   - **Title Line 1** and **Title Line 2** -- the main headline text, split across two lines
   - **Description** -- supporting text below the title
   - **CTA Text** and **CTA Link** (optional) -- the first call-to-action button text and where it links to (e.g., "Learn More" linking to "/matches")
   - **CTA 2 Text** and **CTA 2 Link** (optional) -- a second call-to-action button
   - **Accent Color** -- the color theme for the slide (default is "tcl-red")
   - **Active toggle** -- whether this slide is visible on the public site
3. Click **"Create Slide"**

### Editing a slide

Click the pencil icon on any slide card to open the edit form. Make your changes and click **"Update Slide."**

### Reordering slides

Use the **up and down arrow buttons** on each slide card to change the order. The first slide (#1) appears first in the carousel on the homepage.

### Toggling active/inactive

Each slide card has a **toggle switch** (green = active, gray = inactive). Click it to turn a slide on or off. Inactive slides are hidden from the public site but remain saved in the system.

### Deleting a slide

Click the red trash icon on a slide card. A confirmation dialog will appear. Click "Delete" to permanently remove the slide.

> **Tip:** You can prepare slides in advance by creating them as "Inactive" and then toggling them to "Active" when you are ready to show them.

---

## 7. FAQ Management

**Where:** Sidebar > **FAQ** (or go to `/admin/faq`)

### Viewing FAQs

FAQ items are displayed grouped by category. Each item shows the question and a preview of the answer. Hover over an item to reveal the edit and delete buttons.

### Adding a new FAQ

1. Click **"Add FAQ"** (top right)
2. Fill in:
   - **Question** (required) -- the question fans might ask
   - **Answer** (required) -- the answer to display
   - **Category** (optional) -- type a category name like "General", "Registration", "Match Day", or "Indoor Zone". Items with the same category name are grouped together on the public site.
3. Click **"Create FAQ"**

### Editing a FAQ

Hover over any FAQ item and click the pencil icon. Update the question, answer, or category, then click **"Save Changes."**

### Reordering FAQs

Each FAQ item has **up and down arrow buttons** on the left side. Click these to move an item higher or lower within its category. The order you set here is the order fans will see on the public site.

### Deleting a FAQ

Hover over the item and click the red trash icon. Confirm the deletion in the dialog. This cannot be undone.

> **Tip:** Use consistent category names. If you type "Match Day" for one item and "Matchday" for another, they will appear as two separate groups. Pick one spelling and stick with it.

---

## 8. Highlights

**Where:** Sidebar > **Highlights** (or go to `/admin/highlights`)

Highlights are videos and images showcasing tournament moments that appear in the Highlights section of the public site.

### Viewing highlights

Highlights are displayed in a grid of cards. Each card shows:
- A thumbnail or image preview
- Media type badge (video or image)
- Category badge (if assigned)
- Title and description
- Published date

### Adding a new highlight

1. Click **"Add Highlight"** (top right)
2. Fill in:
   - **Title** (required)
   - **Description** (optional)
   - **Media Type** -- choose "Video" or "Image"
   - **Category** (optional) -- e.g., "Goals", "Skills", "Celebrations"
   - **Media** -- click "Upload Media" to upload your video or image file through Cloudinary. Once uploaded, you will see a green "Uploaded" confirmation. You can also paste a URL directly.
   - **Thumbnail** -- click "Upload Thumbnail" to add a preview image (especially useful for videos)
3. Click **"Create"**

### Editing a highlight

Click the pencil icon on any highlight card to open the edit form. Make changes and click **"Update."**

### Deleting a highlight

Click the trash icon on the card and confirm in the dialog.

> **Tip:** For video highlights, always upload a thumbnail image. Without one, the card will show a generic play icon instead of a preview, which is less appealing to fans.

---

## 9. Prize Management

**Where:** Sidebar > **Prizes** (or go to `/admin/prizes`)

### Viewing prizes

Prizes are displayed in a grid. Each card shows the prize image, title, description, tier badge, and value.

### Prize tiers

There are three prize tiers:

| Tier | Badge color |
|------|------------|
| **Grand Prize** | Gold/yellow |
| **Runner Up** | Silver/gray |
| **MVP** | Purple |

### Adding a new prize

1. Click **"Add Prize"** (top right)
2. Fill in:
   - **Title** (required) -- e.g., "TCL 65-inch QLED TV"
   - **Description** (optional) -- more details about the prize
   - **Tier** -- select Grand Prize, Runner Up, or MVP
   - **Value** (optional) -- e.g., "$5,000" or "N500,000"
   - **Image** -- click "Upload Image" to add a photo of the prize via Cloudinary
3. Click **"Create"**

### Editing a prize

Click the pencil icon to open the edit form. Make changes and click **"Update."**

### Deleting a prize

Click the trash icon and confirm.

---

## 10. Zone Schedule

**Where:** Sidebar > **Zone** (or go to `/admin/zone`)

The Zone page manages activities and events happening in the Indoor Zone (the fan experience area at the tournament venue).

### Viewing zone activities

Activities are displayed as cards showing:
- Activity image (or a placeholder)
- Title and status badge
- Description
- Location, time, and capacity information
- Category tag

### Activity statuses

| Status | Meaning |
|--------|---------|
| **UPCOMING** | Activity has not started yet |
| **ACTIVE** | Activity is currently running |
| **PAUSED** | Activity is temporarily paused |
| **COMPLETED** | Activity is finished |

You can quickly change an activity's status by clicking the status buttons directly on each card. The currently active status is highlighted.

### Adding a new activity

1. Click **"Add Activity"** (top right)
2. Fill in:
   - **Title** (required)
   - **Description** (optional)
   - **Location** -- e.g., "Main Stage", "Gaming Area", "TCL Booth"
   - **Category** -- e.g., "Music", "Games", "Tech Demo"
   - **Start Time** and **End Time** (required) -- use the date-time picker
   - **Status** -- usually start with "Upcoming"
   - **Capacity** (optional) -- maximum number of participants
   - **Image** -- upload an image via Cloudinary
3. Click **"Create"**

### Editing an activity

Click the pencil icon on the activity card to open the edit form.

### Deleting an activity

Click the trash icon and confirm.

> **Tip:** On match day, use the quick status buttons on the cards to toggle activities between UPCOMING, ACTIVE, PAUSED, and COMPLETED as they progress throughout the day.

---

## 11. Notifications

**Where:** Sidebar > **Notifications** (or go to `/admin/notifications`)

### Notification templates

Templates are reusable notification messages that you can set up in advance. Each template has:
- **Key** -- a unique identifier (e.g., "welcome_notification", "match_start")
- **Title** -- the notification headline
- **Body** -- the full notification message
- **Category** -- a label to organize templates

**To create a template:**
1. Click **"New Template"** (top right)
2. Fill in the Key, Title, Body, and Category fields
3. Click **"Save Template"**

**To edit a template:**
Click the pencil icon next to any template. Note that the Key cannot be changed after creation.

### Sending a notification

In the **"Send Notification"** section:

1. Type a **Title** for the notification
2. Type the **Body** (the full message)
3. Enter a **Category** (optional)
4. Choose the **Target Audience**:
   - **All Users** -- everyone registered in the system
   - **Fans Only** -- only users with the FAN role
   - **Captains Only** -- only team captains
5. Click **"Send Notification"**

After sending, a confirmation will appear showing how many users received the notification.

> **Warning:** Notifications are sent immediately and cannot be undone. Double-check your message and audience before clicking Send.

### Recent notifications

At the bottom of the page, you can see a list of recently sent notifications with their title, category, read status, and timestamp.

---

## 12. Content Management

**Where:** Sidebar > **Content** (or go to `/admin/content`)

This is a simple key-value content management system (CMS) for text that appears throughout the public site. Think of it as a list of labels and their values.

### How it works

Each content entry has:
- **Key** -- a name that identifies where this text appears (e.g., "homepage_title", "splash_tagline")
- **Value** -- the actual text or content
- **Type** -- the format of the value: Text, HTML, JSON, or URL

### Editing existing content

1. Find the entry you want to change
2. Edit the text in the value field
3. Click the **"Save"** button next to that entry

A "Modified" badge appears on entries you have changed but not yet saved. You can also click **"Save All"** at the top to save every modified entry at once.

### Adding new content

1. Click **"Add Entry"** (top right)
2. Enter the **Key** (use descriptive names like "homepage_title" or "footer_address")
3. Enter the **Value**
4. Select the **Type** (usually "Text")
5. Click **"Add"**

> **Important:** Changes appear on the public site immediately after saving. Be careful when editing -- any typos will be visible to fans right away.

> **Tip:** Ask your developer for the list of keys currently in use. Changing a key name will not automatically update the public site -- the site looks for specific key names.

---

## 13. Applications

**Where:** Sidebar > **Applications** (or go to `/admin/applications`)

This page is where you review team registration applications.

### Viewing applications

Applications are listed with these columns:
- **Team Name**
- **Applicant** (the person who submitted)
- **Status** (color-coded badge)
- **Date** (when submitted)

Use the **status filter** dropdown at the top to show only applications of a specific status.

### Application statuses

| Status | Color | Meaning |
|--------|-------|---------|
| **SUBMITTED** | Blue | New application, not yet reviewed |
| **UNDER REVIEW** | Yellow | Currently being evaluated |
| **SHORTLISTED** | Purple | Passed initial screening |
| **RESERVE** | Orange | On the waiting list |
| **CONFIRMED** | Green | Accepted into the tournament |
| **NOT SELECTED** | Red | Application was declined |

### Reviewing an application

1. Click on an application row to expand it
2. You will see:
   - **Form Data** -- all the information the applicant submitted (team name, contact info, etc.)
   - **Change Status** dropdown -- select a new status
   - **Reason for Status Change** -- provide a brief reason (optional but recommended for record-keeping)
   - **Notes** -- add internal notes that only admins can see
   - **Status History** -- a timeline showing every status change, when it happened, and the reason given

3. After making changes, click **"Save Changes"**

### Typical application workflow

1. Application comes in as **SUBMITTED**
2. Review it and change to **UNDER REVIEW**
3. If the team looks good, move to **SHORTLISTED**
4. After final selection, change to **CONFIRMED** (accepted) or **NOT SELECTED** (declined)
5. Use **RESERVE** for waitlisted teams

> **Tip:** Always add a reason when declining a team. This helps your team track decisions and respond to any follow-up questions.

---

## 14. User Management -- SUPER_ADMIN Only

**Where:** Sidebar > **Users** (or go to `/admin/users`)

> **Note:** This page is only accessible to users with the SUPER_ADMIN role. Regular ADMIN users cannot see or access it.

### Viewing users

The users page shows a table with:
- **Name**
- **Phone** number
- **Role** (shown as a colored badge)
- **Verified** status (green checkmark or gray X)
- **Joined** date
- **Actions** (Edit Role link)

### Searching for users

Use the search bar at the top to find users by name or phone number. Type your search and click "Search" or press Enter. Click "Clear" to reset.

### Pagination

If there are more than 20 users, use the left/right arrow buttons at the bottom to move between pages. The display shows how many users you are viewing out of the total.

### Changing a user's role

1. Click **"Edit Role"** next to the user
2. A dropdown will appear with four options:
   - **FAN** -- regular fan user
   - **CAPTAIN** -- team captain (can manage their team)
   - **ADMIN** -- admin access to the admin portal
   - **SUPER ADMIN** -- full admin access including user management
3. Select the new role
4. Click **"Save"** to confirm

> **Warning:** Be very careful when assigning ADMIN or SUPER_ADMIN roles. These give full access to the admin portal and all tournament data. Only give admin access to trusted team members.

> **Warning:** Do not remove your own SUPER_ADMIN role, or you will lose access to this page.

---

## 15. Match Day Workflow (Step-by-Step)

This section provides a practical checklist for running the admin portal during a tournament match day.

### Before Match Day (Day Before)

- [ ] Confirm all teams are set up correctly in **Teams** with rosters and logos
- [ ] Verify all matches for the day are visible in **Matches** with correct teams, times, and pitch assignments
- [ ] Prepare hero slides with match day messaging (set them to Inactive until ready)
- [ ] Set up zone activities in **Zone** with correct times and locations
- [ ] Pre-write a notification message for fans (you can draft it but send it in the morning)

### Morning of Match Day

- [ ] Go to **Campaign** and make sure the state is set to **LIVE**
- [ ] Activate your match day hero slides in **Hero Slides** (toggle them to Active)
- [ ] Send a notification to ALL users: "Match day is here! Gates open at [time]"
- [ ] Set zone activities to **UPCOMING** if not already

### Before Each Match

- [ ] Open **Matches** and click into the upcoming match
- [ ] Verify the correct Home Team and Away Team are assigned
- [ ] Verify the Pitch assignment is correct
- [ ] Make sure the match status is **SCHEDULED**
- [ ] Have the match detail page open on your device, ready to update

### During a Match

1. When the referee blows the whistle to start:
   - Change status to **LIVE FIRST HALF**
   - Click "Save Match"

2. As goals are scored:
   - Update the **Home Goals** or **Away Goals** number
   - Click "Save Match"
   - Scroll down to Match Events and add a **GOAL** event with the minute, side, and player name

3. For cards and substitutions:
   - Add events for YELLOW CARD, RED CARD, or SUBSTITUTION as they happen

4. At half-time:
   - Change status to **HALF TIME**
   - Click "Save Match"

5. When the second half starts:
   - Change status to **LIVE SECOND HALF**
   - Click "Save Match"

6. When the match ends:
   - Change status to **FULL TIME**
   - If penalties are needed (knockout stage), change to **PENALTIES** and update the penalty score fields
   - Once the final result is decided, change status to **COMPLETED**
   - Click "Save Match"

> **Tip:** Keep the match detail page open throughout the match. You do not need to navigate away -- just update the fields and click Save.

### After Each Match

- [ ] Double-check that the final score is correct
- [ ] Confirm the status is **COMPLETED**
- [ ] Make sure all key events (goals, cards) are recorded

### After All Matches for the Day

- [ ] Go to **Standings** and click **"Recalculate"** to update the group tables
- [ ] Verify the standings look correct
- [ ] Upload match photos and videos in **Highlights**
  - Set the media type (video or image)
  - Add a descriptive title and category (e.g., "Best Goals - Day 1")
  - Upload a thumbnail for video highlights
- [ ] Send a notification to ALL users with the day's results summary

### End of Tournament

- [ ] After the final match, ensure all scores and standings are final
- [ ] Upload the best highlights from the entire tournament
- [ ] Go to **Campaign** and advance the state to **POST_EVENT**
- [ ] Update hero slides with post-event content (winners, thank you messages)
- [ ] Send a final notification thanking fans for participating

---

## Quick Reference: Keyboard Shortcuts and Tips

- **Image uploads:** All image/video uploads go through Cloudinary. You can drag and drop files into the upload window, or click to browse your computer.
- **Saving:** Always look for the green "Saved successfully" or "Updated" message after clicking Save. If you see a red error message, try again or contact your developer.
- **Browser refresh:** If something looks stuck or data seems stale, refresh your browser page. The admin portal loads fresh data each time.
- **Multiple tabs:** You can open multiple admin pages in separate browser tabs. This is helpful on match day -- for example, keep the match detail page in one tab and standings in another.
- **Mobile:** The admin portal works on mobile browsers, but it is much easier to use on a laptop or tablet due to the amount of data entry involved.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Cannot access /admin | Make sure you are logged in and your account has ADMIN or SUPER_ADMIN role. Ask a Super Admin to check. |
| Page shows "Loading..." forever | Refresh the browser. If it persists, check your internet connection. |
| "Failed to save" error | Check your internet connection and try again. If the problem continues, contact your developer. |
| Standings show wrong numbers | Click the "Recalculate" button on the Standings page. Make sure all completed matches have correct scores and COMPLETED status. |
| Image upload not working | Make sure your file is a standard image format (JPG, PNG, WebP). Very large files may take longer to upload. |
| Cannot see the Users page | Only SUPER_ADMIN accounts can access User Management. Ask another Super Admin to upgrade your role if needed. |
| Changes not appearing on public site | Most changes appear immediately. Try refreshing the public site. For campaign state changes, clear your browser cache if needed. |

---

*This guide covers all admin portal functionality for the TCL x Arsenal Road to Greatness 2026 tournament app. If you have questions not covered here, contact your development team.*
