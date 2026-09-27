import CaseBlock from '../CaseBlock/CaseBlock'
import type { Chapter } from '../../content/types'
import './ChapterRow.css'

/** a numbered chapter: its title and lead, then its blocks in order */
export default function ChapterRow({ chapter, index }: { chapter: Chapter; index: number }) {
  const num = String(index + 1).padStart(2, '0')
  return (
    <article className="chapter" aria-labelledby={`chapter-${chapter.id}`}>
      <p className="band chapter__num">{num}</p>
      <h3 className="display chapter__title" id={`chapter-${chapter.id}`}>{chapter.title}</h3>
      {chapter.lead && <p className="chapter__lead">{chapter.lead}</p>}
      <div className="chapter__blocks">
        {chapter.blocks.map((b, i) => (
          <CaseBlock key={i} block={b} />
        ))}
      </div>
    </article>
  )
}
