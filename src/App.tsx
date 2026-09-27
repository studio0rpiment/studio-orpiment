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
import { services, site, soundLine, studio } from './content/site'
import { shuffleAfterFirst } from './lib/shuffle'
import type { CaseStudy } from './content/types'

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
function Home({ study }: { study: CaseStudy | null }) {
  const project = study ? slideOrder.find((p) => p.caseStudy === study.slug) : undefined
  return (
    <main>
      <Stage slides={slideOrder} hold={project?.id} />
      {study ? (
        <CaseStudyPanel study={study} tone={project?.tone} exitHref={project ? `/#slide-${project.id}` : '/'} />
      ) : (
        /* the rest of the page carries on in the colours of the last slide */
        <div className="after-stage" data-tone={slideOrder.at(-1)?.tone ?? 'paper'}>
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
  useScrollOnRoute(path, hash)

  const slug = path.startsWith('/work/') ? path.slice('/work/'.length).replace(/\/$/, '') : null
  const at = slug ? studies.findIndex((s) => s.slug === slug) : -1
  const study = at >= 0 ? studies[at] : null

  return (
    <>
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

      <Home study={study} />
    </>
  )
}
