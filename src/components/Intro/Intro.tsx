import { AnimationEvent, TransitionEvent, useEffect, useState } from 'react'
import { useKey } from '../../hooks/useKey'
import './Intro.css'

type Props = { words: string[]; onDone: () => void }

/**
 * Opening titles: one large word at a time on chocolate, then the panel
 * lifts away to reveal the stage. Each word's animationend advances to the
 * next; the lift's transitionend ends the intro. Click or Escape skips.
 */
export default function Intro({ words, onDone }: Props) {
  const [i, setI] = useState(0)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    document.body.classList.add('is-locked')
    return () => document.body.classList.remove('is-locked')
  }, [])
  useKey(['Escape', 'Enter', ' '], onDone)

  const onWordEnd = (e: AnimationEvent<HTMLSpanElement>) => {
    if (e.target !== e.currentTarget) return
    if (i < words.length - 1) setI(i + 1)
    else setLeaving(true)
  }
  const onLiftEnd = (e: TransitionEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && e.propertyName === 'transform') onDone()
  }

  const last = i === words.length - 1
  return (
    <div
      className={`intro ${leaving ? 'is-leaving' : ''}`}
      onClick={onDone}
      onTransitionEnd={onLiftEnd}
      aria-hidden="true"
    >
      <span className="intro__est">Studio Orpiment</span>
      <span key={i} className={`intro__word ${last ? 'intro__word--last' : ''}`} onAnimationEnd={onWordEnd}>
        {words[i]}
      </span>
      <span className="intro__count">
        {String(i + 1).padStart(2, '0')} . {String(words.length).padStart(2, '0')}
      </span>
    </div>
  )
}
