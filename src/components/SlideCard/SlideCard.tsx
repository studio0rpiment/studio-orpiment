import { CSSProperties } from 'react'
import RouteLink from '../RouteLink/RouteLink'
import type { Project } from '../../content/types'
import './SlideCard.css'

type Props = { slide: Project; index: number; count: number }

/** where the card leads: an in-site case study, else the project's own site, else its row in the index */
function cardLink(p: Project): { href: string; label: string } {
  if (p.caseStudy) return { href: `/work/${p.caseStudy}`, label: 'Case study' }
  if (p.href) return { href: p.href, label: 'Discover ↗' }
  return { href: `#work-${p.id}`, label: 'Discover' }
}

/** the paper card on the photograph: number, title, lines, and a link with a position line */
export default function SlideCard({ slide, index, count }: Props) {
  const link = cardLink(slide)
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
      <RouteLink className={`slide-card__more ${slide.caseStudy ? 'is-case' : ''}`} href={link.href}>
        {link.label}
      </RouteLink>
      <span
        className="slide-card__progress"
        style={{ '--p': (index + 1) / count } as CSSProperties}
        aria-hidden="true"
      />
    </div>
  )
}
