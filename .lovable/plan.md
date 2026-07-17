## Goal

Kill the busy WebGL orbit scene and give the site a calmer backdrop, then make key UI elements feel physically layered with a pronounced (but still tasteful) 3D tilt + parallax treatment.

## 1. Background — replace orbit with subtle starfield

Rewrite `src/components/vortex/WebGLWorld.tsx` (keeping the same export so `App.tsx` needs no change) to render only:

- Deep space background color + fog
- A single wide `Starfield` (~2000 points, small size, slow y-rotation)
- Very gentle scroll + mouse parallax on the camera (much smaller amplitude than today — no z-dolly)

Remove: `Core` (distortion icosahedron), `Shards` group, `Halo` torus, `Environment` preset, extra directional lights. Keep one ambient light. This drops GPU cost significantly and removes the "orbit" feel.

## 2. Reusable "3D plane" primitive

Add `src/components/vortex/Plane3D.tsx` — a cinematic wrapper built on framer-motion springs:

- Pointer-tracked `rotateX` / `rotateY` up to **±14°**
- `translateZ` lift on hover (~30px) with layered drop shadow for depth
- Cursor-following **glare sweep** (radial gradient, mix-blend-overlay)
- Optional `parallaxLayers` prop: children marked `data-depth="0.2 | 0.5 | 1"` translate on Z proportionally so foreground content pops off the card
- Scroll-linked subtle Y parallax (via `useScroll` + `useTransform`) so the plane drifts as it enters/exits the viewport
- `prefers-reduced-motion` → disables tilt + parallax

This replaces the lighter `TiltCard` at the call sites we touch (TiltCard itself stays for other usages).

## 3. Apply to hero portrait

In `src/pages/Portfolio.tsx` Hero:

- Wrap the portrait image + its gradient mask in `Plane3D` (pronounced preset)
- Split into depth layers: ambient blue/purple glow at depth `0.2`, portrait image at depth `0.6`, gradient mask overlay at depth `1.0`
- Keep the existing Ken Burns scale animation inside the portrait layer
- Add a soft grounded shadow beneath the card that scales with tilt

## 4. Apply to project cards

For each project card in the Work section:

- Wrap the card in `Plane3D`
- Depth layers inside: cover image (depth 0.3), title/meta text (depth 0.8), corner index number (depth 1.0)
- Hover: card lifts, glare sweeps, shadow deepens
- Preserve existing entrance reveal animations

## 5. Apply to section rail

`src/components/vortex/SectionRail.tsx`:

- Wrap the rail column in a light `Plane3D` variant (tilt only, no glare, ~6° max) so the rail feels attached to a floating panel
- Active indicator gets a small `translateZ` bump for depth
- On hover of a rail item, that row lifts slightly in Z

## 6. Verification

After build:
- Playwright screenshot of hero (idle + cursor top-right) to confirm tilt + glare
- Screenshot of Work section hovering one card to confirm depth lift
- Confirm no orbit shards/core visible in background — only stars
- Check console for r3f/three warnings

## Technical notes

- No new dependencies — framer-motion + existing r3f/drei are enough
- Reduced-motion guard added in `Plane3D`
- All tilt math uses springs (`stiffness: 200, damping: 20`) for smooth return
- `transform-style: preserve-3d` + `perspective: 1200px` on Plane3D root; children opt into depth via `data-depth`
