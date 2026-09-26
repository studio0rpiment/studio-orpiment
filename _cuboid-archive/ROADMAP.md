# Studio Orpiment — Roadmap

Where the site is headed. Companion to `HANDOFF.md` (which describes how the current build works). This is a living document — reorder and reshape as priorities move.

## Vision

The landing page is a **project showcase** disguised as a flat 2D composition. A field of paper cuboids and dark openings sits over a chocolate void. It rearranges into different layouts, and — the end goal — each piece can **open to reveal a project**: the cuboid turns/opens into a chocolate depth‑recess holding that project's content, a 3D part next to a flat info card. Studio Orpiment works across web and physical/AR, so the showcase needs to hold both live 3D and flat information side by side.

Design principles guiding the work: additive and modular (small reusable pieces), event‑driven (interactions drive state; avoid timers), and color‑accurate to the design tokens.

## Done — foundation (as of 2026‑07‑25)

The whole composition is built from cuboids and is live in the real app:

- Cuboid system mirroring the CSS grid (pixel‑space ortho canvas, resizes with the grid).
- Every line‑defined rectangle is a cuboid — dark blocks (ball‑windows) and paper cells (surface tiles), including the left margin and bottom strip.
- Click a piece to rotate it in place (DOM‑driven, equal faces, axis by aspect).
- **3 layouts** cycled by the right control strip, all filling the same area (prime‑modulus permutation), animated.
- Position‑based open edges (edgeless on the left/​bottom margins).
- Paper page + **chocolate void** behind the stage, revealed in the gaps when pieces move.
- Color accuracy fixed (`flat`/no tone mapping) so the 3D layer matches the CSS tokens.
- WebGL capability guard; graceful fallback.

## Near‑term

- **Art‑direct layouts 2 & 3.** They're currently algorithmic (a strided shuffle). Replace with explicit, intentional compositions — decide what each alternate arrangement should say.
- **The Ball's role in the void.** Right now it only shows inside the block windows. Decide whether it should drift freely across the whole void (visible in any gap) or stay windowed. Possibly tie its motion/behavior to interactions rather than a constant drift.
- **Push the void reveal** (optional): stagger piece movement so a slot sits open on chocolate for a beat before its replacement arrives, to make the "infinite behind" read stronger.
- **Control affordance & contrast.** The control strip is subtle; make its purpose legible. Revisit line/label contrast if the palette shifts.

## The showcase (the big one)

Turn pieces into project slots:

- **Open interaction.** A piece opens (flip/rotate) into a **chocolate depth‑recess** — a real inset with visible depth — rather than just rotating in place. Prototyped earlier; needs porting into the real cuboid pieces.
- **Per‑project content.** Inside the recess: a **3D part** (model/animation) beside a **flat info card** (title, year, blurb). Data‑driven per project.
- **First project: AR.** Wire the recent AR project first — needs its real 3D asset (glTF/GLB) or a built stand‑in.
- **Camera choreography.** Ease from the flat 2D rest state to a focused, slightly‑tilted view of the opened piece so the depth reads; return on close.

## Content

- Real project list, copy, and assets (3D + imagery) for each showcase slot.
- Description/wordmark finalization; any About / contact surface.

## Polish & platform

- **Mobile / responsive layout.** The grid is desktop‑tuned; define the small‑screen composition (likely scale the root font‑size, keep the 24‑col grid, simplify layouts).
- **Motion feel.** Tune easing, rotation, and layout‑transition timing as a coherent system.
- **Performance.** Watch draw calls / bundle size (three is the bulk); consider code‑splitting if needed.
- **Accessibility.** Keyboard access for the interactive pieces/control; reduced‑motion handling; meaningful alt/labels.

## Infra (mostly settled)

- Hosting: Vercel auto‑deploy from GitHub `main`; Namecheap domain → Vercel. In place.
- CI/build already green (`tsc --noEmit && vite build`).

## Open decisions

- Do the alternate layouts stay abstract rearrangements, or should each map to a section/mode of the site?
- Is the void purely a chocolate backdrop, or does it eventually hold depth/the world (the Ball, or per‑project scenes)?
- Blocks currently equal the void color (openings). Keep them merged, or give blocks a distinct treatment so they read as objects rather than holes?
