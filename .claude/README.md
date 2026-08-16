# Handoff: Argo Loro Kopi — Landing Hero

## Overview
Hero section for Argo Loro Kopi, a coffee shop between Mount Merapi and Mount Merbabu in Selo, Boyolali. Full-viewport image carousel hero with entrance animations, tagline/hours/directions info bar, and a WhatsApp reservation CTA.

## About the Design Files
`Coffee Landing Hero.dc.html` is a **design reference built in HTML** — a working prototype of look, layout, and motion, not production code to copy verbatim. Recreate it in the target codebase's existing framework (React, Vue, etc.) using that codebase's component/styling conventions. If no framework exists yet, choose the most appropriate one for the project.

## Fidelity
**High-fidelity.** Colors, type, spacing, copy, and animation timing below are final — implement pixel-for-pixel using the target codebase's own component/styling system (not by embedding this HTML).

## Screens / Views

### Hero (single view)
**Purpose:** First-impression fold — sell the mountain-view concept, surface hours/location, drive a WhatsApp reservation.

**Layout:** Full-viewport (`100vh`, min-height 640px) section, `position: relative`, content stacked with `z-index`:
1. Background image carousel (3 slides, absolute, z-index 0)
2. Dark gradient scrim (absolute inset 0, z-index 1)
3. Text/CTA column (z-index 2, flex column, centered, anchored to bottom with 72px bottom padding)

Below the hero: a full-width info bar (dark bg, 20px vertical / 24px horizontal padding, flex row, wrap, centered, 40px gaps, thin 1px vertical dividers between items).

**Components:**
- **Background carousel:** 3 full-bleed photos, cross-fade between slides (opacity transition 1.2s ease). Each slide has a continuous Ken Burns zoom (scale 1 → 1.12, 22s ease-in-out infinite alternate, staggered by -6s per slide index so they're out of phase). Autoplay advances every 5.5s; 3 small dot indicators (9px circles) at the bottom of the hero are clickable to jump to a slide — active dot: accent-orange fill + 1.3x scale; inactive: white at 40% opacity.
- **Gradient scrim:** `linear-gradient(180deg, rgba(10,9,8,0.15) 0%, rgba(10,9,8,0.35) 45%, rgba(8,7,6,0.88) 100%)` — ensures text contrast regardless of photo content.
- **Eyebrow:** "ARGO LORO KOPI" — Inter 600, 14px, letter-spacing 0.22em, uppercase, accent orange.
- **Headline:** "⛰ Coffee Between The Mountains 🏔" — Manrope 800, `clamp(32px, 5.6vw, 64px)`, line-height 1.08, off-white (`oklch(0.98 0.005 90)`), subtle text-shadow for legibility over photo, max-width 20ch.
- **Subline:** "🕘 Open Daily · 9AM – 9PM" — Inter 600, `clamp(16px, 2vw, 20px)`, letter-spacing 0.02em, accent orange (matches CTA color, not off-white).
- **CTA button:** "Reserve via WhatsApp" — pill (border-radius 999px), Manrope 700, 17px, dark text (`#1a1208`) on accent-orange background, 16px/32px padding, soft drop shadow. Hover: `brightness(1.08)`. Links to `https://wa.me/6281328256724`.
- **Info bar** (below hero fold): single centered "📍 Get Directions — Selo, Boyolali" link (Inter 600, 15px, accent orange, underline on hover) pointing to `https://maps.app.goo.gl/bcYDaJoT8vpgFmes9`.

## Interactions & Behavior
- **Autoplay:** background slide advances every 5.5s (configurable).
- **Manual nav:** clicking a dot jumps to that slide and resets the autoplay-driven active index.
- **Entrance animation:** on load, eyebrow → headline → subline → CTA → dots fade up sequentially (`translateY(28px)→0`, opacity 0→1, 0.8–0.9s ease-out), staggered 0.1s / 0.25s / 0.4s / 0.55s / 0.7s delays, `animation-fill-mode: both` so elements stay hidden until their delay elapses.
- **Ken Burns:** each background photo continuously scales 1→1.12 and back (22s, infinite, alternating), independent of the fade/autoplay cycle, staggered per slide for visual variety.
- No responsive breakpoints beyond fluid `clamp()` type sizing; info bar wraps on narrow viewports.

## State Management
- `activeSlideIndex` (0–2): drives which background photo is visible/opaque and which dot is highlighted. Set by autoplay interval and by dot click.

## Design Tokens
- **Colors:** accent orange `#E08A3E` (tweakable); off-white text `oklch(0.98 0.005 90)` / `oklch(0.92 0.01 90)`; dark bg `#141210` / `#0b0b0a`; scrim per gradient above.
- **Type:** Manrope (700/800) for display headline/CTA; Inter (400/500/600) for eyebrow, body, info bar.
- **Radius:** CTA pill = 999px.
- **Shadow:** CTA `0 8px 24px rgba(0,0,0,0.3)`; headline text-shadow `0 2px 24px rgba(0,0,0,0.35)`.

## Assets
Three background photos (currently placeholders — real photos of the storefront, mountain view, and coffee bar interior needed): storefront, mountain view, coffee bar interior. Source location: Argo Loro Kopi, Selo, Boyolali (between Mt. Merapi and Mt. Merbabu).

## Files
- `Coffee Landing Hero.dc.html` — full design reference (template + logic in one file; open directly in a browser).
- `image-slot.js` — placeholder image-drop helper used only in the prototype; not needed in production (swap for real `<img>`/`background-image` in the target codebase).
