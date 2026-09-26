import { useCallback, useState } from 'react'
import Intro from './components/Intro/Intro'
import CornerBlock from './components/CornerBlock/CornerBlock'
import MenuOverlay from './components/MenuOverlay/MenuOverlay'
import Stage from './components/Stage/Stage'
import CaseStudy from './components/CaseStudy/CaseStudy'
import WorkIndex from './components/WorkIndex/WorkIndex'
import Services from './components/Services/Services'
import Studio from './components/Studio/Studio'
import SiteFooter from './components/SiteFooter/SiteFooter'
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion'
import { wayside } from './content/wayside'
import { decides } from './content/decides'
import { slides } from './content/slides'
import { services, site, soundLine, studio, work } from './content/site'

const INTRO_SEEN = 'so:intro-seen'

/** the intro plays once per browser session, and never with reduced motion */
function introAlreadySeen(): boolean {
  try {
    return sessionStorage.getItem(INTRO_SEEN) === '1'
  } catch {
    return false
  }
}

export default function App() {
  const reduced = usePrefersReducedMotion()
  const [intro, setIntro] = useState(() => !introAlreadySeen())
  const [menuOpen, setMenuOpen] = useState(false)

  const endIntro = useCallback(() => {
    setIntro(false)
    try {
      sessionStorage.setItem(INTRO_SEEN, '1')
    } catch {
      /* storage unavailable — the intro will simply play again */
    }
  }, [])

  return (
    <>
      {intro && !reduced && <Intro words={site.introWords} onDone={endIntro} />}

      <CornerBlock
        side="left"
        onClick={() => setMenuOpen((o) => !o)}
        expanded={menuOpen}
        label={menuOpen ? 'Close menu' : 'Open menu'}
      >
        {menuOpen ? 'Close' : 'Menu'}
      </CornerBlock>
      {site.email && (
        <CornerBlock side="right" href={`mailto:${site.email}`} label={`Write to ${site.email}`}>
          Write
        </CornerBlock>
      )}
      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main>
        <Stage slides={slides} />
        <CaseStudy study={wayside} index="01" />
        <CaseStudy study={decides} index="02" />
        <WorkIndex entries={work} />
        <Services services={services} soundLine={soundLine} />
        <Studio bio={studio.bio} collaborators={studio.collaborators} />
      </main>
      <SiteFooter />
    </>
  )
}
