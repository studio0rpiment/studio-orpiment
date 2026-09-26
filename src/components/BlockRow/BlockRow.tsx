import { ReactNode } from 'react'
import './BlockRow.css'

/**
 * A row of solid blocks that runs in from the left edge — the page's
 * label system: [index] [title] and an optional dropped [action].
 */
export function BlockRow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`block-row ${className}`}>{children}</div>
}

type CellProps = {
  kind: 'index' | 'title' | 'action'
  children: ReactNode
  href?: string
  as?: 'h2' | 'p' | 'span'
}

export function BlockCell({ kind, children, href, as: Tag = 'span' }: CellProps) {
  const cls = `block-cell block-cell--${kind}`
  if (href) {
    const external = href.startsWith('http')
    return (
      <a className={cls} href={href} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}>
        {children}
      </a>
    )
  }
  return <Tag className={cls}>{children}</Tag>
}
