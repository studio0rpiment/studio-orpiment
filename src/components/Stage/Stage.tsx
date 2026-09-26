import { useRef } from 'react'
import { BlockCell, BlockRow } from '../BlockRow/BlockRow'
import ProjectSlider from '../ProjectSlider/ProjectSlider'
import { useInView } from '../../hooks/useInView'
import { useSlider } from '../../hooks/useSlider'
import { site } from '../../content/site'
import type { Slide } from '../../content/types'
import './Stage.css'

/**
 * The opening screen. Left: the name, the projects label row, and the
 * disciplines. Right: full-bleed photography of one project at a time.
 */
export default function Stage({ slides }: { slides: Slide[] }) {
  const ref = useRef<HTMLElement>(null)
  const onScreen = useInView(ref, { threshold: 0.4 })
  const { index, previous, direction, next, prev, settle } = useSlider(slides.length)
  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <section className="stage" id="top" ref={ref} aria-label="Studio Orpiment">
      <div className="stage__panel">
        <h1 className="display stage__name">{site.name}</h1>

        <BlockRow className="stage__blocks">
          <BlockCell kind="index">
            <span>{pad(index + 1)}</span>
            <span className="block-cell__of">{pad(slides.length)}</span>
          </BlockCell>
          <BlockCell kind="title" as="p">Projects</BlockCell>
          <BlockCell kind="action" href="#work">All projects</BlockCell>
        </BlockRow>

        <div className="stage__foot">
          <p className="display stage__disciplines">
            {site.disciplines.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </p>
          <p className="stage__lede">{site.lede}</p>
        </div>
      </div>

      <ProjectSlider
        slides={slides}
        index={index}
        previous={previous}
        direction={direction}
        onPrev={prev}
        onNext={next}
        onSettled={settle}
        keysActive={onScreen}
      />
    </section>
  )
}
