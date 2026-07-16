
# Mysterious 3D Digital Experience

Turn the portfolio into a full-page, scroll-driven 3D world. Occult Violet palette, WebGL centerpiece is your train portrait shattered onto floating 3D planes that assemble as you scroll. Existing copy, sections, and nav stay — they get re-hosted inside the 3D scene.

## The experience (top to bottom)

```
┌─────────────────────────────────────────────┐
│ VOID           ✦ dust motes drifting         │ ← Enter
│                                              │
│    fragments floating in deep space          │
│    "Saksham Arya"  aka Mr. Vortex           │
│                                              │
└─────────────────────────────────────────────┘
         ↓ scroll — camera pushes in
┌─────────────────────────────────────────────┐
│  fragments swirl inward, form portrait       │ ← Introduction
│  ▓▓▓▓▓                                       │
│  ▓▓▓▓▓   About copy on floating glass card   │
│  ▓▓▓▓▓                                       │
└─────────────────────────────────────────────┘
         ↓ portrait dissolves back to shards
┌─────────────────────────────────────────────┐
│  Shards align into a vertical timeline rail  │ ← Journey
│    ● 2024 · ● 2025 · ● 2026                  │
└─────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────┐
│ Orbiting skill nodes around a violet core    │ ← Skills
└─────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────┐
│ Project cards on 3D planes, camera dollies   │ ← Work
│ past each like keynote slides in space        │
└─────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────┐
│ Fragments scatter back into the void          │ ← Contact
│ Glass contact console floats center            │
└─────────────────────────────────────────────┘
```

## Visual identity

- **Palette (locked):** `#08060f` void, `#150c24` deep violet, `#3b1e6e` arcane purple, `#a78bfa` luminous accent
- **Type:** Instrument Serif (display) + Inter (body) — kept from current site
- **Mood:** occult, quiet, expensive. Slow motion. Volumetric fog. Chromatic aberration on the accent light. Grain overlay.
- **Sound of silence:** no autoplay audio; optional ambient-drone toggle in header (muted by default).

## Signature: Fragmented Portrait

Your train portrait is sliced into ~40 rectangular planes in 3D space. Three states driven by scroll progress:

1. **Scattered** (Hero): planes drift in a wide volumetric cloud, slow rotation, parallax on cursor.
2. **Assembling** (About section): planes ease toward their grid positions, portrait resolves.
3. **Dissolving** (Journey onward): planes peel off, become the ambient particle field for the rest of the page.

Each plane samples the correct UV region of the portrait texture, so it looks like the photo itself is breaking apart in space — not generic particles.

## Scene composition

- **Camera:** perspective, scroll-linked dolly + subtle mouse parallax. Slow, weighty easing (no snap).
- **Lighting:** one key violet point light, soft rim from `#a78bfa`, black ambient. Bloom pass.
- **Fog:** exponential violet fog so distant fragments fade into the void.
- **Particles:** ~800 dust motes on a separate layer, additive blend, drift + twinkle.
- **Post:** Bloom + Vignette + Chromatic Aberration + Film grain (react-postprocessing).
- **Grid floor:** faint infinite grid far below the camera, mask-faded, for depth.

## Section content in 3D

Copy stays as DOM (for SEO + a11y + selectable text) but is rendered inside `<Html>` portals from `@react-three/drei`, positioned in world space so it floats with the scene. Each section is a "chapter" — camera keyframes advance on scroll (GSAP ScrollTrigger driving a timeline; `useFrame` reads progress).

## Performance & fallbacks

- **Adaptive quality:** detect device pixel ratio, mobile, and `prefers-reduced-motion`. On low-end / reduced-motion: freeze the scene at hero state, disable bloom + fragments animation, keep static portrait grid + subtle particles.
- **DPR clamp:** `[1, 1.5]`, `powerPreference: 'high-performance'`.
- **Lazy:** the 3D canvas is a `React.lazy` chunk; loading screen already covers first paint.
- **Fallback:** if WebGL fails, render current 2D portfolio unchanged.

## Nav, cursor, loader

- Existing glass pill nav stays, restyled to Occult Violet tokens.
- Liquid chrome cursor kept, tinted violet on hover.
- Loading screen re-themed: violet vortex emblem, "ENTERING THE VOID" phase copy.

## Technical

- Deps: `three@^0.160`, `@react-three/fiber@^8.18`, `@react-three/drei@^9.122`, `@react-three/postprocessing@^2.16`, `gsap@^3.12` (ScrollTrigger).
- New files:
  - `src/three/Scene.tsx` — Canvas root, camera rig, lights, fog, post-processing.
  - `src/three/FragmentedPortrait.tsx` — instanced planes sampling the portrait texture, scroll-driven states.
  - `src/three/DustField.tsx` — points system.
  - `src/three/GridFloor.tsx`, `src/three/CameraRig.tsx`, `src/three/ChapterAnchors.tsx`.
  - `src/three/useScrollProgress.ts` — shared scroll driver (GSAP → MotionValue).
  - `src/three/SceneHtml.tsx` — wraps section DOM in drei `<Html>`.
- `src/index.css` — swap CSS tokens to Occult Violet HSL, retune shadows/glows.
- `src/pages/Portfolio.tsx` — replace `Aurora` + `ParticleBackground` with `<Scene>`; wrap each section in a chapter anchor; keep all content and copy unchanged.
- Remove: `Aurora.tsx`, `ParticleBackground.tsx` (superseded by the 3D scene).
- Keep: nav, cursor, loading screen, contact form, GitHub stats, all content data.

## What I won't touch

- Copy, project data, contact details, SEO tags — unchanged.
- Nothing needs a backend for this. No new secrets.

## Acceptance

- Scroll from top to bottom triggers a continuous camera flight; the portrait visibly assembles then dissolves.
- Every existing section is readable, in order, with correct content.
- Runs at 60fps on desktop, ≥30fps on mid-tier mobile (adaptive quality kicks in otherwise).
- `prefers-reduced-motion` users get a static, still-mysterious version.
- WebGL-off / crash → clean 2D fallback, site still fully usable.
