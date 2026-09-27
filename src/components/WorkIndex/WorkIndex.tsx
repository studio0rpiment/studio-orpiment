import SectionHead from '../SectionHead/SectionHead'
import RouteLink from '../RouteLink/RouteLink'
import type { Project } from '../../content/types'
import './WorkIndex.css'

type Props = { projects: Project[]; index: string }

export default function WorkIndex({ projects, index }: Props) {
  return (
    <section className="work-index grid section" id="work" aria-label="Work">
      <SectionHead index={index} label="Work" />
      <div className="work-index__head eyebrow" aria-hidden="true">
        <span className="work-index__num">N°</span>
        <span className="work-index__title">Project</span>
        <span className="work-index__what">Format</span>
        <span className="work-index__client">For</span>
        <span className="work-index__year">Year</span>
      </div>
      <ol className="work-index__list">
        {projects.map((p, i) => {
          const href = p.caseStudy ? `/work/${p.caseStudy}` : p.href
          return (
            <li className="work-index__row" key={p.id} id={`work-${p.id}`}>
              <span className="work-index__num">{String(i + 1).padStart(3, '0')}</span>
              <span className="display work-index__title">
                {href ? (
                  <RouteLink href={href}>
                    {p.title}
                    {p.caseStudy ? (
                      <span className="band work-index__tag">Case study</span>
                    ) : (
                      <span className="work-index__arrow">↗</span>
                    )}
                  </RouteLink>
                ) : (
                  p.title
                )}
              </span>
              <span className="work-index__what">{p.kind}</span>
              <span className={`work-index__client ${p.client ? '' : 'is-empty'}`}>{p.client ?? '—'}</span>
              <span className="work-index__year">{p.year}</span>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
