import './Logo.css'

type Props = { size?: 'sm' | 'lg'; className?: string }

/** the two-letter SO mark — the only place Monstera is used */
export default function Logo({ size = 'sm', className = '' }: Props) {
  return (
    <span className={`logo logo--${size} ${className}`} role="img" aria-label="Studio Orpiment">
      SO
    </span>
  )
}
