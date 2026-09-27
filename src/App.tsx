import { useState } from 'react'
import CornerBlock from './components/CornerBlock/CornerBlock'
import MenuOverlay from './components/MenuOverlay/MenuOverlay'
import Stage from './components/Stage/Stage'
import CaseStudyPanel from './components/CaseStudyPanel/CaseStudyPanel'
import WorkIndex from './components/WorkIndex/WorkIndex'
import Services from './components/Services/Services'
import Studio from './components/Studio/Studio'
import SiteFooter from './components/SiteFooter/SiteFooter'
import { useRoute, useScrollOnRoute } from './hooks/useRoute'
import { wayside } from './content/wayside'
import { decides } from './content/decides'
import { projects, slideshow } from './content/projects'
import { services, soundLine, studio } from './content/site'
import { shuffleAfterFirst } from './lib/shuffle'
import type { CaseStudy, Tone } from './content/types'

/**
 * The dice are rolled once per page load: Wayside always opens, the rest
 * of the slideshow (and so the run of colours) comes in a new order.
 */
const slideOrder = shuffleAfterFirst(slideshow)

/** the in-site case studies, by slug */
const studies = [wayside, decides]

/**
 * The home page. With a case study open (/work/<slug>) the page is just its
 * slide, held at the top, and the study beneath it, in the slide's colours;
 * Exit returns to the slideshow on that slide.
 */
type HomeProps = {
  study: CaseStudy | null
  /** the palette on screen: the sections below the slideshow wear it too */
  tone: Tone
  onTone: (tone: Tone) => void
}

function Home({ study, tone, onTone }: HomeProps) {
  const project = study ? slideOrder.find((p) => p.caseStudy === study.slug) : undefined
  return (
    <main>
      <Stage slides={slideOrder} hold={project?.id} onTone={onTone} />
      {study ? (
        <CaseStudyPanel study={study} tone={project?.tone} exitHref={project ? `/#slide-${project.id}` : '/'} />
      ) : (
        /* the rest of the page wears the palette on screen: the last slide's when
           scrolled into, the current slide's (as in the menu) when jumped to */
        <div className="after-stage" data-tone={tone}>
          <WorkIndex projects={projects} index="01" />
          <Services services={services} soundLine={soundLine} />
          <Studio bio={studio.bio} collaborators={studio.collaborators} />
          <SiteFooter />
        </div>
      )}
    </main>
  )
}

export default function App() {
  const { path, hash } = useRoute()
  const [menuOpen, setMenuOpen] = useState(false)
  // the palette on screen; the menu and the corner squares wear it too
  const [screenTone, setScreenTone] = useState<Tone>(slideOrder[0]?.tone ?? 'paper')
  useScrollOnRoute(path, hash)

  const slug = path.startsWith('/work/') ? path.slice('/work/'.length).replace(/\/$/, '') : null
  const at = slug ? studies.findIndex((s) => s.slug === slug) : -1
  const study = at >= 0 ? studies[at] : null

  return (
    <>
      <div className="site-chrome" data-tone={screenTone}>
        <CornerBlock
          side="left"
          onClick={() => setMenuOpen((o) => !o)}
          expanded={menuOpen}
          label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? 'Close' : 'Menu'}
        </CornerBlock>
        <CornerBlock side="right" href="/#contact" label="Connect: contact details">
          Connect
        </CornerBlock>
        <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
      </div>

      <Home study={study} tone={screenTone} onTone={setScreenTone} />
    </>
  )
}
