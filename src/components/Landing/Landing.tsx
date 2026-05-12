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
 *   • Tune vertical proportions    → edit the fr ratios on grid-template-rows
 *
 * The logo, orpiment bar, and wordmark are independent grid items — each
 * can be moved without touching the others.
 */
export default function Landing() {
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

      {/* Block placeholders — each becomes a 3D viewport later. */}
      <Block id="left-portrait"  className="block--left-portrait"  />
      <Block id="right-portrait" className="block--right-portrait" />
      <Block id="lower-left"     className="block--lower-left"     />
      <Block id="lower-right"    className="block--lower-right"    />
    </main>
  )
}
