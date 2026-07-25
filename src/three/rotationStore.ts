// Shared rotation targets keyed by piece id. The DOM placeholders bump the
// target on click — DOM hit-testing resolves overlaps deterministically and
// matches the visual stack (dark blocks above outline cells) — and each Cuboid
// eases toward getRotation(id) every frame. Event-driven: a click sets state,
// the render loop only eases toward it.
const targets = new Map<string, number>()

export function bumpRotation(id: string): void {
  targets.set(id, (targets.get(id) ?? 0) + Math.PI / 2)
}

export function getRotation(id: string): number {
  return targets.get(id) ?? 0
}
