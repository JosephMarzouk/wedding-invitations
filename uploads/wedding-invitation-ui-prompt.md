Build a single-page, scroll-driven wedding invitation website as a reusable UI template. This is UI only: no backend, no auth, no database. All content comes from one config object so the same template can be reused for different couples.

## Tech

- React + TypeScript + Tailwind CSS.
- shadcn/ui only for form primitives (Input, Textarea, Button, Label).
- Motion (`motion/react`, formerly Framer Motion) for all animation: scroll-linked transforms (useScroll / useTransform), springs, drag, AnimatePresence.
- Lenis for smooth scrolling. lucide-react for icons.
- Every section is a self-contained React component that receives its data through props. Don't use framework-specific APIs (routing, image components, server functions). These components will later be moved into a Next.js App Router project as client components.

## Attached images and how to use each

- Cream gatefold card with gold vine line art and a red wax seal with a rose: style reference for the invitation card in Section 1. Rebuild it in code (two paper panels, SVG vines, wax seal). Don't just place the image.
- Ballroom with red rose arches and crystal chandeliers: blurred background for Section 2.
- Candlelit ballroom with crimson velvet drapes and rose centerpieces: mood reference for color and lighting across the whole page.
- Four couple photos (couple framed on a phone screen, lace sleeves with ring, black-and-white first dance, garden portrait): the four floating photo cards in Section 3.
- Couple on stone church steps under a gothic arch: background of the church card in Section 5.
- Outdoor arch with burgundy drapes, roses and lanterns: background of the message form in Section 6.
- Screenshot of my current countdown section: the exact visual reference for Section 4.

## Design direction

Mood: a candlelit ballroom at night. Deep crimson roses, velvet, warm gold, glowing candlelight. The cream paper of the invitation is the only light surface on the page; once it opens, everything lives in the dark, warm world of the ballroom photos. Sections blend into each other with soft gradients so the page reads as one continuous evening, with no hard edges between sections.

Colors (define as CSS variables and Tailwind theme tokens):

| Token  | Hex     | Use |
|--------|---------|-----|
| night  | #1A0A0C | Page background (warm oxblood black, not neutral black) |
| velvet | #6E0D1A | Primary crimson: buttons, overlays |
| rose   | #A8182B | Highlights, wax seal |
| gold   | #C8A35F | Hairlines, vines, focus rings, small type |
| paper  | #F7E4CC | Invitation card surface, photo mats |
| candle | #F3D9A4 | Names, soft glows and highlights |

Typography (Google Fonts):

- Pinyon Script: couple names only, like engraved formal stationery.
- Bodoni Moda: everything else (headings, countdown digits, body). Use its optical sizes. Body 17–18px, line-height 1.6.
- Amiri: optional Arabic lines (secondary venue name).
- Center-align the page. It's a ceremonial, symmetrical composition, like the rose arches.

Motion principles:

- One hero moment: the seal breaking and the card opening onto the ballroom and the names. Make that sequence beautiful and keep everything else quieter.
- Motion that answers the guest (opening the card, touching photos, sending a message) can be expressive. Ambient motion stays slow and subtle.
- Animate only transform and opacity. Never animate blur.
- Respect prefers-reduced-motion: replace scroll scrubbing, floating and 3D tilt with simple fades.

## Sections, in order

### 1. Sealed invitation (landing)

- Full viewport, night background with a faint warm candle glow behind the card.
- Card: portrait (about 9:16 on mobile, max ~420px wide on desktop). Two paper panels meet on a vertical seam slightly right of center, like the reference; the left panel overlaps the right with a soft shadow along its edge. Gold SVG vine line art grows from the top-left and bottom-right corners. A glossy red wax seal with an embossed rose sits on the seam.
- Idle: a slow candlelight sheen moves across the seal. Below the card, small gold italic text "Tap to open" with a gently bobbing down chevron.
- Opening, triggered by scrolling down OR tapping/clicking the card:
  1. The seal cracks and its two halves travel with their panels.
  2. The panels swing open like doors (3D rotateY with perspective; left panel pivots on its left edge, right panel on its right edge) while the card scales up, so we pass through the doorway.
  3. The Section 2 scene is revealed behind them.
- Put the Section 2 scene (blurred ballroom and names) as the layer behind the card inside a ~200vh container with a sticky viewport, so the doors literally open onto it. Scroll progress scrubs the opening. A tap animates to fully open and smoothly scrolls to the end of the sequence.
- The card is a button with aria-label "Open invitation" and opens with Enter or Space.

### 2. Names

- Full viewport. Background: the rose-arch ballroom photo, heavily blurred, with a dark warm gradient overlay so the names read clearly. Apply the blur once to a static layer and animate only its scale (1.1 to 1.0 with scroll).
- Content: only the couple's names (groom, ampersand, bride). Nothing else in this section.
- Names in Pinyon Script, large (roughly clamp(56px, 12vw, 128px)), candle color with a soft glow. The ampersand is smaller, in gold, on its own line on mobile.
- As the doors finish opening, the names write in from left to right once (mask reveal), like ink.

### 3. Floating photo cards

