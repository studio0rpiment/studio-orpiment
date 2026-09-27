import { CSSProperties, useCallback, useEffect, useRef } from 'react'
import { BlockCell, BlockRow } from '../BlockRow/BlockRow'
import ProjectSlider from '../ProjectSlider/ProjectSlider'
import { useInView } from '../../hooks/useInView'
import { useSlider } from '../../hooks/useSlider'
import { useScrollSteps } from '../../hooks/useScrollSteps'
import { site } from '../../content/site'
import type { Project } from '../../content/types'
import './Stage.css'

/**
 * The opening screen, held in place while the page scrolls through one
 * step per project. Each step crossing the middle of the viewport brings
 * its photograph in on the right; after the last project the page carries
 * on to the work index. Prev/next (and the arrow keys) scroll to a step,
 * so buttons and scrolling are the same motion.
 */
export default function Stage({ slides }: { slides: Project[] }) {
  const ref = useRef<HTMLElement>(null)
  const onScreen = useInView(ref, { threshold: 0.1 })
  const step = useScrollSteps(ref, '.stage__step')
  const { index, previous, direction, go, settle } = useSlider(slides.length)
  const pad = (n: number) => String(n).padStart(2, '0')

  // scroll position → slide. The slideshow walks toward the scrolled-to step
  // one project at a time; each move waits for the previous reveal's
  // animationend (previous === null), so no image is cut off mid-reveal.
  useEffect(() => {
    if (previous !== null || step === index) return
    go(index + Math.sign(step - index))
  }, [step, index, previous, go])

  const scrollToStep = useCallback((i: number) => {
    const root = ref.current
    if (!root) return
    if (i >= slides.length) {
      document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })
      return
    }
    const el = root.querySelector<HTMLElement>(`[data-step="${Math.max(0, i)}"]`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [slides.length])

  return (
    <section
      className="stage"
      id="top"
      ref={ref}
      aria-label="Studio Orpiment"
      style={{ '--steps': slides.length } as CSSProperties}
    >
      <div className="stage__steps" aria-hidden="true">
        {slides.map((s, i) => (
          <div className="stage__step" data-step={i} key={s.id} />
        ))}
      </div>

      <div className="stage__frame" data-tone={slides[index]?.tone ?? 'paper'}>
        <div className="stage__panel">
          <h1 className="display stage__name tone-text">{site.name}</h1>

          <BlockRow className="stage__blocks">
            <BlockCell kind="index">
              <span>{pad(index + 1)}</span>
              <span className="block-cell__of">{pad(slides.length)}</span>
            </BlockCell>
            <BlockCell kind="title" as="p">Projects</BlockCell>
            <BlockCell kind="action" href="#work">All projects</BlockCell>
          </BlockRow>

          <div className="stage__foot">
            <p className="display stage__disciplines tone-text">
              {site.disciplines.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </p>
            <p className="stage__lede tone-text">{site.lede}</p>
          </div>
        </div>

        <ProjectSlider
          slides={slides}
          index={index}
          previous={previous}
          direction={direction}
          onPrev={() => scrollToStep(index - 1)}
          onNext={() => scrollToStep(index + 1)}
          onSettled={settle}
          keysActive={onScreen}
        />
      </div>
    </section>
  )
}
