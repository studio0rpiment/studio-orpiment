import MediaFigure from '../MediaFigure/MediaFigure'
import type { MediaItem } from '../../content/types'
import './MediaRow.css'

/** a row of figures across the case study's grid */
export default function MediaRow({ items }: { items: MediaItem[] }) {
  return (
    <div className="media-row">
      {items.map((m) => (
        <MediaFigure key={m.src} item={m} />
      ))}
    </div>
  )
}
