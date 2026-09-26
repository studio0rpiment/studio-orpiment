import { CSSProperties, ReactNode } from 'react'
import './Block.css'

type BlockProps = {
  id?: string
  className?: string
  style?: CSSProperties
  onActivate?: () => void
  /** optional label rendered on the block's face (e.g. "work") */
  label?: ReactNode
}

export default function Block({ id, className, style, onActivate, label }: BlockProps) {
  const base = label ? 'block block--labeled' : 'block'
  const cls = className ? `${base} ${className}` : base
  return (
    <div className={cls} data-block-id={id} style={style} onClick={onActivate}>
      {label && <span className="block__label">{label}</span>}
    </div>
  )
}
