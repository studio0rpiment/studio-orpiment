import { useEffect } from 'react'
import { useKey } from '../../hooks/useKey'
import RouteLink from '../RouteLink/RouteLink'
import { nav, site } from '../../content/site'
import './MenuOverlay.css'

type Props = { open: boolean; onClose: () => void }

/** full-height index of the page's sections; any choice (or Escape) closes it */
export default function MenuOverlay({ open, onClose }: Props) {
  useKey(['Escape'], onClose, open)
  useEffect(() => {
    if (!open) return
    document.body.classList.add('is-locked')
    return () => document.body.classList.remove('is-locked')
  }, [open])

  return (
    <div className={`menu-overlay ${open ? 'is-open' : ''}`} aria-hidden={!open} id="menu">
      <nav className="menu-overlay__nav" aria-label="Sections">
        {nav.map((l, i) => (
          <RouteLink key={l.href} href={l.href} onClick={onClose} tabIndex={open ? 0 : -1}>
            <span className="menu-overlay__num">{String(i + 1).padStart(2, '0')}</span>
            <span className="display tone-text">{l.label}</span>
          </RouteLink>
        ))}
      </nav>
      <div className="menu-overlay__foot">
        {site.email && (
          <a href={`mailto:${site.email}`} tabIndex={open ? 0 : -1}>{site.email}</a>
        )}
        <a href={site.kpSite.href} tabIndex={open ? 0 : -1}>{site.kpSite.label}</a>
      </div>
    </div>
  )
}
