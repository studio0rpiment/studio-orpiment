import { useSyncExternalStore } from 'react'

const QUERY = '(max-width: 767px)'

/**
 * True below the mobile breakpoint. Event-driven: subscribes to the
 * matchMedia change event — no resize polling.
 */
export function useIsMobile(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(QUERY)
      mq.addEventListener('change', onChange)
      return () => mq.removeEventListener('change', onChange)
    },
    () => window.matchMedia(QUERY).matches,
  )
}
