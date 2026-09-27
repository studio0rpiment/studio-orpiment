import { useCallback, useState } from 'react'
import Intro from './components/Intro/Intro'
import CornerBlock from './components/CornerBlock/CornerBlock'
import MenuOverlay from './components/MenuOverlay/MenuOverlay'
import Stage from './components/Stage/Stage'
import CaseStudyPage from './components/CaseStudyPage/CaseStudyPage'
import WorkIndex from './components/WorkIndex/WorkIndex'
import Services from './components/Services/Services'
import Studio from './components/Studio/Studio'
import SiteFooter from './components/SiteFooter/SiteFooter'
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion'
import { useRoute, useScrollOnRoute } from './hooks/useRoute'
import { wayside } from './content/wayside'
import { decides } from './content/decides'
import { projects, slideshow } from './content/projects'
import { services, site, soundLine, studio } from './content/site'
import { shuffleAfterFirst } from './lib/shuffle'

const INTRO_SEEN = 'so:intro-seen'

/**
 * The dice are rolled once per page load: Wayside always opens, the rest
 * of the slideshow (and so the run of colours) comes in a new order.
 */
const slideOrder = shuffleAfterFirst(slideshow)

/** case studies, in order; each links on to the next */
const studies = [wayside, decides]

/** the intro plays once per browser session, and never with reduced motion */
function introAlreadySeen(): boolean {
  try {
    return sessionStorage.getItem(INTRO_SEEN) === '1'
  } catch {
    return false
  }
}

function Home() {
  return (
    <main>
      <Stage slides={slideOrder} />
      {/* the rest of the page carries on in the colours of the last slide */}
      <div className="after-stage" data-tone={slideOrder.at(-1)?.tone ?? 'paper'}>
        <WorkIndex projects={projects} index="01" />
        <Services services={services} soundLine={soundLine} />
        <Studio bio={studio.bio} collaborators={studio.collaborators} />
        <SiteFooter />
      </div>
    </main>
  )
}

export default function App() {
  const reduced = usePrefersReducedMotion()
  const { path, hash } = useRoute()
  const [intro, setIntro] = useState(() => !introAlreadySeen() && location.pathname === '/')
  const [menuOpen, setMenuOpen] = useState(false)
  useScrollOnRoute(path, hash)

  const endIntro = useCallback(() => {
    setIntro(false)
    try {
      sessionStorage.setItem(INTRO_SEEN, '1')
    } catch {
      /* storage unavailable — the intro will simply play again */
    }
  }, [])

  const slug = path.startsWith('/work/') ? path.slice('/work/'.length).replace(/\/$/, '') : null
  const at = slug ? studies.findIndex((s) => s.slug === slug) : -1
  const study = at >= 0 ? studies[at] : null
  const next = at >= 0 ? studies[(at + 1) % studies.length] : null

  return (
    <>
      {intro && !reduced && !study && <Intro words={site.introWords} onDone={endIntro} />}

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

      {study ? (
        <CaseStudyPage
          study={study}
          index={String(at + 1).padStart(2, '0')}
          next={next && next !== study ? { slug: next.slug, title: next.title } : undefined}
        />
      ) : (
        <Home />
      )}
      {/* the home page closes its toned run with the footer inside it */}
      {study && <SiteFooter />}
    </>
  )
}
