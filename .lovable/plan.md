# Navbar Refinement — Futuristic Glass Pill v4

Only the `Header` component in `src/pages/Portfolio.tsx` changes. No other sections, no routing, no data changes.

## Visual direction (selected)

- Slim glass pill, always in the pill state (drop the "wider on top / shrink on scroll" toggle in favor of one refined pill that just gets a stronger shadow after scroll).
- Rotating conic-gradient hairline border around the pill (slow 6s spin, speeds to 3s on hover).
- Inner pill: near-black `#080808/85` with heavy backdrop blur, inset highlight on top edge, inset shadow on bottom.
- Left cluster: white monogram chip `SA` (black text, soft white glow) + `MR. VORTEX` wordmark, separated from links by a hairline divider.
- Center: 5 numbered links (`01 About` … `05 Vision`). Mono numerals in `text-foreground/30`, label in `text-foreground`. Inactive links at `opacity-50`; active link full opacity with a small pulsing dot indicator underneath.
- Right cluster: theme toggle + white pill "CONTACT" CTA (black text, subtle glow on hover), hairline divider on the left.
- Hover on any link: `scale-105`, opacity → 100, mono numeral brightens. Active tap: `scale-95`.

## Active section behavior

- Track the currently visible section via a scrollspy (IntersectionObserver on `#about`, `#journey`, `#skills`, `#work`, `#vision`, root margin tuned so a section becomes active when it crosses ~40% viewport).
- Apply the "active" styling (full opacity + pulsing dot) to the link whose href matches the active section id. On page top, `#about` is active.

## Mobile

- Below `md`, keep the current hamburger button but restyle its container to match the new pill (same border-gradient wrapper, same inner surface).
- Mobile drawer already exists further down in `Header`; keep its behavior, just update its container styles to match.

## Implementation notes (technical)

- File: `src/pages/Portfolio.tsx`, `Header` component (lines ~939–1000 area).
- Add a new keyframe `spin-slow` and `pulse-dot` in `src/index.css` (or reuse existing `animate-pulse` and Tailwind's built-in `animate-spin` with an arbitrary duration via `[animation-duration:6s]`). Prefer arbitrary values to avoid touching config.
- Conic gradient border: wrapper `div` with `p-[1px] rounded-full overflow-hidden`, absolute child with `bg-[conic-gradient(from_0deg,transparent_40%,hsl(var(--foreground))_50%,transparent_60%)] animate-spin [animation-duration:6s]`, sized `inset-[-200%]` so the sweep is visible.
- Keep using existing semantic tokens (`foreground`, `background`, `muted-foreground`) — no hardcoded `#fff` / `#000`. The prototype's `bg-white` becomes `bg-foreground`, `text-black` becomes `text-background`, etc.
- Keep `VortexThemeToggle` and the existing `#contact` anchor; just restyle the wrapper.
- Scrollspy via `useEffect` + `IntersectionObserver`; store `activeId` in state; pass to link render.

## Out of scope

- No changes to nav item list, brand, routes, or any other section.
- No new dependencies.
