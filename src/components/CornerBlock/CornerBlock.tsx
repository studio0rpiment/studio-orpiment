import { ReactNode } from 'react'
import './CornerBlock.css'

type Props = {
  side: 'left' | 'right'
  children: ReactNode
  label?: string
  href?: string
  onClick?: () => void
  expanded?: boolean
}

/** a fixed square in a top corner of the viewport — Menu on the left, Write on the right */
export default function CornerBlock({ side, children, label, href, onClick, expanded }: Props) {
  const cls = `corner-block corner-block--${side}`
  if (href) {
    return (
      <a className={cls} href={href} aria-label={label}>
        {children}
      </a>
    )
  }
  return (
    <button type="button" className={cls} onClick={onClick} aria-label={label} aria-expanded={expanded}>
      {children}
    </button>
  )
}
