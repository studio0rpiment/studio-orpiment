import RouteLink from '../RouteLink/RouteLink'
import './TextBlock.css'

type Props = { heading?: string; text: string; link?: { href: string; label: string } }

/** a paragraph of a case study, with an optional run-in heading and link */
export default function TextBlock({ heading, text, link }: Props) {
  return (
    <div className="text-block">
      <p className="text-block__text">
        {heading && <strong className="text-block__heading">{heading}</strong>}
        {text}
      </p>
      {link && (
        <RouteLink className="text-block__link" href={link.href}>{link.label} ↗</RouteLink>
      )}
    </div>
  )
}
