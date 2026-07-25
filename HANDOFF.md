# Studio Orpiment — Handoff

Snapshot of where the site stands and how it's put together. Written for future-me (or another collaborator) picking this back up cold.

## Project

Freelance studio site for **Studio Orpiment** — "interactive multimedia studio working in web-based and physical experiences most often in collaboration with artists and performers."

Landing page is a single-screen composition of rectangles that will eventually rearrange on scroll and on click. The dark rectangles are windows into a shared 3D world.

## Stack

- React + Vite + TypeScript
- Vanilla CSS (no Tailwind, no CSS-in-JS)
- react-three-fiber (r3f) for 3D
- Hosted on Vercel, auto-deploys on push to GitHub `main`
- Domain from Namecheap, DNS pointed at Vercel

Build: `tsc --noEmit && vite build`. Ship command: `npm run ship` (build + commit + push).

## Colors & Type

- `--color-bg: #D9D9D9` (light grey)
- `--color-orpiment: #EEBD34`
- `--color-ink: #2B1810` (dark brown/black)
- **Monstera** — logo only (SO glyph)
- **Purple Haze** — display
- **Rotor Overlay** — body (variable font)

All fonts are self-hosted from `/src/styles/fonts.css`. No Google Fonts.

## Layout system

A single 24-column CSS Grid on `.landing` handles both header and composition. Vertical alignment uses **named row lines** (`head-start`, `head-end`, `stage-start`, `rule-1`, `rule-2`, `rule-3`, `stage-end`) rather than matched pixel values, so rules and blocks share edges structurally.

