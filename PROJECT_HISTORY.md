# Wedding Invitations: Project History & Decisions

The record of everything built in this project between 11 Sep and 8 Oct 2026, and why. It was compiled from git history, the live Supabase schema and every Claude Code session on this repo. Last updated 2026-10-08.

---

## 1. What this is

This is a multi-tenant wedding-invitation website. One Next.js app serves every couple. Each wedding is a single database row, and its link is `https://wedding-invitations1.vercel.app/<slug>`.

| Thing | Value |
|---|---|
| Framework | Next.js **16.3.4** (App Router), React 19.2, TypeScript, Tailwind v4. Read `node_modules/next/dist/docs/` before coding, because this Next has breaking changes (see `AGENTS.md`) |
| Data | Supabase project `qzindghghrrsyuwrjspk` ("Wedding_invitations_db") |
| Hosting | Vercel project `wedding-invitations1`, connected to GitHub `JosephMarzouk/wedding-invitations`, branch `master` (auto-deploys to production) |
| Production URL | https://wedding-invitations1.vercel.app/ followed by the slug (`/demo`, `/demo2`, `/andrew-halla`) |
| Dependencies | Only `@supabase/supabase-js`. Animation libraries (Framer Motion, Lenis) and icon libraries (lucide) were deliberately not added; CSS transitions and inline SVG cover what was needed |
| Env vars | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, plus `NEXT_PUBLIC_ASSET_BASE` (dev only, see §5) |

---

## 2. Architecture

### Request flow
1. `app/[slug]/page.tsx` is a server component. It reads `?preview=<token>` and calls the RPC `get_wedding(p_slug, p_preview)`. If that returns null it calls `notFound()`.
2. `generateMetadata` builds the title (`A & B`) and the OpenGraph/WhatsApp image from `config.og`. Preview renders get `noindex` and a "Preview" badge.
3. If the guestbook or memories feature is on, the page loads approved `messages` (50) and `memories` (60).
4. The couple's theme becomes CSS custom properties (`--bg --ink --primary --accent --font-latin --font-arabic`) on a `.wedding` wrapper with `dir` and `lang` set. Every other colour is derived with `color-mix` in `app/globals.css`.
5. Fonts come from Google Fonts by the name stored in config, not through `next/font`, because they change per couple.

