import { PointerEvent, useRef, useState } from 'react'
import './LiveEmbed.css'

type Props = { src: string; title: string }
type Kind = 'move' | 'down' | 'up' | 'leave'

/**
 * A live render of a project's own site, laid over its photograph. The
 * photograph stays underneath as the still; the frame fades in on its load
 * event.
 *
 * The frame itself takes no pointer input, so wheel and swipe keep driving
 * this page's slideshow. Instead the pointer is relayed: each move, press,
 * and release over the frame is posted to it as a fraction of its size, and
 * the embedded page replays it (see the festival site's ?embed=hero).
 */
export default function LiveEmbed({ src, title }: Props) {
  const [loaded, setLoaded] = useState(false)
  const frame = useRef<HTMLIFrameElement>(null)
  const origin = new URL(src).origin

  const relay = (kind: Kind) => (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    frame.current?.contentWindow?.postMessage(
      { type: 'aegf:pointer', kind, x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height },
      origin,
    )
  }

  return (
    <div
      className={`live-embed ${loaded ? 'is-loaded' : ''}`}
      onPointerMove={relay('move')}
      onPointerDown={relay('down')}
      onPointerUp={relay('up')}
      onPointerLeave={relay('leave')}
    >
      <iframe ref={frame} src={src} title={`${title}: live`} loading="lazy" onLoad={() => setLoaded(true)} />
    </div>
  )
}
