import { useState, CSSProperties } from 'react'
import Logo from '../Logo/Logo'
import Wordmark from '../Wordmark/Wordmark'
import Description from '../Description/Description'
import Block from '../Block/Block'
import './Landing.css'

/**
 * Landing — the front-page composition.
 *
 * Layout uses a 24-column CSS Grid for horizontal alignment, plus named
 * row lines (rule-1, rule-2, rule-3) for vertical alignment. Blocks share
 * their top/bottom edges with the rule lines structurally — so alignment
 * is enforced by the layout itself, not by matching independent numbers.
 *
 *   • Slide elements horizontally  → edit grid-column values in Landing.css
 *   • Tune vertical proportions    → edit the LAYOUTS configs below, OR the
 *                                    CSS variable defaults in Landing.css.
 *
 * The logo, orpiment bar, and wordmark are independent grid items — each
 * can be moved without touching the others.
 *
 * Sections: LAYOUTS holds an array of grid-track-size configurations. The
 * toggle button cycles through them; the CSS variables on .landing carry
 * the active config, and `transition: grid-template-rows ...` smooths the
 * change. Real triggers (scroll, block clicks) will replace the button
 * later — the state machine itself stays the same.
 */
/**
 * Each LAYOUT is a set of per-block translate offsets — blocks keep their
 * grid-determined sizes, only their position shifts. Variables are listed
 * per block (lp = left portrait, rp = right portrait, ll = lower-left,
 * lr = lower-right). Defaults are 0 (grid-determined home), so section 0
 * just leaves the empty object.
 */
const LAYOUTS: CSSProperties[] = [
  // Section 0 — home: every block & cell at its grid position, no offsets.
  // The three "bottom-strip" cells overlap the existing rule grid, so they
  // visually disappear into the line work.
  {},

  // Section 1 — cell-shuffle experiment.
  // The dark 3D blocks stay home; the three bottom-strip cells (rectangles
  // defined by rule-3 + the four vertical lines) lift off and stack as a
  // column on the left side of the page, carrying their borders with them.
  {
    '--c1-x': '-12vw', '--c1-y': '-58vh',
    '--c2-x': '-32vw', '--c2-y': '-48vh',
    '--c3-x': '-50vw', '--c3-y': '-38vh',
  } as CSSProperties,
]

export default function Landing() {
  const [section, setSection] = useState(0)

  return (
    <main className="landing" style={LAYOUTS[section]}>
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

      {/* Horizontal rules — sit ON the named row lines, shared with block edges. */}
      <span className="landing__rule landing__rule--1" aria-hidden />
      <span className="landing__rule landing__rule--2" aria-hidden />
      <span className="landing__rule landing__rule--3" aria-hidden />

      {/* Vertical lines — trace the outline of both portrait blocks, full height. */}
      <span className="landing__vrule landing__vrule--lp-left"  aria-hidden />
      <span className="landing__vrule landing__vrule--lp-right" aria-hidden />
      <span className="landing__vrule landing__vrule--rp-left"  aria-hidden />
      <span className="landing__vrule landing__vrule--rp-right" aria-hidden />

      {/* Top rule — full width, sits just above the portrait blocks. */}
      <span className="landing__rule landing__rule--top" aria-hidden />

      {/* Dark blocks — each is a window into the shared 3D scene. */}
      <Block id="left-portrait"  className="block--left-portrait"  />
      <Block id="right-portrait" className="block--right-portrait" />
      <Block id="lower-left"     className="block--lower-left"     />
      <Block id="lower-right"    className="block--lower-right"    />

      {/* Cells — the rectangles that the line grid implicitly defines along
          the bottom strip, expressed as movable elements with thin borders.
          At home position the borders overlay the existing rules; when
          moved, each cell carries its borders away like a paper piece. */}
      <div className="cell cell--bottom-1" aria-hidden />
      <div className="cell cell--bottom-2" aria-hidden />
      <div className="cell cell--bottom-3" aria-hidden />

      {/* Temporary section toggle — remove once scroll/click triggers exist. */}
      <button
        type="button"
        className="landing__section-toggle"
        onClick={() => setSection((s) => (s + 1) % LAYOUTS.length)}
      >
        Layout {section + 1}/{LAYOUTS.length}
      </button>
    </main>
  )
}
