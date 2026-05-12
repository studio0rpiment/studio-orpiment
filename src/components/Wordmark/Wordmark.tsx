import './Wordmark.css'

/**
 * Wordmark — just the "Studio Orpiment" text.
 *
 * The orpiment-coloured accent bar that visually pairs with this wordmark
 * lives separately as `.landing__bar` in Landing.tsx so it's an independent
 * grid item and can be moved horizontally without coupling to the text.
 */
export default function Wordmark() {
  return <div className="wordmark">Studio Orpiment</div>
}
