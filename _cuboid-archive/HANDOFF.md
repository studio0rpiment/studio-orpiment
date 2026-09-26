# Studio Orpiment — Handoff

Snapshot of where the site stands and how it's put together. Written so a future collaborator (or future-me) can pick it back up cold. Supersedes the earlier clip‑path handoff; the rendering model has changed substantially.

## Project

Freelance studio site for **Studio Orpiment** — "an interactive multimedia studio working in web‑based and physical experiences, most often in collaboration with artists and performers."

The landing page is a single‑screen composition built entirely from **cuboids**. At rest it reads as a flat 2D layout of paper tiles and dark rectangles on a paper page; it is actually a field of real 3D boxes that can rotate and rearrange, sitting over a chocolate "void." The long‑term intent is for this composition to become a **project showcase**: pieces open to reveal individual projects (see `ROADMAP.md`).

## Stack

- React + Vite + TypeScript
- Vanilla CSS (no Tailwind, no CSS‑in‑JS)
- react‑three‑fiber (r3f v8.18) + three.js (r0.169) for the 3D layer
- Fonts self‑hosted from `src/styles/fonts.css` (no Google Fonts)
- Hosted on Vercel, auto‑deploys on push to GitHub `main`; domain from Namecheap, DNS pointed at Vercel

Build: `tsc --noEmit && vite build`. Dev: `npm run dev`.

## Colors & type (design tokens)

Defined in `src/styles/tokens.css`:

- `--color-bg: #F5F4ED` — **paper** (the page background)
- `--color-ink: #2B1810` — **chocolate**; used for the dark blocks AND the void behind the stage
- `--color-orpiment: #EEBD34`
- `--color-block: #D9D9D9` — legacy, currently unused
- **Monstera** — the SO logo glyph only
- **Rotor Overlay** (variable) — wordmark + body/description

## The core idea: cuboids mirroring a DOM grid

The composition lives in two layers that stay locked together:

1. **A DOM frame** (`Landing.tsx` / `Landing.css`) — the real 24‑column CSS grid with named row lines (`stage-start`, `rule-1/2/3`, `stage-end`). It paints the type (SO logo, wordmark, description) and the rule/vrule lines, and it holds **transparent placeholders** for every piece. The CSS grid is the single source of truth for layout.
2. **A 3D canvas** (`ViewportCanvas.tsx`) — one full‑page orthographic `<Canvas>` in **pixel space** (1 world unit = 1 CSS px). Every frame, each cuboid reads its DOM placeholder's `getBoundingClientRect()` and eases toward it. So the grid drives everything and, viewed head‑on, the boxes read as the flat 2D design.

Because the canvas is pixel‑space and the grid is responsive, the cuboids resize with the grid on window reshape (width, height, and a proportional depth).

## Pieces

Every line‑defined rectangle is a cuboid. Two kinds:

- **Blocks** (4): the dark rectangles. Ink (chocolate) fill + orpiment edges. Each block **stencil‑writes**, so the shared `Ball` is revealed inside it — a window into the world. Because block ink == the void chocolate, blocks read as openings into the void.
- **Cells** (13): every white‑space rectangle the rule grid carves out (the left margin `c0`, the middle gap, the rule bands, the bottom strip). **Opaque paper** fill + thin ink edges. They are the surface tiles that hold the paper color.

At rest, blocks + cells fully tile the stage, so the void is hidden. When pieces move, gaps open onto the chocolate void until other pieces fill them.

### Depth & rotation rules

- **DEPTH = min(width, height)** so the cross‑section perpendicular to the spin axis is square → the four faces that rotate toward the camera are all the same size (a piece keeps its footprint through a quarter‑turn).
- **Rotation axis follows aspect**: taller‑than‑wide spins on **Y**, wider‑than‑tall flips on **X**.

### Open edges

Pieces on an outer edge of the composition (no rule line to meet) drop that side of their outline, following the original "lines that don't connect" look. It's **position‑based** in `Cuboid.tsx`: a piece whose rect sits on the left page margin hides its whole outline (edgeless); a piece on the stage‑end bottom omits its bottom edge. So whatever lands on the left in any layout is automatically edgeless.

## Interaction