### Files (on `master`)
| Path | Role |
|---|---|
| `lib/supabase.ts` | Anon Supabase client. RLS and SECURITY DEFINER RPCs control all access |
| `lib/wedding.ts` | `WeddingConfig` type, `assetUrl` / `remoteAssetUrl`, `eventParts` (date in the couple's timezone), `formatClock`, EN/AR UI strings `t()` |
| `app/[slug]/page.tsx` | Loader and section order. Picks the design with `const d2 = c.design === 2` |
| `app/api/calendar/route.ts` | Save-the-date endpoint (§4.10) |
| `components/Hero.tsx` | Design 1 opener: full-screen doors that slide apart |
| `components/Invitation.tsx` | Design 2 opener: a full-screen sealed card with vine art and a wax seal |
| `components/useOpening.ts` | Shared scroll-scrubbed and tap-to-open logic; fires a `wedding:open` event that starts the music |
| `components/ornaments.tsx` | Shared vine ornaments |
| `components/Reveal.tsx` | IntersectionObserver rise-and-fade around each section (not used on the hero) |
| `Intro, Gallery, Countdown, SaveTheDate, Events, Guestbook, Memories, Music, ClosingNote` | Page sections |
| `app/page.tsx` | Still the default create-next-app starter page (§7) |

### Database (Supabase `public` schema; RLS on every table)
| Table | Purpose |
|---|---|
| `weddings` | One row per wedding: `slug` (unique, kebab-case, 3–60 chars), `config` jsonb (**all page content**), `published`, `preview_token`, `event_at`, `owner_email` |
| `messages` | Guestbook entries (`guest_name` ≤80, `body` ≤600). `approved` defaults to **true** |
| `memories` | Guest photo uploads (`storage_path`). `approved` defaults to **true** |
| `guests` | RSVP data (token, status, plus-ones). **Not used by the UI yet** |
| `wedding_members` | Owner and editor membership linked to `auth.users`. No admin UI yet |

- **RPCs (SECURITY DEFINER):** `get_wedding`, `post_message`, `post_memory`, `get_guest`, `submit_rsvp`.
- **Helper functions:** `is_wedding_member`, `wedding_is_published`, `path_wedding_published`, `path_wedding_member`.
- **Storage buckets (both public-read):**
  - `wedding-assets`: couple photos and songs. Only members can write.
  - `memories`: guests can upload into `<wedding_id>/` only while that wedding is published.

### The `config` jsonb (see `WeddingConfig` in `lib/wedding.ts`)
- **Core fields:** `design?`, `couple{a,b}`, `date` (ISO with offset), `city`, `locale` (`en`/`ar`), `hero{image,overlay,scrollCue}`, `intro{heading,body}`, `gallery[]`, `events[]{title,titleAr?,type,start,end,mapsUrl,image?}`, `guestbook?{image?}`, `theme{primary,accent,bg,ink,fontLatin,fontArabic}`, `music{url,autoplayOnTap}`, `features{guestbook,memories,rsvp}`, `og{image,description}`.
- **Why one jsonb blob:** the schema stays stable as templates change. A new template adds optional keys and needs no migration or RPC change.

### Live rows (as of 2026-10-08)
| Slug | id | Design | Notes |
|---|---|---|---|
| `demo` | c1fa1121-6505-4b57-a88a-48d214c54882 | 1 | Youssef & Mariam, photos at `/demo/...` |
| `demo2` | d613542e-51d4-43b8-983f-b0ec898b6e51 | 2 | Same couple, night palette, photos at `/demo/...` |
| `andrew-halla` | 05f352bf-1e25-4d17-b47a-abfd5b819377 | 2 | **First real client.** Andrew & Halla, 2026-11-03 18:00 Cairo, St. George Church, Heliopolis. Published |

---

## 3. Timeline

| Date | Commit / branch | What |
|---|---|---|
| 09-11 | `fef746e`, `dda896a` | create-next-app, then the first build of `/[slug]` from the Claude Design reference (`Wedding Invitation.dc.html`) |
| 09-11 | `8efb2b5` | Softer hero seam shadow (committed by Joseph). First successful production deploy |
| 09-11 | `b69de2e` | Music always resolves from real Supabase storage |
| 09-11 | `34fdfd5` | Music stops when the tab is hidden or closed. Unified light palette |
| 09-11 | `0a0adc6` | Doors slide horizontally instead of swinging; tap-to-open takes 1300 ms |
| 09-11 | `48f81d7` | `Reveal` rise-and-fade between sections |
| 09-11 | `81d3726` | Memories gets a "Choose from gallery" option; new `ClosingNote` |
| 09-11 | `d3c38be` | Memory photos fixed (404s); 2×2 paginated grid |
| 09-11 | `2523114` → PR #1 `01fb1f8` | **Design 2**, a candlelit sealed card, chosen with `config.design` |
| 09-11 | `a67a1b4` (`design2-card`) | Design 2 card fills the screen and uses the reference vine and seal art. Merged |
| 09-12 | `5766f4f`, `b219f81` (`design2-flatten`) | Removed the pale panels behind photos and names; soft name sweep shared by both heroes. **Not merged** |
| 09-15 | `4335198`, `ffd303e` (`design3-garden`, local only) | Designs become files behind a map; **Design 3 "garden"**. **Not merged, not pushed** |
| 09-30 | `776367d` → merge `1d171de` | Save the Date opens the guest's calendar. Merged and deployed |
| 09-30 → 10-08 | DB only | Andrew & Halla wedding created, photos uploaded, published, renamed |

---

## 4. Work and decisions, by topic

### 4.1 One repo, one deployment, one row per wedding
- **Decision:** every wedding is a row in `weddings`. A new client means a new row, not new code.
- **Rejected:**
  - A repo per wedding: duplicated code, duplicated fixes, and a Vercel project per couple.
  - A branch per wedding: preview URLs sit behind a Vercel login and fall behind master.
- **Branches are for review only.** A custom domain per couple can come later by pointing the domain at a slug.

### 4.2 Theming
- **Decision:** the couple's 4 colours and 2 fonts are stored in the row. A fixed system layer derives the rest (`--bg-secondary`, `--text-secondary`, `--text-muted`, `--text-on-dark`, and the surface roles `--paper --shade --seal --glow --field --glass-*`).
- **Design 1 light palette:**
  - Backgrounds `#F7F2E8` and `#EFE6D5`.
  - Ink `#2B211B` (headings), `#6F6256` (body), `#94877A` (muted).
  - Gold `#B08D57`, dark accent `#765B36`.
  - `#FFFDF8` for text on photos.
- **Text on photos** keeps its own dark overlay so it stays readable on any theme. Contrast was checked against WCAG AA.
- **The canvas stamp on memory photos uses literal hex,** because canvas cannot read CSS variables.

### 4.3 Images
- **Decision:** plain `<img>` instead of `next/image`, because storage URLs are cross-origin. This accepts 6 `no-img-element` lint warnings.

### 4.4 Arabic and RTL
- `locale: "ar"` gives:
  - `dir="rtl"` and the Arabic font.
  - Mirrored doors, name reveal and hairlines.
  - `titleAr` as the main venue name.
- Every UI string has both EN and AR versions in `lib/wedding.ts`.

### 4.5 Opening animation (design 1)
- The doors slide apart horizontally (the 3D swing was dropped). Tap-to-open runs a custom eased scroll of 1300 ms (easeInOutCubic). Under reduced motion it jumps instantly.
- **Gotcha:** the global `scroll-behavior: smooth` hijacked the per-frame `scrollTo` calls. Each frame now passes `behavior: "instant"`.
- **`Reveal` wraps every section except the hero,** because the hero already animates and would flash on load.

### 4.6 Music
- `<audio>` is started by the opening gesture (the `wedding:open` event) and pauses on `visibilitychange` or `pagehide`. The play/pause state follows the element's own events.
- **Decision:** songs must be **MP3 files in the bucket** (`<id>_song.mp3`). Spotify and YouTube links cannot feed an `<audio>` element.

### 4.7 Memories (guest photos)
- Two buttons: "Open camera" (live `getUserMedia`) and "Choose from gallery" (file input with no `capture` attribute). If camera permission fails, an inline error points the guest to the gallery option.
- Photos are shown in a fixed 2-column grid, 4 per page, with numbered pagination. After a new upload it jumps back to page 1.

### 4.8 Design 2: candlelit sealed card (`/demo2`)
- **Switch:** `"design": 2` in config sets `data-design="2"` on the wrapper. That turns on a token layer in `globals.css`. The couple's colours and fonts still apply.
- **Opener:** a full-screen two-panel paper card with gold vines and a maroon wax seal. Both were cut from Joseph's reference screenshot (his choice) and saved to `public/design2/`. The vines are alpha masks tinted with the couple's accent colour. The seal is split across the fold, so it cracks open with the doors. `hero.overlay` replaces the seal when set.
  - **Known limitation:** the art comes from a 1× phone screenshot and looks soft on desktop.
- **Extras:** design 2 keeps intro, memories and music, and drops the closing note (Joseph's choice).
- **Palette:** night `#1A0A0C`, paper `#F7E4CC`, velvet `#6E0D1A`, gold `#C8A35F`. Fonts are Pinyon Script, Bodoni Moda and Amiri.
- **New optional config:** `events[].image` (venue photo) and `guestbook.image` (form backdrop).

### 4.9 Templates that differ in structure (design 3, branch `design3-garden`)
Joseph asked how to build whole new templates with different sections. His decisions:
1. **Each template is a fixed, hand-written composition.** A per-wedding `config.sections` registry was rejected.
2. **Refactor the seam, then build one template to prove it.** Adding a third branch to the ternary was rejected.
3. **Design 3 is "garden / daytime botanical".**
4. **Template-specific content goes in optional jsonb keys** (`story?`, `travel?`, `faq?`). New columns or tables were rejected.
5. **No database or Vercel changes.** A template is a pure code deploy.

**How it's built:**
- The page builds one `DesignProps` bundle and looks the design up in a `DESIGNS` map (`components/designs/1|2|3.tsx`). Unknown numbers fall back to 1.
- Sections used by only one template go in `components/d3/`. **Rule: copy a shared section instead of adding props to it.**
- **Design 3 sections:**
  - `Arch`: the opener, built on the same `useOpening` contract.
  - `Story`: a timeline.
  - `DaySchedule`: the existing `events[]` shown as an hour-by-hour schedule, so no new schema.
  - `Travel`.
  - `Faq`: native `<details>`, so it needs no JS.
- **Contrast fixes:** the schedule time uses ink, because gold on cream is about 2.6:1.
- **Verified:** 1024px and 375px wide, RTL, and `/demo` and `/demo2` render byte-identical HTML.
- **Review harness:** `app/verify3/page.tsx` renders design 3 from a fixture at `localhost:3000/verify3`. It is marked "delete before merging". **It only compiles on `design3-garden`**: `master` lacks `components/designs/3`.

### 4.10 Save the Date (`app/api/calendar/route.ts`)
- **iPhone, iPad and Mac** get an inline `.ics`, which opens Safari's "Add to Calendar" sheet. **Everyone else** is redirected to a prefilled Google Calendar event, which Android opens in the Calendar app. The old `data:` URI download did neither on phones.
- The event lasts 4 hours. Text is escaped per RFC 5545, so a crafted title cannot inject extra calendar lines.
- **Still open:** whether Android should get the `.ics` instead. That would help Samsung phones but break Pixel and stock Google Calendar phones. The recommendation was to keep the current behaviour; Joseph has not answered.

---

## 5. Assets and client onboarding

- **`assetUrl(path)`:**
  - Returns absolute and `/...` paths unchanged.
  - With `NEXT_PUBLIC_ASSET_BASE` set (local dev), maps `bucket/<id>/x` to `${base}/x`.
  - Otherwise resolves against Supabase public storage.
- **`remoteAssetUrl(path)`** always uses Supabase. It is used for music and guest memories, because those have no local placeholder. Both earlier "music silent" and "memories 404" bugs came from the override.
- **2026-09-30:** `NEXT_PUBLIC_ASSET_BASE` was **removed from Vercel production**. Demo rows were rewritten to `/demo/...` paths served from `public/demo/`. Local `.env.local` may still set it.
- **Client upload convention (flat, no folders):** `wedding-assets/<wedding_id>_<n>.jpeg`, `<id>_cover.jpeg`, `<id>_background.jpg`, `<id>_song.mp3`. Config paths point straight at these names.

**New client checklist**
1. Copy a demo row's config (`demo` for design 1, `demo2` for design 2) into a new row with a new slug. Set `published=false` and `event_at`.
2. Set the couple, date (ISO with Cairo offset), city, events (Arabic name in `titleAr`, maps link), theme and locale. To hide an event, remove it from `events[]`; jsonb has no comments.
3. Joseph uploads the photos and MP3 using the flat names. **Check every file's size before publishing:** a 0-byte upload has happened, and the dashboard skips a re-upload when the name already exists.
4. Share the `?preview=<preview_token>` link for review, then set `published=true`.
5. WhatsApp caches link previews. After changing `og.image`, share the link with `?v=2`.
6. Renaming a slug breaks the old link (`/andro-hala` now returns 404).

---

## 6. How we work (standing rules)

- **Feature branches only.** Joseph reviews on the local dev server, and work is merged to `master` (which deploys to production) only when he explicitly says so.
- **One `next dev` per directory** (Next 16). If port 3000 is taken by another session, verify against it or use another port.
- **Browser-pane screenshots:** use a fresh tab and bring it to the front. Background tabs come out black and pause `requestAnimationFrame`. Scroll with `behavior: "instant"`.
- Commits carry a full rationale in their body. Pure refactors are verified as byte-identical HTML.

---

## 7. Open items (as of 2026-10-08)

1. **`design2-flatten` fixes are not live.** `5766f4f` (pale panels behind photos and names on design 2) and `b219f81` (shared soft name sweep) are on `design2-flatten` and `design3-garden` but **not on `master`**. That affects `/andrew-halla` (design 2).
2. **`design3-garden` is local only:** unpushed, unreviewed, and 2 commits behind master (it should merge cleanly). There is no `demo3` row and no seed for `story`, `travel` or `faq`.
3. **`app/verify3/` is untracked** and must not be committed to master (it breaks the build there). Delete it once design 3 is merged.
4. **`design2/` is untracked** design-reference material (a duplicate `.dc.html`, `_ds`, images, prompt). It is unused by the app and safe to delete or archive.
5. **Vercel Preview builds fail.** The Supabase env vars are only enabled for Production.
6. **Andrew & Halla:** music playback and the new WhatsApp preview image have not been verified on a real phone.
7. **The Android Save the Date question is undecided** (§4.10).
8. **No moderation:** guest messages and memories are approved by default.
9. **RSVP is not built.** The schema and RPCs (`guests`, `get_guest`, `submit_rsvp`) are ready; `features.rsvp` is unused.
10. **`/` is still the Next.js starter page.**
11. **Leftover files:** a test file `memories/c1fa1121-…/claude-test-upload.jpg` and some unrelated stock photos are still in the buckets.
12. **Design 2 vine and seal art is low-resolution;** swap it if originals turn up.
13. **6 `no-img-element` lint warnings** (accepted, §4.3).

---

## 8. Reference material in the repo

- `Wedding Invitation.dc.html` and `Wedding Invitation v2.dc.html`: Claude Design mockups (the approved visual reference for design 1). They need `support.js` and `_ds/`.
- `uploads/wedding-invitation-ui-prompt.md`: the original design-2 (candlelit) generation prompt.
- `uploads/*.jpg|png`: reference photos and screenshots used for the design-2 art.
- `graphify-out/`: knowledge graph of this repo (see `GRAPH_REPORT.md`). Rebuild with `/graphify . --update`.
