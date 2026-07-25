import { Canvas } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import Scene from './Scene'
import { isWebGLAvailable } from './isWebGLAvailable'

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
 * every element with `data-block-id`. It refreshes on every animation
 * frame via requestAnimationFrame — so it stays correct through font
 * loads, window resizes, CSS transitions on the grid, and any other layout
 * change that doesn't trigger ResizeObserver. The path string is cached
 * and only pushed to React state when it actually changes, so steady-state
 * frames cost nothing.
 *
 * WebGL guard: a one-time capability probe on mount. If the browser can't
 * create a WebGL context (hardware acceleration disabled, GPU blocklisted,
 * or a GPU-process failure), we render nothing instead of letting r3f throw
 * an uncaught renderer error. The dark blocks still stand on their own via
 * CSS — the 3D windows just stay empty. The mount event drives the check,
 * the check drives state, state drives render; no polling.
 *
 * NOTE: when you later want each block to show a different project (its own
 * scene/camera), swap this single-Canvas approach for drei's <View> pattern
 * — each Block renders a <View>, the canvas hosts a <View.Port />, and each
 * View can have independent content.
 */
export default function ViewportCanvas() {
  const [webglAvailable] = useState<boolean>(isWebGLAvailable)
  const [clipPath, setClipPath] = useState<string>('none')
  const lastPathRef = useRef<string>('none')

  useEffect(() => {
    if (!webglAvailable) return

    let raf = 0

    const tick = () => {
      const blocks = document.querySelectorAll<HTMLElement>('[data-block-id]')
      let next = 'none'
      if (blocks.length) {
        const subPaths: string[] = []
        blocks.forEach((block) => {
          const r = block.getBoundingClientRect()
          subPaths.push(
            `M ${r.left} ${r.top} L ${r.right} ${r.top} L ${r.right} ${r.bottom} L ${r.left} ${r.bottom} Z`,
          )
        })
        next = `path('${subPaths.join(' ')}')`
      }
      // Only push to React state when the path actually changed — steady
      // frames don't cause a re-render.
      if (next !== lastPathRef.current) {
        lastPathRef.current = next
        setClipPath(next)
      }
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [webglAvailable])

  // No WebGL context available — degrade gracefully rather than throwing.
  if (!webglAvailable) return null

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
