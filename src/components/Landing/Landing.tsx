import { CSSProperties, useState } from 'react'
import Logo from '../Logo/Logo'
import Wordmark from '../Wordmark/Wordmark'
import Description from '../Description/Description'
import Block from '../Block/Block'
import { bumpRotation } from '../../three/rotationStore'
import './Landing.css'

/**
 * Landing — composition + DOM frame for the 3D cuboid layer, now with 3 LAYOUTS.
 *
 * Every line-defined rectangle (4 blocks + 13 cells) is a transparent placeholder
 * whose grid placement comes from the active layout. Layout 0 is the landing
 * arrangement. Layouts 1 and 2 rearrange the pieces by PERMUTING them among the
 * SAME set of slots — blocks shuffle among the 4 big slots, cells among the 13
 * small ones — so the composition always fills the exact same area, just
 * rearranged. Clicking the right-hand CONTROL strip cycles the layout; the
 * cuboids ease to their new rects (ViewportCanvas), so it animates.
 */
type Placement = { col: string; row: string; straddle?: boolean }

const BLOCK_IDS = ['left-portrait', 'right-portrait', 'lower-left', 'lower-right']
const CELL_IDS = ['r1c0', 'r1c2', 'r2c0', 'r2c1', 'r2c2', 'r3c0', 'r3c1', 'r3c2', 'r3c3', 'r4c0', 'r4c1', 'r4c2', 'r4c3']

// The fixed slot sets (layout-0 home placements), kept as two groups so blocks
// stay block-sized and cells cell-sized as they rearrange.
const BLOCK_SLOTS: Placement[] = [
  { col: '3 / 9', row: 'stage-start / rule-1' },
  { col: '14 / 20', row: 'stage-start / rule-2' },
  { col: '4 / 12', row: 'rule-1 / rule-2', straddle: true },
  { col: '10 / 19', row: 'rule-2 / rule-3', straddle: true },
]
const CELL_SLOTS: Placement[] = [
  { col: '1 / 3', row: 'stage-start / rule-1' },
  { col: '9 / 14', row: 'stage-start / rule-1' },
  { col: '1 / 3', row: 'rule-1 / rule-2' },
  { col: '3 / 9', row: 'rule-1 / rule-2' },
  { col: '9 / 14', row: 'rule-1 / rule-2' },
  { col: '1 / 3', row: 'rule-2 / rule-3' },
  { col: '3 / 9', row: 'rule-2 / rule-3' },
  { col: '9 / 14', row: 'rule-2 / rule-3' },
  { col: '14 / 20', row: 'rule-2 / rule-3' },
  { col: '1 / 3', row: 'rule-3 / stage-end' },
  { col: '3 / 9', row: 'rule-3 / stage-end' },
  { col: '9 / 14', row: 'rule-3 / stage-end' },
  { col: '14 / 20', row: 'rule-3 / stage-end' },
]

// One combined slot set (block slots first, then cell slots). 17 is prime, so a
// strided index map (i*stride + shift) mod 17 with any stride 1..16 is a
// bijection — every layout fills the SAME slots (identical area), just assigns
// them to different pieces, spreading the blocks across the composition.
const ALL_SLOTS: Placement[] = [...BLOCK_SLOTS, ...CELL_SLOTS]
const ALL_IDS = [...BLOCK_IDS, ...CELL_IDS]
const LAYOUTS = [
  { stride: 1, shift: 0 }, // 0 — the landing arrangement (identity)
  { stride: 5, shift: 3 },
  { stride: 7, shift: 1 },
]
const LAYOUT_COUNT = LAYOUTS.length

function placementFor(id: string, layout: number): Placement {
  const i = ALL_IDS.indexOf(id)
  const { stride, shift } = LAYOUTS[layout]
  return ALL_SLOTS[(i * stride + shift) % ALL_SLOTS.length]
}

function styleFor(id: string, layout: number): CSSProperties {
  const p = placementFor(id, layout)
  return {
    gridColumn: p.col,
    gridRow: p.row,
    position: p.straddle ? 'relative' : 'static',
    top: p.straddle ? '50%' : 'auto',
  }
}

export default function Landing() {
  const [layout, setLayout] = useState(0)

  return (
    <main className="landing">
      <div className="landing__logo">
        <Logo />
      </div>

      <span className="landing__bar" aria-hidden />

      <div className="landing__wordmark">
        <Wordmark />
      </div>

      <div className="landing__description">
        <Description />
      </div>

      <span className="landing__rule landing__rule--top" aria-hidden />
      <span className="landing__rule landing__rule--1" aria-hidden />
      <span className="landing__rule landing__rule--2" aria-hidden />
      <span className="landing__rule landing__rule--3" aria-hidden />

      <span className="landing__vrule landing__vrule--lp-left" aria-hidden />
      <span className="landing__vrule landing__vrule--lp-right" aria-hidden />
      <span className="landing__vrule landing__vrule--rp-left" aria-hidden />
      <span className="landing__vrule landing__vrule--rp-right" aria-hidden />

      {BLOCK_IDS.map((id) => (
        <Block key={id} id={id} style={styleFor(id, layout)} onActivate={() => bumpRotation(id)} />
      ))}

      {CELL_IDS.map((id) => (
        <div
          key={id}
          className="cell"
          data-cell-id={id}
          style={styleFor(id, layout)}
          onClick={() => bumpRotation(id)}
        />
      ))}

      {/* Right control strip — the open-lined side. Click to cycle the layout. */}
      <button
        type="button"
        className="landing__control"
        onClick={() => setLayout((l) => (l + 1) % LAYOUT_COUNT)}
      >
        <span className="landing__control-label">rearrange · {layout + 1}/{LAYOUT_COUNT}</span>
      </button>
    </main>
  )
}
