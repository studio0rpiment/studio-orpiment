import { CSSProperties, useState } from 'react'
import Logo from '../Logo/Logo'
import Wordmark from '../Wordmark/Wordmark'
import Description from '../Description/Description'
import Block from '../Block/Block'
import { bumpRotation } from '../../three/rotationStore'
import { DESKTOP, MOBILE, ALL_CELL_IDS, placementFor } from './layouts'
import { useIsMobile } from './useIsMobile'
import './Landing.css'

const HIDDEN: CSSProperties = { display: 'none' }

export default function Landing() {
  const [layout, setLayout] = useState(0)
  const isMobile = useIsMobile()
  const config = isMobile ? MOBILE : DESKTOP
  const layoutCount = config.assignments.length

  // Every piece stays mounted across breakpoints (the canvas holds one Cuboid
  // per element); cells outside the active config are hidden, and their
  // cuboids hide themselves when the rect collapses.
  const visibleCells = new Set(config.cellIds)

  function styleFor(id: string): CSSProperties {
    const p = placementFor(config, id, layout)
    return {
      gridColumn: p.col,
      gridRow: p.row,
      position: p.straddle ? 'relative' : 'static',
      top: p.straddle ? '50%' : 'auto',
    }
  }

  return (
    <main className="landing">
      {/* Chocolate VOID behind the moving cuboids (shows through the gaps). */}
      <div className="landing__void" aria-hidden />

      <div className="landing__logo"><Logo /></div>
      <span className="landing__bar" aria-hidden />
      <div className="landing__wordmark"><Wordmark /></div>
      <div className="landing__description"><Description /></div>
      <span className="landing__rule landing__rule--top" aria-hidden />
      <span className="landing__rule landing__rule--1" aria-hidden />
      <span className="landing__rule landing__rule--2" aria-hidden />
      <span className="landing__rule landing__rule--3" aria-hidden />
      <span className="landing__vrule landing__vrule--lp-left" aria-hidden />
      <span className="landing__vrule landing__vrule--lp-right" aria-hidden />
      <span className="landing__vrule landing__vrule--rp-left" aria-hidden />
      <span className="landing__vrule landing__vrule--rp-right" aria-hidden />
      {config.blockIds.map((id) => (
        <Block key={id} id={id} style={styleFor(id)} onActivate={() => bumpRotation(id)} />
      ))}
      {ALL_CELL_IDS.map((id) => (
        <div
          key={id}
          className="cell"
          data-cell-id={id}
          style={visibleCells.has(id) ? styleFor(id) : HIDDEN}
          onClick={() => bumpRotation(id)}
        />
      ))}
      <button type="button" className="landing__control" onClick={() => setLayout((l) => (l + 1) % layoutCount)}>
        <span className="landing__control-label">rearrange · {(layout % layoutCount) + 1}/{layoutCount}</span>
      </button>
    </main>
  )
}
