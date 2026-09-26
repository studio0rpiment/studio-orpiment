import { ReactNode } from 'react'
import { BlockCell, BlockRow } from '../BlockRow/BlockRow'
import './SectionHead.css'

type Props = { index: string; label: string; title?: ReactNode; id?: string; action?: { href: string; label: string } }

/** a section opens with its label row of blocks, then an optional large title */
export default function SectionHead({ index, label, title, id, action }: Props) {
  return (
    <header className="section-head">
      <BlockRow>
        <BlockCell kind="index">{index}</BlockCell>
        <BlockCell kind="title" as="h2">{label}</BlockCell>
        {action && <BlockCell kind="action" href={action.href}>{action.label}</BlockCell>}
      </BlockRow>
      {title && <p className="display section-head__title" id={id}>{title}</p>}
    </header>
  )
}
