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

/** after each route change: go to the #hash if there is one, otherwise to the top */
export function useScrollOnRoute(path: string, hash: string) {
  useEffect(() => {
    const el = hash ? document.getElementById(hash) : null
    if (el) el.scrollIntoView()
    else window.scrollTo(0, 0)
  }, [path, hash])
}
