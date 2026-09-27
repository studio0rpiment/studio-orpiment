import InViewVideo from '../InViewVideo/InViewVideo'
import type { Experience } from '../../content/types'
import './ExperienceGrid.css'

/**
 * The dossier's experience tables, set as columns: each experience is named,
 * shown (its solution, usually a screen capture), then described by its
 * concept and requirements.
 */
export default function ExperienceGrid({ items }: { items: Experience[] }) {
  return (
    <div className="experiences">
      {items.map((x) => (
        <article className="experience" key={x.name}>
          <h4 className="band experience__name">{x.name}</h4>
          <div className="experience__frame">
            {x.solution.kind === 'video' ? (
              <InViewVideo className="experience__media" src={x.solution.src} poster={x.solution.poster} label={x.name} />
            ) : (
              <img className="experience__media" src={x.solution.src} alt={x.solution.caption ?? x.name} loading="lazy" decoding="async" />
            )}
          </div>
          {x.concept && (
            <p className="experience__text">
              <span className="experience__label">Concept</span>
              {x.concept}
            </p>
          )}
          {x.requirements && (
            <p className="experience__text">
              <span className="experience__label">Requirements</span>
              {x.requirements}
            </p>
          )}
        </article>
      ))}
    </div>
  )
}
