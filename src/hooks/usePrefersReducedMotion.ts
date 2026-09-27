import { useMediaQuery } from './useMediaQuery'

/** live reduced-motion preference */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}
