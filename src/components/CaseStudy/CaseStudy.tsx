import SectionHead from '../SectionHead/SectionHead'
import Facts from '../Facts/Facts'
import ExhibitFrame from '../ExhibitFrame/ExhibitFrame'
import ChapterRow from '../ChapterRow/ChapterRow'
import type { CaseStudy as Study } from '../../content/types'
import './CaseStudy.css'

type Props = { study: Study; action?: { href: string; label: string } }

/**
 * A case study at the scale of the slideshow: the label row carries its
 * title, the photograph and media stay within the viewport's height.
 */
export default function CaseStudy({ study, action }: Props) {
  return (
    <article className="case-study section" aria-label={study.title}>
      <div className="grid">
        <SectionHead index={study.kicker} label={study.title} action={action} />
      </div>

      {study.cover && (
        <figure className="case-study__cover">
          <img src={study.cover.src} alt={study.cover.caption ?? ''} loading="lazy" decoding="async" />
          {study.cover.caption && <figcaption className="eyebrow">{study.cover.caption}</figcaption>}
        </figure>
      )}

      <div className="grid case-study__lead">
        <p className="case-study__intro">{study.intro}</p>
        <div className="case-study__facts">
          <Facts facts={study.facts} />
        </div>
        {study.exhibit && <ExhibitFrame forms={study.exhibit.forms} caption={study.exhibit.caption} />}
        {study.chapters.map((c, i) => (
          <ChapterRow key={c.id} chapter={c} index={i} />
        ))}
      </div>
    </article>
  )
}
