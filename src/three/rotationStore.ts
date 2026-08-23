// Shared rotation targets keyed by piece id. The DOM placeholders bump the
// target on click — DOM hit-testing resolves overlaps deterministically and
// matches the visual stack (dark blocks above outline cells) — and each Cuboid
// eases toward getRotation(id) every frame. Event-driven: a click sets state,
// the render loop only eases toward it.
//
// bumpRotation also doubles as the site's interaction event: subscribers
// (e.g. the Underlayer morph) advance their own state when any piece is
// clicked. Still event-driven — no timers anywhere.
const targets = new Map<string, number>()

type BumpListener = (id: string) => void
const listeners = new Set<BumpListener>()

export function bumpRotation(id: string): void {
  targets.set(id, (targets.get(id) ?? 0) + Math.PI / 2)
  listeners.forEach((fn) => fn(id))
}

export function getRotation(id: string): number {
  return targets.get(id) ?? 0
}

/** Subscribe to interaction bumps. Returns an unsubscribe function. */
export function onBump(fn: BumpListener): () => void {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}
