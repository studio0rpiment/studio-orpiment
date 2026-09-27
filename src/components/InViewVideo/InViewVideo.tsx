import { useEffect, useRef } from 'react'
import { useInView } from '../../hooks/useInView'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

type Props = { src: string; label?: string; className?: string; poster?: string }

/**
 * Muted, looping capture that plays only while on screen. With reduced
 * motion it never autoplays and shows native controls instead.
 */
export default function InViewVideo({ src, label, className, poster }: Props) {
  const ref = useRef<HTMLVideoElement>(null)
  const inView = useInView(ref, { threshold: 0.25 })
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const v = ref.current
    if (!v || reduced) return
    if (inView) v.play().catch(() => { /* autoplay refused — stays on first frame */ })
    else v.pause()
  }, [inView, reduced])

  return (
    <video
      ref={ref}
      className={className}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      controls={reduced}
      aria-label={label}
    />
  )
}
