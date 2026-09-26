import Logo from '../Logo/Logo'
import { site } from '../../content/site'
import './SiteFooter.css'

/** closes the page on a solid block: the mark, the address, the year */
export default function SiteFooter() {
  return (
    <footer className="site-footer section" id="contact">
      <div className="grid site-footer__grid">
        <Logo size="lg" className="site-footer__logo" />
        <div className="site-footer__contact">
          <p className="eyebrow site-footer__label">Commissions + enquiries</p>
          {site.email && (
            <a className="display site-footer__email" href={`mailto:${site.email}`}>{site.email}</a>
          )}
        </div>
        <p className="site-footer__meta">
          <span>© {new Date().getFullYear()} {site.name}</span>
          <a href={site.kpSite.href}>{site.kpSite.label}</a>
        </p>
      </div>
    </footer>
  )
}
