import './Description.css'

/**
 * Description — the studio's tagline. Rendered as body text in
 * Rotor Overlay; positioned by `.landing__description` in Landing.css.
 */
export default function Description() {
  return (
    <p className="description">
      <span className="description__highlight">Studio 0rpiment</span> is an{' '}
      <span className="description__highlight">interactive multimedia</span>{' '}
      studio working in{' '}
      <span className="description__highlight">web-based</span> and{' '}
      <span className="description__highlight">physical</span> experiences.
    </p>
  )
}
