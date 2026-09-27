import { RefObject, useEffect, useState } from 'react'

/**
 * Which of a list of stacked step elements is crossing the middle of the
 * viewport. IntersectionObserver reports each crossing; nothing runs while
 * the page is still.
 */
export function useScrollSteps(container: RefObject<HTMLElement>, selector: string, stepsKey = ''): number {
  const [active, setActive] = useState(0)
  useEffect(() => {
    const root = container.current
    if (!root) return
    const steps = Array.from(root.querySelectorAll<HTMLElement>(selector))
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step))
        }
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 },
    )
    steps.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [container, selector, stepsKey]) // re-observe when the set of steps changes
  return active
}
