import './SlideNav.css'

type Props = { onPrev: () => void; onNext: () => void }

export default function SlideNav({ onPrev, onNext }: Props) {
  return (
    <div className="slide-nav" role="group" aria-label="Projects">
      <button type="button" className="slide-nav__btn" onClick={onPrev} aria-label="Previous project">
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3 5 8l5 5" /></svg>
      </button>
      <button type="button" className="slide-nav__btn" onClick={onNext} aria-label="Next project">
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3 5 5-5 5" /></svg>
      </button>
    </div>
  )
}
