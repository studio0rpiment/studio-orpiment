import { useSyncExternalStore } from 'react'
import { PROJECTS } from '../../projects'
import { getSpread, onSpread, setSpread } from '../../three/spreadStore'
import { navigate } from '../../viewStore'
import './WorkStrip.css'

/**
 * WorkStrip — the desktop work index, living in the open-lined right column.
 * Selecting a project rotates the composition and its information arrives on
 * the pieces' faces; selecting it again (or ×) turns them blank again.
 */
export default function WorkStrip({ onRearrange, layoutLabel }: { onRearrange: () => void; layoutLabel: string }) {
  const selected = useSyncExternalStore(onSpread, getSpread)
  return (
    <aside className="workstrip">
      <h2 className="workstrip__heading">work</h2>
      <ol className="workstrip__list">
        {PROJECTS.map((p) => {
          const active = selected === p.slug
          const openable = Boolean(p.spread)
          return (
            <li key={p.slug} className="workstrip__item">
              <button
                type="button"
                className={active ? 'workstrip__entry workstrip__entry--active' : 'workstrip__entry'}
                disabled={!openable && !p.link}
                onClick={() => {
                  if (p.spread) setSpread(active ? null : p.slug)
                  else if (p.link) window.open(p.link, '_blank', 'noreferrer')
                }}
              >
                <span className="workstrip__num">{p.num}</span>
                <span className="workstrip__title">{p.title}</span>
              </button>
              {active && p.showcase && (
                <button type="button" className="workstrip__more" onClick={() => navigate(`#/work/${p.slug}`)}>
                  case study →
                </button>
              )}
            </li>
          )
        })}
      </ol>
      <button type="button" className="workstrip__rearrange" onClick={onRearrange}>
        rearrange · {layoutLabel}
      </button>
    </aside>
  )
}
