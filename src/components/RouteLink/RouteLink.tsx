import { AnchorHTMLAttributes, MouseEvent } from 'react'
import { navigate } from '../../hooks/useRoute'

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }

/** an anchor that navigates in-site without a page load; other links pass through */
export default function RouteLink({ href, onClick, ...rest }: Props) {
  const internal = href.startsWith('/')
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (!internal || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
    e.preventDefault()
    navigate(href)
  }
  const external = href.startsWith('http')
  return (
    <a
      href={href}
      onClick={handle}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      {...rest}
    />
  )
}