- Background: soft blurred red and cream rose bokeh (layered radial gradients) over night.
- Four photo cards in a scattered collage, not a uniform grid: different sizes, each slightly rotated (for example −6°, 4°, −3°, 7°), overlapping a little, like photographs laid on a table. Each photo sits in a thin paper-colored mat with a gold hairline border and a deep soft shadow.
- Optional one-line caption from config above the cards.

Mobile layout:

```
┌───────────────────────┐
│   ┌─────┐             │
│   │  1  │  ┌───────┐  │
│   │     │  │   2   │  │
│   └─────┘  │       │  │
│ ┌───────┐  └───────┘  │
│ │   3   │   ┌─────┐   │
│ │       │   │  4  │   │
│ └───────┘   └─────┘   │
└───────────────────────┘
```

On desktop, spread the four cards wider around the center.

- Idle: each card floats gently up and down a few pixels, each with a different duration and phase (4–7s cycles).
- Interaction, the key feature of this section:
  - Mouse: while the cursor moves over a card, it tilts in 3D toward the pointer, lifts (scale ~1.05, larger shadow) and drifts slightly away from the cursor. On leave it springs back.
  - Touch: tapping a card makes it bounce and tilt toward the touch point. Cards can be dragged and spring back to their place on release.
  - Use spring physics for every movement so it feels soft and physical.

### 4. Countdown

- Match the attached screenshot of my current countdown section exactly: layout, spacing, typography, colors, borders and proportions. If no screenshot is attached, use a paper-colored calendar card with gold hairlines on the night background.
- Structure, top to bottom: section title "The Countdown"; a calendar card showing the year, the month name in capitals, the short weekday with the day number (e.g. SAT / 24), the full weekday, the time and "SAVE THE DATE"; then a "COUNTDOWN" label with four units, DAYS, HRS, MIN, SEC, as zero-padded two-digit numbers.
- Derive every value from one ISO date with a timezone offset in config, so guests in other countries see the correct time left.
- Numbers update every second. When a digit changes, it rolls vertically.
- Once the date has passed, show 00 in every unit and replace the "COUNTDOWN" label with "Just married".

### 5. Church location

- A tall card (radius ~28px) with the church-steps photo as background and a dark gradient rising from the bottom. On it: church name in Bodoni Moda, the optional Arabic name below it in Amiri, and the ceremony time.
- Directly below, a location box: map-pin icon, address text, and a full-width "Open in Google Maps" button. The button links to the maps URL from config (format: https://www.google.com/maps/search/?api=1&query=LAT,LNG), opens in a new tab with rel="noopener noreferrer", and opens the Google Maps app on phones.
- Build this as a reusable VenueCard component so a second venue can be stacked below later with the same design.

### 6. Leave a message

- Full-bleed background: the burgundy arch with lanterns, under a dark overlay (~55%) so text stays readable.
- Centered glassmorphism panel: backdrop-filter blur ~20px, background rgba(255, 240, 225, 0.10), 1px border rgba(255, 255, 255, 0.18) with a slightly brighter top edge, radius ~24px, faint inner glow. Use a more opaque background as a fallback when backdrop-filter isn't supported.
- Title "Leave a message", subtitle "Write your wishes for the couple".
- Fields: "Your name" (Input) and "Your message" (Textarea, 300 characters max with a live counter). Inputs are a lighter glass layer with clearly readable placeholder text and a visible gold focus ring.
- Button: "Send message", velvet fill with a gold hairline border.
- States:
  - Validation: "Add your name so the couple knows who wrote this." and "Write a message before sending."
  - Sending: button disabled, spinner, "Sending…".
  - Sent: fields clear, a small red wax seal with the rose stamps onto the panel, and the text "Message sent".
- The component takes an `onSubmit(name, message)` prop that returns a Promise. Mock it with a 1.2s delay for now.

## Config

Put all content in one typed `weddingConfig` object and pass it down through props:

```ts
export const weddingConfig = {
  groomName: "Daniel",
  brideName: "Sophia",
  eventDate: "2027-04-24T18:00:00+02:00",
  invitation: { openHint: "Tap to open" },
  names: { backgroundImage: "/images/hall.jpg" },
  gallery: {
    caption: "Our next chapter starts with all of you beside us.",
    photos: [
      { src: "/images/couple-1.jpg", alt: "The couple framed on a phone screen" },
      { src: "/images/couple-2.jpg", alt: "The bride's lace sleeves around the groom" },
      { src: "/images/couple-3.jpg", alt: "First dance, seen from above" },
      { src: "/images/couple-4.jpg", alt: "Portrait of the couple in a garden" },
    ],
  },
  countdown: { afterEventLabel: "Just married" },
  ceremony: {
    name: "St. George's Church",
    nameSecondary: "", // optional, e.g. Arabic name
    time: "6:00 – 7:00 PM",
    address: "Church street address",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=LAT,LNG",
    image: "/images/church.jpg",
  },
  message: { backgroundImage: "/images/message-bg.jpg", maxLength: 300 },
};
```

## Quality bar

- Mobile first: design at 375px, then tablet and desktop.
- Lazy-load every image below the hero.
- Every photo has alt text from config.
- Visible keyboard focus everywhere; text contrast stays readable on every background.
- Don't add a navbar, footer, RSVP, music player or any section not listed above.
