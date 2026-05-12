import { Canvas } from '@react-three/fiber'
import { useEffect, useState } from 'react'
import Scene from './Scene'

/**
 * ViewportCanvas — one full-page Canvas, one camera, one scene.
 *
 * The canvas is clipped to the union of every Block's DOM rect via CSS
 * `clip-path`, so it only renders inside the block regions. The warm
 * background (and everything else painted between blocks) reads as paper
 * hiding the rest of the world.
 *
 * Because the sphere lives in a single shared scene, you literally see the
 * same object move through space; a block only "sees" it when its on-screen
 * projection happens to land inside that block's rect.
 *
 * Clip-path is rebuilt from live `getBoundingClientRect()` measurements of
 * every element with `data-block-id`, and refreshed by a ResizeObserver on
 * the body — so it stays correct through font loads, window resizes, and
 * any future Grid retuning.
 *
 * NOTE: when you later want each block to show a different project (its own
 * scene/camera), swap this single-Canvas approach for drei's <View> pattern
 * — each Block renders a <View>, the canvas hosts a <View.Port />, and each
 * View can have independent content.
 */
export default function ViewportCanvas() {
  const [clipPath, setClipPath] = useState<string>('none')

  useEffect(() => {
    const update = () => {
      const blocks = document.querySelectorAll<HTMLElement>('[data-block-id]')
      if (!blocks.length) {
        setClipPath('none')
        return
      }
      const subPaths: string[] = []
      blocks.forEach((block) => {
        const r = block.getBoundingClientRect()
        // Each block becomes one sub-path; their union is the visible region.
        subPaths.push(
          `M ${r.left} ${r.top} L ${r.right} ${r.top} L ${r.right} ${r.bottom} L ${r.left} ${r.bottom} Z`,
        )
      })
      setClipPath(`path('${subPaths.join(' ')}')`)
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(document.body)
    window.addEventListener('resize', update)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <Canvas
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        // No `pointer-events: none` here — we want clicks inside the block
        // regions to reach the 3D content (e.g. clickable sphere). The
        // `clip-path` already makes the regions BETWEEN blocks non-
        // interactive at the pixel level, so clicks there still pass
        // through to the page.
        zIndex: 50,
        clipPath,
        WebkitClipPath: clipPath,
      }}
      camera={{ position: [0, 0, 6], fov: 50 }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 2]}
    >
      <Scene />
    </Canvas>
  )
}
