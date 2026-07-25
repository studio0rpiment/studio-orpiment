import { CSSProperties } from 'react'
import './Block.css'

type BlockProps = { id?: string; className?: string; style?: CSSProperties; onActivate?: () => void }

export default function Block({ id, className, style, onActivate }: BlockProps) {
  const cls = className ? `block ${className}` : 'block'
  return <div className={cls} data-block-id={id} style={style} onClick={onActivate} />
}
