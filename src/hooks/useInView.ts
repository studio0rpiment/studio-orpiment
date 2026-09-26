import { RefObject, useEffect, useState } from 'react'

type Options = {
  /** stop observing after the first intersection */
  once?: boolean
  rootMargin?: string
  threshold?: number
}

/** IntersectionObserver-backed visibility flag */
export function useInView<T extends Element>(
  ref: RefObject<T>,
  { once = false, rootMargin = '0px', threshold = 0 }: Options = {},
): boolean {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
        if (once && entry.isIntersecting) io.disconnect()
      },
      { rootMargin, threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, once, rootMargin, threshold])
  return inView
}
