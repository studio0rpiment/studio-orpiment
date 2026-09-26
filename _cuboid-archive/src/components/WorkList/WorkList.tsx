import { PROJECTS } from '../../projects'
import { Project } from '../../projects/types'
import { navigate } from '../../viewStore'
import './WorkList.css'

function Row({ p }: { p: Project }) {
  const inner = (
    <>
      <span className="worklist__num">{p.num}</span>
      <span className="worklist__title">{p.title}</span>
      <span className="worklist__meta">{p.category} — {p.year}</span>
    </>
  )
  if (p.showcase) {
    return (
      <button type="button" className="worklist__row" onClick={() => navigate(`#/work/${p.slug}`)}>
        {inner}
      </button>
    )
  }
  if (p.link) {
    return (
      <a className="worklist__row" href={p.link} target="_blank" rel="noreferrer">
        {inner}<span className="worklist__ext" aria-hidden>↗</span>
      </a>
    )
  }
  return <div className="worklist__row worklist__row--soon">{inner}<span className="worklist__ext">soon</span></div>
}

export default function WorkList() {
  return (
    <section className="worklist" aria-label="Work">
      <header className="worklist__head">
        <h1 className="worklist__heading">work</h1>
        <button type="button" className="worklist__close" onClick={() => navigate('')} aria-label="Close">×</button>
      </header>
      <div className="worklist__rows">
        {PROJECTS.map((p) => <Row key={p.slug} p={p} />)}
      </div>
    </section>
  )
}
