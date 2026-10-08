# Graph Report - wedding-invitations  (2026-10-08)

## Corpus Check
- Corpus is ~20,619 words - fits in a single context window. You may not need a graph.

## Summary
- 329 nodes · 623 edges · 14 communities (13 shown, 1 thin omitted)
- Extraction: 79% EXTRACTED · 21% INFERRED · 1% AMBIGUOUS · INFERRED: 128 edges (avg confidence: 0.85)
- Token cost: 262,133 input · 0 output

## Community Hubs (Navigation)
- Assets, Storage & Project Decisions
- Page Loader & Section Order
- Opening Heroes & Ornaments
- Guestbook, Memories & Supabase
- Events, Dates & Design-1 Mockup
- Lint & Dev Dependencies
- App Shell & Next Config
- TypeScript Config
- Config Schema & Design 2 Tokens
- Design 3 Branch & Template Rules
- Stack & Agent Instructions
- Floating Photo Gallery
- Save the Date Calendar
- PostCSS Config

## God Nodes (most connected - your core abstractions)
1. `Page()` - 22 edges
2. `Wedding Invitation mockup (v2, Claude Design)` - 20 edges
3. `Wedding Invitation UI Prompt (design 2 generation prompt)` - 19 edges
4. `compilerOptions` - 16 edges
5. `Invitation()` - 15 edges
6. `Design 3 "garden / daytime botanical" template` - 14 edges
7. `Wedding Invitation mockup (v1, Claude Design)` - 14 edges
8. `useOpening()` - 13 edges
9. `Memories()` - 11 edges
10. `react` - 11 edges

## Surprising Connections (you probably didn't know these)
- `weddingConfig object (all content in one typed config)` --semantically_similar_to--> `WeddingConfig`  [INFERRED] [semantically similar]
  uploads/wedding-invitation-ui-prompt.md → lib/wedding.ts
- `Theme as CSS custom properties on .wedding wrapper (color-mix derived)` --references--> `Page()`  [INFERRED]
  PROJECT_HISTORY.md → app/[slug]/page.tsx
- `Section 3: floating tilting photo cards` --conceptually_related_to--> `Gallery()`  [INFERRED]
  uploads/wedding-invitation-ui-prompt.md → components/Gallery.tsx
- `New optional config: events[].image and guestbook.image` --references--> `Guestbook()`  [INFERRED]
  PROJECT_HISTORY.md → components/Guestbook.tsx
- `Gold wax seal image (images/seal.png) with soft-light sheen` --references--> `assetUrl()`  [AMBIGUOUS]
  Wedding Invitation v2.dc.html → lib/wedding.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **New client onboarding flow** — project_history_new_client_checklist, project_history_weddings_table, project_history_config_jsonb, project_history_bucket_wedding_assets, project_history_flat_upload_naming_convention, project_history_preview_mode, project_history_whatsapp_preview_cache [EXTRACTED 1.00]
- **Per-wedding design selection via config.design** — project_history_config_jsonb, app_slug_page_page, project_history_design_2, project_history_design_3_garden, project_history_designs_map, components_hero_hero, components_invitation_invitation [INFERRED 0.85]
- **Opening gesture (useOpening) fires wedding:open which starts music** — components_useopening_useopening, project_history_wedding_open_event, components_music_music, components_hero_hero, components_invitation_invitation [EXTRACTED 1.00]
- **Scroll-driven invitation opening (progress p drives doors, seal crack, names wipe, music start)** — wedding_invitation_dc_invitation_section, wedding_invitation_dc_sealed_card, wedding_invitation_dc_split_wax_seal, wedding_invitation_dc_names_scene, wedding_invitation_dc_rendervals, wedding_invitation_dc_music_control [EXTRACTED 1.00]
- **Event date flow: eventParts feeds calendar card, countdown and .ics save-the-date** — wedding_invitation_dc_eventparts, wedding_invitation_dc_calendar_card, wedding_invitation_dc_rolling_digits, wedding_invitation_dc_save_the_date_ics, lib_wedding_eventparts [INFERRED 0.85]
- **Wax seal motif across invitation, guestbook stamp and v2 gold seal** — wedding_invitation_dc_split_wax_seal, wedding_invitation_dc_sent_stamp_seal, wedding_invitation_v2_dc_gold_seal_image, components_guestbook_waxseal, components_invitation_sealhalf [INFERRED 0.75]

## Communities (14 total, 1 thin omitted)

### Community 0 - "Assets, Storage & Project Decisions"
Cohesion: 0.06
Nodes (39): Music(), publicStorageUrl(), assetUrl resolution (absolute/"/" unchanged, ASSET_BASE override, else Supabase), design2-card branch (full-screen card, vine/seal art; merged), master branch (production, auto-deploy), save-the-date-calendar branch (776367d, merged as 1d171de), memories storage bucket (guest upload while published), wedding-assets storage bucket (public read, member write) (+31 more)

### Community 1 - "Page Loader & Section Order"
Cohesion: 0.10
Nodes (31): fontParam(), generateMetadata(), getWedding, load(), Page(), Props, VerifyDesign3(), w (+23 more)

### Community 2 - "Opening Heroes & Ornaments"
Cohesion: 0.09
Nodes (33): clamp(), Hero(), Props, clamp(), Invitation(), PanelVines(), Props, SealHalf() (+25 more)

