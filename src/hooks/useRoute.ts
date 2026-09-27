import { useEffect, useSyncExternalStore } from 'react'

/**
 * A minimal history router: the current path is read from location and
 * updated on popstate (back/forward) or on navigate(). No dependency.
 */
const listeners = new Set<() => void>()
const subscribe = (fn: () => void) => {
  listeners.add(fn)
  window.addEventListener('popstate', fn)
  return () => {
    listeners.delete(fn)
    window.removeEventListener('popstate', fn)
  }
}
const snapshot = () => location.pathname + location.hash

export function navigate(to: string) {
  if (to === snapshot()) return
  history.pushState(null, '', to)
  listeners.forEach((fn) => fn())
}

export function useRoute() {
  const full = useSyncExternalStore(subscribe, snapshot, () => '/')
  const [path, hash = ''] = full.split('#')
  return { path, hash }
}

/**
 * After each route change: a #hash is jumped to; anything else (including a
 * case study, which opens beneath its slide) starts at the top. Jumps, not
 * glides: gliding past the slideshow's steps would walk it through every slide.
 */
export function useScrollOnRoute(path: string, hash: string) {
  useEffect(() => {
    const el = hash ? document.getElementById(hash) : null
    if (el) el.scrollIntoView({ behavior: 'instant' })
    else window.scrollTo({ top: 0, behavior: 'instant' })
  }, [path, hash])
}
