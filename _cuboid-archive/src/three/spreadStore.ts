/**
 * Spread state — which project's information the composition is currently
 * carrying on its faces. Selecting a project paints the arriving face of
 * every piece with its card and turns the composition a quarter; closing
 * turns it again onto blank faces. Event-driven: clicks set state, listeners
 * repaint, the render loop only eases rotation.
 */

type Listener = () => void
const listeners = new Set<Listener>()

let current: string | null = null
let revision = 0

export function getSpread(): string | null {
  return current
}

export function getSpreadRevision(): number {
  return revision
}

export function setSpread(slug: string | null): void {
  current = slug
  revision++
  listeners.forEach((fn) => fn())
}

export function onSpread(fn: Listener): () => void {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}
