import SectionHead from '../SectionHead/SectionHead'
import type { WorkEntry } from '../../content/types'
import './WorkIndex.css'

export default function WorkIndex({ entries }: { entries: WorkEntry[] }) {
  return (
    <section className="work-index grid section" id="work" aria-label="Other work">
      <SectionHead index="03" label="Other work" />
      <div className="work-index__head eyebrow" aria-hidden="true">
        <span className="work-index__num">N°</span>
        <span className="work-index__title">Project</span>
        <span className="work-index__what">Format</span>
        <span className="work-index__client">For</span>
        <span className="work-index__year">Year</span>
      </div>
      <ol className="work-index__list">
        {entries.map((e, i) => (
          <li className="work-index__row" key={e.title}>
            <span className="work-index__num">{String(i + 1).padStart(3, '0')}</span>
            <span className="display work-index__title">
              {e.href ? (
                <a href={e.href} target="_blank" rel="noreferrer">{e.title}<span className="work-index__arrow">↗</span></a>
              ) : (
                e.title
              )}
            </span>
            <span className="work-index__what">{e.what}</span>
            <span className={`work-index__client ${e.client ? '' : 'is-empty'}`}>{e.client ?? '—'}</span>
            <span className="work-index__year">{e.year}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}
