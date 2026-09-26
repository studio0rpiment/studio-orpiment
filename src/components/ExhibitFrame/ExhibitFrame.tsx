import { lazy, Suspense, useMemo, useRef, useState } from 'react'
import { useInView } from '../../hooks/useInView'
import type { CloudForm } from '../../content/types'
import './ExhibitFrame.css'

/* three.js lives in its own chunk, fetched only as the exhibit nears the viewport */
const PointCloudCanvas = lazy(() => import('../PointCloudCanvas/PointCloudCanvas'))

function webglAvailable(): boolean {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

type Props = { forms: CloudForm[]; caption: string }

/**
 * The live exhibit: frame, caption and form selector render immediately;
 * the WebGL canvas mounts once the frame is within reach of the viewport.
 */
export default function ExhibitFrame({ forms, caption }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const near = useInView(ref, { once: true, rootMargin: '200px 0px' })
  const canRender = useMemo(() => webglAvailable(), [])
  const [active, setActive] = useState(forms[0].id)

  return (
    <figure className="exhibit">
      <div className="exhibit__stage" ref={ref}>
        {near && canRender && (
          <Suspense fallback={null}>
            <PointCloudCanvas forms={forms} activeId={active} />
          </Suspense>
        )}
        {!canRender && <p className="exhibit__notice">This exhibit requires WebGL.</p>}
        <div className="exhibit__forms" role="group" aria-label="Point cloud form">
          {forms.map((f) => (
            <button
              key={f.id}
              type="button"
              className="exhibit__form"
              aria-pressed={f.id === active}
              onClick={() => setActive(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
      <figcaption className="eyebrow exhibit__caption">{caption}</figcaption>
    </figure>
  )
}