Horizontal placement is by `grid-column: <start> / <end>`. Vertical proportions live in `grid-template-rows` as `var(--row-*)` values (vh-based so they can animate — `fr` units don't transition).

### Elements

- **`.landing__logo`** — Monstera "SO" glyph, cols 1/4, `z-index: 100` (breaks the grid, paints above everything including the 3D canvas)
- **`.landing__wordmark`** — cols 7/25, right-aligned, anchored to bottom of the header rows so it sits just above the top rule
- **`.landing__description`** — tagline, cols 21/25, right-aligned, `z-index: 100`
- **`.landing__rule--top/1/2/3`** — full-width horizontal rules on the named row lines
- **`.landing__vrule--lp-left/lp-right/rp-left/rp-right`** — vertical rules tracing the outline of the two portrait blocks, full stage height
- **`Block` × 4** — dark rectangles (`left-portrait`, `right-portrait`, `lower-left`, `lower-right`). Each carries `data-block-id` so the 3D canvas can clip to it
- **`.cell--bottom-1/2/3`** — transparent rectangles with a thin ink border, defined by the line grid along the bottom strip. Used for the paper-cutout experiment (see below)

### Stacking

- rules: `z-index: 0`
- portrait blocks: `1`
- vertical outline rules: `2`
- lower blocks: `3`
- 3D canvas: `50`
- cells: `60`
- SO logo, description: `100`
- section toggle button: `200`

## 3D architecture — "windows into one shared world"

One full-page `<Canvas>` at `z-index: 50`. A `requestAnimationFrame` loop reads every `[data-block-id]`'s `getBoundingClientRect()` and rebuilds a CSS `clip-path` from the union of those rects. Result: the canvas only renders inside the block regions; the grey page background shows through everywhere else, reading as "paper hiding the rest of the world."

The rAF loop caches the last path string and only pushes to React state when it actually changes, so steady-state frames cost nothing. Using rAF instead of ResizeObserver so clip-path stays synced through CSS transitions on the grid, not just size changes.

**No `pointer-events: none` on the canvas** — the sphere needs to be clickable. Clip-path already makes the between-block regions non-interactive at the pixel level, so clicks there pass through to the page.

### Current scene

`Scene.tsx` = `Lights` + `Sphere`. `Sphere.tsx` is a blue ball that:
- drifts on a slow non-repeating path (layered non-harmonic sines)
- floats up like a helium balloon on click (asymmetric `balloonCurve`, PEAK=0.3 for quick rise + lazy descent, C² smootherstep throughout)
- gets pushed away by the cursor on hover (raycaster onto z=0 plane, quadratic falloff)

`CattailMorph.tsx` — a 4-stage PLY point-cloud morph — is staged but not wired up. Swap `<Sphere />` for `<CattailMorph />` in Scene to try it.

Long-term: when we want per-block different projects, switch from single-Canvas + clip-path to drei's `<View>` pattern (each Block renders a `<View>`, canvas hosts `<View.Port />`).

## Section morphing (in progress)

The plan is a **single-screen experience** where scroll (and block clicks) rearrange the composition to reveal different content. `Landing.tsx` holds a `LAYOUTS: CSSProperties[]` array — each entry is a set of CSS variable overrides applied inline to `.landing`. A temporary bottom-right toggle button cycles through layouts (will be replaced by scroll/click triggers).

Each dark block and each cell has its own `--XX-x` / `--XX-y` translate offset variable, defaulting to 0 (home). Sections override those variables. Blocks keep their grid placement (and size); only `transform: translate(...)` changes, with an 800ms cubic-bezier transition.

### Paper-cutout experiment (last thing shipped)

The "cells" — rectangles defined by the existing line grid (bottom strip: rule-3 → stage-end, between the four vertical outline rules) — are now movable elements. Transparent background, 1px ink border, opacity 0.85. At home they visually merge into the existing rules (1px on 1px). Section 1 lifts them off and stacks them as a column on the left, carrying their borders like paper pieces.

**Open issue:** each cell has a bottom border with no matching stage-end rule line, so a faint extra horizontal line appears across the bottom of the cells at home. Two ways to fix:
1. Drop `border-bottom` on the cells
2. Add a `.landing__rule--bottom` at stage-end to match

Pending user pick.

## Key files

- `src/components/Landing/Landing.tsx` — composition, LAYOUTS array, section state
- `src/components/Landing/Landing.css` — grid, rules, vrules, blocks, cells, layout variables
- `src/three/ViewportCanvas.tsx` — single Canvas + clip-path rAF loop
- `src/three/Scene.tsx` — swap point for what the blocks show
- `src/three/Sphere.tsx` — drift + click-lift + hover-repulsion
- `src/three/CattailMorph.tsx` — parked, ready to swap in
- `src/three/Lights.tsx` — 3-point rig
- `src/components/Description/Description.tsx` — tagline with orpiment-on-ink highlight spans, each on its own line, right-aligned
- `src/styles/fonts.css` — @font-face for Monstera, Rotor Overlay
- `tsconfig.json` — no project references, `types: ["node", "vite/client"]`, includes vite.config.ts (Vercel build was failing on `__dirname` without these)

## Gotchas learned the hard way

- **`transform` breaks `background-attachment: fixed`** — it creates a fixed-positioning containing block. Used `position: relative; top: 50%` for the lower-block shift instead of `translateY(50%)`.
- **`fr` units don't transition** — use vh/% for anything you want to animate in `grid-template-rows`.
- **Mesh-level hover events oscillate** when the mesh is moving toward the cursor. Solved by reading canvas-level `state.pointer`, raycasting to z=0, and computing repulsion in world space.
- **Vercel build**: needs `@types/node`, `tsc --noEmit` (not `tsc`) because Vite handles emit, and vite.config.ts must be in the tsconfig `include`.
- **Git structure**: repo must be initialized *inside* the `studio-orpiment` folder, not the parent. Getting this wrong pushed a nested folder to GitHub.

## What's next

Short term:
- Resolve cell bottom-border issue
- Decide whether the paper-cutout metaphor is working; if so, expand cells across more rows
- Wire scroll to drive section changes (sticky `.landing` inside a taller outer container) and remove the toggle button

Medium term:
- Per-block different 3D projects via drei `<View>` pattern
- Content swapping per section
- Mobile layout (probably scale root font-size via media queries, keep the 24-col grid)
