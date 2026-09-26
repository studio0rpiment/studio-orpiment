import SectionHead from '../SectionHead/SectionHead'
import Facts from '../Facts/Facts'
import ExhibitFrame from '../ExhibitFrame/ExhibitFrame'
import ChapterRow from '../ChapterRow/ChapterRow'
import type { CaseStudy as Study } from '../../content/types'
import './CaseStudy.css'

type Props = { study: Study; index: string }

export default function CaseStudy({ study, index }: Props) {
  return (
    <section className="case-study section" id={study.slug} aria-label={study.title}>
      <div className="grid">
        <SectionHead
          index={index}
          label={study.kicker}
          title={study.title}
          action={study.link ? { href: study.link.href, label: `${study.link.label} ↗` } : undefined}
        />
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
    </section>
  )
}
