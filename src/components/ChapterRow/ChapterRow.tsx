import MediaFigure from '../MediaFigure/MediaFigure'
import type { Chapter } from '../../content/types'
import './ChapterRow.css'

export default function ChapterRow({ chapter, index }: { chapter: Chapter; index: number }) {
  const num = String(index + 1).padStart(2, '0')
  return (
    <article className="chapter" aria-labelledby={`chapter-${chapter.id}`}>
      <p className="band chapter__num">{num}</p>
      <h3 className="display chapter__title" id={`chapter-${chapter.id}`}>{chapter.title}</h3>
      <p className="chapter__body">{chapter.body}</p>
      <div className="chapter__media">
        {chapter.media.map((m) => (
          <MediaFigure key={m.src} item={m} />
        ))}
      </div>
    </article>
  )
}
