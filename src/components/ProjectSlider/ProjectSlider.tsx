import { AnimationEvent, CSSProperties } from 'react'
import SlideCard from '../SlideCard/SlideCard'
import SlideNav from '../SlideNav/SlideNav'
import { useKey } from '../../hooks/useKey'
import type { Project } from '../../content/types'
import './ProjectSlider.css'

type Props = {
  slides: Project[]
  index: number
  previous: number | null
  direction: 1 | -1
  onPrev: () => void
  onNext: () => void
  onSettled: () => void
  /** arrow keys step only while the slider is on screen */
  keysActive: boolean
}

/**
 * Full-bleed project photography. All photographs are mounted (so they are
 * loaded before they are needed); the active one is revealed over the
 * previous by a wipe in the direction of travel. The wipe's animationend
 * releases the previous slide. Arrow keys step while the stage is on screen.
 */
export default function ProjectSlider({ slides, index, previous, direction, onPrev, onNext, onSettled, keysActive }: Props) {
  useKey(['ArrowLeft'], onPrev, keysActive)
  useKey(['ArrowRight'], onNext, keysActive)

  const onRevealEnd = (e: AnimationEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onSettled()
  }

  return (
    <div className="project-slider" data-direction={direction}>
      {slides.map((s, i) => {
        const state = i === index ? (previous !== null ? 'entering' : 'active') : i === previous ? 'previous' : 'idle'
        return (
          <div
            key={s.id}
            className={`project-slider__photo is-${state} ${s.fit === 'contain' ? 'is-contain' : ''}`}
            onAnimationEnd={state === 'entering' ? onRevealEnd : undefined}
          >
            <img
              src={s.image}
              alt={i === index ? s.alt ?? '' : ''}
              style={{ objectPosition: s.focus ?? '50% 50%' } as CSSProperties}
              decoding="async"
            />
          </div>
        )
      })}
      <div className="project-slider__ui">
        <SlideCard slide={slides[index]} index={index} count={slides.length} />
        <SlideNav onPrev={onPrev} onNext={onNext} />
      </div>
    </div>
  )
}
