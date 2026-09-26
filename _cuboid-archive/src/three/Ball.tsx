import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { Mesh } from 'three'

/**
 * Ball — the single shared-world object seen through every cuboid window.
 *
 * Its material reads the stencil (== 1), so it only paints where a Cuboid wrote
 * the mask; `depthTest` is off and its renderOrder is above the cuboids so it
 * always draws over the dark fill inside a window. It drifts on a slow non-
 * repeating path in the Canvas's orthographic pixel space and scales with the
 * viewport.
 */
export default function Ball() {
  const ref = useRef<Mesh>(null)
  const { size } = useThree()

  useFrame((state) => {
    const mesh = ref.current
    if (!mesh) return
    const t = state.clock.elapsedTime
    const w = size.width
    const h = size.height
    mesh.position.set(
      -0.16 * w + Math.sin(t * 0.25) * 0.16 * w + Math.sin(t * 0.71) * 0.03 * w,
      0.04 * h + Math.sin(t * 0.18) * 0.16 * h + Math.cos(t * 0.53) * 0.03 * h,
      0,
    )
    mesh.scale.setScalar(Math.min(w, h) * 0.12)
  })

  return (
    <mesh ref={ref} renderOrder={2}>
      <sphereGeometry args={[1, 48, 48]} />
      <meshStandardMaterial
        color="#3b82f6"
        roughness={0.35}
        metalness={0.1}
        depthTest={false}
        stencilWrite
        stencilRef={1}
        stencilFunc={THREE.EqualStencilFunc}
        stencilFail={THREE.KeepStencilOp}
        stencilZFail={THREE.KeepStencilOp}
        stencilZPass={THREE.KeepStencilOp}
      />
    </mesh>
  )
}
