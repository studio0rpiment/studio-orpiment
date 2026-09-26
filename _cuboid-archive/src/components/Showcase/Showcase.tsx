import { Project } from '../../projects/types'
import { navigate } from '../../viewStore'
import './Showcase.css'

/**
 * Showcase — one project's story as scroll-driven chapters over the chocolate
 * void. Videos are muted ambient loops (media content, not timers); scroll is
 * the visitor's hand on the narrative.
 */
export default function Showcase({ project }: { project: Project }) {
  const s = project.showcase
  if (!s) return null
  return (
    <article className="showcase">
      <header className="showcase__head">
        <button type="button" className="showcase__back" onClick={() => navigate('#/work')}>← work</button>
        <button type="button" className="showcase__close" onClick={() => navigate('')} aria-label="Close">×</button>
      </header>

      <div className="showcase__title-block">
        <span className="showcase__num">{project.num}</span>
        <h1 className="showcase__title">{project.title}</h1>
        <p className="showcase__meta">{project.category} — {project.year}</p>
      </div>

      <p className="showcase__intro">{s.intro}</p>

      <dl className="showcase__facts">
        <div><dt>date</dt><dd>{s.facts.date}</dd></div>
        <div><dt>client</dt><dd>{s.facts.client}</dd></div>
        <div><dt>role</dt><dd>{s.facts.role}</dd></div>
        {project.link && (
          <div><dt>live</dt><dd><a href={project.link} target="_blank" rel="noreferrer">{project.link.replace('https://', '')} ↗</a></dd></div>
        )}
      </dl>

      {s.chapters.map((ch) => (
        <section key={ch.id} className="showcase__chapter">
          <h2 className="showcase__chapter-title">{ch.title}</h2>
          <p className="showcase__chapter-body">{ch.body}</p>
          <div className="showcase__media">
            {ch.media.map((m) => (
              <figure key={m.src} className={m.portrait ? 'showcase__figure showcase__figure--portrait' : 'showcase__figure'}>
                {m.kind === 'video' ? (
                  <video src={m.src} muted loop autoPlay playsInline />
                ) : (
                  <img src={m.src} alt={m.caption ?? ''} loading="lazy" />
                )}
                {m.caption && <figcaption>{m.caption}</figcaption>}
              </figure>
            ))}
          </div>
        </section>
      ))}

      <footer className="showcase__foot">
        <button type="button" className="showcase__back" onClick={() => navigate('#/work')}>← all work</button>
      </footer>
    </article>
  )
}
