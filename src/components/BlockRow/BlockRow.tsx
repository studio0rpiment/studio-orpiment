import { ReactNode } from 'react'
import RouteLink from '../RouteLink/RouteLink'
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
    return (
      <RouteLink className={cls} href={href}>
        {children}
      </RouteLink>
    )
  }
  return <Tag className={cls}>{children}</Tag>
}
