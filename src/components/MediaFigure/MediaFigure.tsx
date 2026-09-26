import InViewVideo from '../InViewVideo/InViewVideo'
import type { MediaItem } from '../../content/types'
import './MediaFigure.css'

export default function MediaFigure({ item }: { item: MediaItem }) {
  return (
    <figure className={`media-figure ${item.portrait ? 'media-figure--portrait' : 'media-figure--landscape'}`}>
      <div className="media-figure__frame">
        {item.kind === 'video' ? (
          <InViewVideo className="media-figure__media" src={item.src} label={item.caption} />
        ) : (
          <img className="media-figure__media" src={item.src} alt={item.caption ?? ''} loading="lazy" decoding="async" />
        )}
      </div>
      {item.caption && <figcaption className="eyebrow media-figure__caption">{item.caption}</figcaption>}
    </figure>
  )
}