### Community 3 - "Guestbook, Memories & Supabase"
Cohesion: 0.10
Nodes (30): fetchMessages(), Guestbook(), Props, Spinner(), WaxSeal(), fetchMemories(), Memories(), Props (+22 more)

### Community 4 - "Events, Dates & Design-1 Mockup"
Cohesion: 0.10
Nodes (31): Ev, Events(), Props, VenueCard(), formatClock(), New optional config: events[].image and guestbook.image, Section 5: church location VenueCard with Google Maps button, Wedding Invitation mockup (v1, Claude Design) (+23 more)

### Community 5 - "Lint & Dev Dependencies"
Cohesion: 0.09
Nodes (22): eslintConfig, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node, @types/react (+14 more)

### Community 6 - "App Shell & Next Config"
Cohesion: 0.11
Nodes (12): metadata, Home(), nextConfig, scripts, build, dev, lint, start (+4 more)

### Community 7 - "TypeScript Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 8 - "Config Schema & Design 2 Tokens"
Cohesion: 0.20
Nodes (13): WeddingConfig, Design 2 palette: night #1A0A0C, paper #F7E4CC, velvet #6E0D1A, gold #C8A35F, Design 2: candlelit sealed card (config.design = 2, data-design="2"), Wedding Invitation UI Prompt (design 2 generation prompt), candle token (#F3D9A4 names, glows), Design direction: candlelit ballroom at night, gold token (#C8A35F hairlines, vines), night token (#1A0A0C page background) (+5 more)

### Community 9 - "Design 3 Branch & Template Rules"
Cohesion: 0.14
Nodes (9): design2-flatten branch (remove pale panels, shared name sweep; not merged), design3-garden branch (designs map + design 3; local only), DaySchedule (events[] as hour-by-hour schedule), Faq (native <details>, no JS), Story (timeline), Travel, Design 3 "garden / daytime botanical" template, DESIGNS map + DesignProps bundle (components/designs/1|2|3.tsx, fallback 1) (+1 more)

### Community 10 - "Stack & Agent Instructions"
Cohesion: 0.20
Nodes (8): Agent block auto-written by next dev (generate-agent-files.js), dependencies, next, react, react-dom, @supabase/supabase-js, Next.js 16.3.4 App Router, React 19.2, TypeScript, Tailwind v4, Prompt tech stack: React, Tailwind, shadcn/ui, Motion, Lenis, lucide-react

### Community 11 - "Floating Photo Gallery"
Cohesion: 0.29
Nodes (10): Card, DELAY, DESKTOP, DUR, idle(), MOBILE, ROT, Animation: floaty (photo cards) (+2 more)

### Community 12 - "Save the Date Calendar"
Cohesion: 0.36
Nodes (7): esc(), GET(), stamp(), RFC-5545, Open item 7: Android Save the Date (.ics vs Google Calendar) undecided, Save the Date endpoint (app/api/calendar/route.ts), Save the date link (data: URI .ics download)

## Ambiguous Edges - Review These
- `PanelVines()` → `Gold line-art bouquet on left door`  [AMBIGUOUS]
  Wedding Invitation v2.dc.html · relation: implements
- `SealHalf()` → `Gold wax seal image (images/seal.png) with soft-light sheen`  [AMBIGUOUS]
  Wedding Invitation v2.dc.html · relation: implements
- `Ornaments()` → `Hanging gold florals with red roses (SVG symbol #hang, sway)`  [AMBIGUOUS]
  Wedding Invitation.dc.html · relation: implements
- `assetUrl()` → `Gold wax seal image (images/seal.png) with soft-light sheen`  [AMBIGUOUS]
  Wedding Invitation v2.dc.html · relation: references

## Knowledge Gaps
- **82 isolated node(s):** `Props`, `metadata`, `w`, `Props`, `Ev` (+77 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 98 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `PanelVines()` and `Gold line-art bouquet on left door`?**
  _Edge tagged AMBIGUOUS (relation: implements) - confidence is low._
- **Why does `react` connect `Page Loader & Section Order` to `Guestbook, Memories & Supabase`, `Opening Heroes & Ornaments`, `Floating Photo Gallery`, `Lint & Dev Dependencies`?**
  _High betweenness centrality (0.102) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Page()` (e.g. with `Theme as CSS custom properties on .wedding wrapper (color-mix derived)` and `DESIGNS map + DesignProps bundle (components/designs/1|2|3.tsx, fallback 1)`) actually correct?**
  _`Page()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Props`, `metadata`, `w` to the rest of the system?**
  _82 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Assets, Storage & Project Decisions` be split into smaller, more focused modules?**
  _Cohesion score 0.05697278911564626 - nodes in this community are weakly interconnected._
- **What is the exact relationship between `SealHalf()` and `Gold wax seal image (images/seal.png) with soft-light sheen`?**
  _Edge tagged AMBIGUOUS (relation: implements) - confidence is low._
- **Why does `Invitation()` connect `Opening Heroes & Ornaments` to `Config Schema & Design 2 Tokens`, `Page Loader & Section Order`, `Events, Dates & Design-1 Mockup`?**
  _High betweenness centrality (0.081) - this node is a cross-community bridge._