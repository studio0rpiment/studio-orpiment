import { Canvas } from '@react-three/fiber'
import { useEffect, useState } from 'react'
import Cuboid, { PieceKind } from './Cuboid'
import Ball from './Ball'
import { isWebGLAvailable } from './isWebGLAvailable'

/**
 * ViewportCanvas — the shared 3D world, rendered from cuboids that mirror the
 * DOM placeholders. The canvas is purely VISUAL (pointer-events: none); clicks
 * are handled on the DOM placeholders themselves (see Landing), which bump the
 * rotation store — DOM stacking resolves overlaps deterministically. Every
 * cuboid writes the stencil; the shared <Ball> is revealed only inside them.
 */
type Piece = { el: HTMLElement; kind: PieceKind }

export default function ViewportCanvas() {
  const [webglAvailable] = useState<boolean>(isWebGLAvailable)
  const [pieces, setPieces] = useState<Piece[]>([])

  useEffect(() => {
    if (!webglAvailable) return
    const blocks = Array.from(document.querySelectorAll<HTMLElement>('[data-block-id]')).map((el) => ({ el, kind: 'block' as const }))
    const cells = Array.from(document.querySelectorAll<HTMLElement>('[data-cell-id]')).map((el) => ({ el, kind: 'cell' as const }))
    setPieces([...blocks, ...cells])
  }, [webglAvailable])

  if (!webglAvailable) return null

  return (
    <Canvas
      orthographic
      camera={{ zoom: 1, position: [0, 0, 5000], near: 0.1, far: 20000 }}
      gl={{ alpha: true, antialias: true, stencil: true }}
      dpr={[1, 2]}
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 50, pointerEvents: 'none' }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[0.3, 0.9, 1]} intensity={1.6} />
      <Ball />
      {pieces.map((p, i) => (<Cuboid key={i} element={p.el} kind={p.kind} />))}
    </Canvas>
  )
}
