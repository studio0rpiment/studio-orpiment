import { CSSProperties } from 'react'
import type { Slide } from '../../content/types'
import './SlideCard.css'

type Props = { slide: Slide; index: number; count: number }

/** the paper card on the photograph: number, title, lines, and a link with a position line */
export default function SlideCard({ slide, index, count }: Props) {
  const external = slide.href.startsWith('http')
  return (
    <div className="slide-card" aria-live="polite">
      <div className="slide-card__body" key={slide.id}>
        <p className="display slide-card__num">N°{String(index + 1).padStart(3, '0')}</p>
        <div className="slide-card__title">
          <h2 className="display">{slide.title}</h2>
          {slide.lines.map((l) => (
            <p className="display slide-card__line" key={l}>{l}</p>
          ))}
        </div>
      </div>
      <p className="eyebrow slide-card__meta">{slide.kind} · {slide.year}</p>
      <a
        className="slide-card__more"
        href={slide.href}
        {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      >
        {external ? 'Visit ↗' : 'Discover'}
      </a>
      <span
        className="slide-card__progress"
        style={{ '--p': (index + 1) / count } as CSSProperties}
        aria-hidden="true"
      />
    </div>
  )
}