- **Click a block or cell → it rotates in place** (eased quarter‑turn, axis by aspect). Rotation is **DOM‑driven**: the placeholder's click bumps that piece's target in `rotationStore`, and the cuboid eases toward it. (See the gotcha on why this is not 3D raycasting.)
- **Click the right control strip → cycle layout.** There are **3 layouts** (`rearrange · 1/3 → 2/3 → 3/3`), cycled by `.landing__control` on the open‑lined right side. Layout 0 is the landing arrangement; 1 and 2 rearrange the pieces. All three fill the **exact same area** — see below.
- **Rearranging animates** (cuboids ease to their new rects) and momentarily reveals the chocolate void in the gaps.

### Same‑area layouts (how)

`Landing.tsx` defines one combined slot set `ALL_SLOTS = [...BLOCK_SLOTS (4), ...CELL_SLOTS (13)]` — 17 slots. Each layout maps piece `i → ALL_SLOTS[(i*stride + shift) % 17]`. **17 is prime**, so any stride 1..16 is a bijection: every layout fills the same 17 slots, just assigns them to different pieces → identical area, guaranteed. `LAYOUTS = [{stride:1,shift:0} = landing, {5,3}, {7,1}]`; strided (not consecutive) so the blocks spread instead of clustering. The alternate layouts are currently **algorithmic** — to art‑direct specific compositions, replace the strided map with explicit per‑layout placement maps.

## Key files

- `src/components/Landing/Landing.tsx` — DOM frame, the 17 slots, layout state + permutation, the control strip. Placement is applied **inline** per layout.
- `src/components/Landing/Landing.css` — the grid, type, rules/vrules, the chocolate `.landing__void`, piece/​control base styles.
- `src/components/Block/Block.tsx` — a transparent block placeholder (takes a `style` + `onActivate`).
- `src/three/ViewportCanvas.tsx` — the `<Canvas flat orthographic>`; finds `[data-block-id]` / `[data-cell-id]`, renders a `Cuboid` per element + the `Ball`. Purely visual (`pointer-events: none`). Keeps the WebGL guard.
- `src/three/Cuboid.tsx` — one piece: tracks its DOM rect, eases position/scale, materials (ink window vs paper tile), position‑based open edges, DOM‑driven rotation.
- `src/three/Ball.tsx` — the shared drifting sphere, stencil‑read so it shows only inside the block windows.
- `src/three/rotationStore.ts` — the tiny per‑id rotation target store (`bumpRotation` / `getRotation`).
- `src/three/isWebGLAvailable.ts` — WebGL capability probe.
- `src/styles/tokens.css` — colors + font families.

Note: `Scene.tsx`, `Sphere.tsx`, `CattailMorph.tsx` are leftovers from the old clip‑path approach — unused (not imported), left in place.

## Gotchas learned the hard way

- **`flat` on the `<Canvas>` is required for color accuracy.** r3f's default filmic tone mapping rolls off brights, so a MeshBasic `#F5F4ED` rendered as grey `(223,223,221)` and even white capped around 228 — you can't fix it by nudging the hex. With `flat` (NoToneMapping) every 3D color renders pixel‑identical to its CSS hex. **Set 3D colors to the same hex as the design tokens.**
- **Clicks are DOM‑driven, not 3D‑raycast.** Early on, clicks were raycast against the cuboid meshes; because the boxes are deep and all centered at z=0, bigger pieces stole clicks from smaller overlapping ones, and rotating a piece swung its box out of its footprint. The fix: the canvas is `pointer-events: none`, and the DOM placeholders are the hit‑targets (DOM stacking — blocks z3 above cells z2 — resolves overlaps to match what's visually on top).
- **WebGL guard.** `isWebGLAvailable.ts` gates the canvas; if the browser can't create a context, we render nothing rather than letting r3f throw. (The original "renderer/hook" crash was just a Chrome with hardware acceleration OFF — `installHook.js` in that stack is React DevTools, a red herring — not a code bug.)
- **Fonts are embedded/self‑hosted.** Monstera + Rotor Overlay ship from `assets/fonts`; no external font requests.
- **Vercel build** needs `@types/node`, `tsc --noEmit` (not `tsc`, since Vite emits), and `vite.config.ts` in the tsconfig `include`.
- **Git structure**: the repo is initialized inside the `studio-orpiment` folder, not the parent.

## What's next

See `ROADMAP.md`. In short: art‑direct the two alternate layouts, decide the Ball's role in the void, and build the per‑project **showcase‑on‑open** (a piece opens into a chocolate depth‑recess holding a 3D part next to a flat info card) — starting with the AR project.
