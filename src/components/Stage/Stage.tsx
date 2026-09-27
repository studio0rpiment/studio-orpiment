import { CSSProperties, useCallback, useEffect, useRef } from 'react'
import { BlockCell, BlockRow } from '../BlockRow/BlockRow'
import ProjectSlider from '../ProjectSlider/ProjectSlider'
import { useInView } from '../../hooks/useInView'
import { useSlider } from '../../hooks/useSlider'
import { useScrollSteps } from '../../hooks/useScrollSteps'
import { navigate } from '../../hooks/useRoute'
import { site } from '../../content/site'
import { numberOf } from '../../content/projects'
import type { Project, Tone } from '../../content/types'
import './Stage.css'

/**
 * The opening screen, held in place while the page scrolls through one
 * step per project. Each step crossing the middle of the viewport brings
 * its photograph in on the right; after the last project the page carries
 * on to the work index. Prev/next (and the arrow keys) scroll to a step,
 * so buttons and scrolling are the same motion.
 *
 * With a case study open, the stage holds that one project: a single screen,
 * the slideshow paused on it, and the study scrolling in underneath. Prev/next
 * then leave the study for the neighbouring slide.
 */
type Props = {
  slides: Project[]
  /** a project to hold on while its case study is open */
  hold?: string
  /** told whenever the palette on screen changes (the menu and corners follow it) */
  onTone?: (tone: Tone) => void
}

export default function Stage({ slides, hold, onTone }: Props) {
  const ref = useRef<HTMLElement>(null)
  const onScreen = useInView(ref, { threshold: 0.1 })
  const held = hold ? slides.findIndex((s) => s.id === hold) : -1
  const holding = held >= 0
  const steps = holding ? [slides[held]] : slides
  const step = useScrollSteps(ref, '.stage__step', steps.map((s) => s.id).join())
  const slider = useSlider(slides.length)
  const { go, settle } = slider
  // while holding, the held project is shown as is, with no reveal in progress
  const index = holding ? held : slider.index
  const previous = holding ? null : slider.previous
  const direction = slider.direction
  const pad = (n: number) => String(n).padStart(2, '0')

  // scroll position → slide. The slideshow walks toward the scrolled-to step
  // one project at a time; each move waits for the previous reveal's
  // animationend (previous === null), so no image is cut off mid-reveal.
  // A swipe moves one step, so neighbouring steps walk one reveal at a time.
  // A long jump (arriving from below the slideshow, or from a link) goes
  // straight to its slide in one reveal instead of running through the set.
  useEffect(() => {
    if (holding || previous !== null || step === index) return
    go(Math.abs(step - index) > 1 ? step : index + Math.sign(step - index))
  }, [holding, step, index, previous, go])

  const shown = slides[index]
  const tone = shown?.tone ?? 'paper'
  useEffect(() => { onTone?.(tone) }, [tone, onTone])

  const scrollToStep = useCallback((i: number) => {
    if (holding) {
      // leave the study for the neighbouring slide
      const to = slides[Math.min(Math.max(i, 0), slides.length - 1)]
      navigate(`/#slide-${to.id}`)
      return
    }
    const root = ref.current
    if (!root) return
    if (i >= slides.length) {
      document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })
      return
    }
    const el = root.querySelector<HTMLElement>(`[data-step="${Math.max(0, i)}"]`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [holding, slides])

  return (
    <section
      className="stage"
      id="top"
      ref={ref}
      aria-label="Studio Orpiment"
      style={{ '--steps': steps.length } as CSSProperties}
    >
      <div className="stage__steps" aria-hidden="true">
        {steps.map((s) => {
          const i = slides.indexOf(s)
          return <div className="stage__step" data-step={i} id={`slide-${s.id}`} key={s.id} />
        })}
      </div>

      <div className="stage__frame" data-tone={tone}>
        <div className="stage__panel">
          {/* a full load, not an in-site link: the dice are rolled again */}
          <h1 className="display stage__name tone-text">
            <a href="/">{site.name}</a>
          </h1>
          <p className="stage__intro tone-text">{site.lede}</p>

          <BlockRow className="stage__blocks">
            <BlockCell kind="index">
              <span>{pad(shown ? numberOf(shown.id) : index + 1)}</span>
              <span className="block-cell__of">{pad(slides.length)}</span>
            </BlockCell>
            <BlockCell kind="title" as="p">Projects</BlockCell>
            <BlockCell kind="action" href="/#work">All projects</BlockCell>
          </BlockRow>

          {/* the project, changing with the slide: its title large, its
              keywords as inverted bands, then its sentence */}
          <div className="stage__foot" key={shown?.id}>
            {shown && <p className="display stage__title tone-text">{shown.title}</p>}
            <ul className="stage__keywords" aria-label="Keywords">
              {(shown?.disciplines ?? site.disciplines).map((d) => (
                <li className="band" key={d}>{d}</li>
              ))}
            </ul>
            {shown?.about && <p className="stage__lede tone-text">{shown.about}</p>}
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
          caseOpen={holding}
        />
      </div>
    </section>
  )
}
