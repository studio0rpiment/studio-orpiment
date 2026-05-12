import { useRef } from 'react'
import { useFrame, useThree, ThreeEvent } from '@react-three/fiber'
import type { Mesh } from 'three'

/**
 * Sphere — a blue sphere that loops on a slow path through world space,
 * and gently hops on click.
 *
 * Time-based animation: position is a pure function of elapsed time, so
 * the same sphere rendered in multiple Views (or visible across multiple
 * block windows of one shared canvas) stays perfectly in sync.
 *
 * Click handling: relies on R3F's built-in raycaster. Requires the parent
 * <Canvas> to have pointer events enabled (i.e. NOT `pointer-events: none`)
 * so the canvas can receive the pointer event in the first place.
 */
const JUMP_DURATION = 0.7  // seconds — full up-and-down
const JUMP_HEIGHT = 1.5    // world units at the peak

export default function Sphere() {
  const ref = useRef<Mesh>(null)
  const jumpStartRef = useRef<number | null>(null)  // set to the clock time of the last click
  const { clock } = useThree()

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.getElapsedTime()

    // Base oscillation — wide x traversal so it can pass across block windows.
    ref.current.position.x = Math.sin(t * 0.5) * 3.5
    let y = Math.sin(t * 0.35) * 1.5

    // Jump offset — adds onto the base y while a jump is active.
    if (jumpStartRef.current !== null) {
      const elapsed = t - jumpStartRef.current
      if (elapsed < JUMP_DURATION) {
        // Sin curve from 0 → 1 → 0 over the jump duration — symmetric and gentle.
        y += Math.sin((elapsed / JUMP_DURATION) * Math.PI) * JUMP_HEIGHT
      } else {
        jumpStartRef.current = null
      }
    }

    ref.current.position.y = y
    ref.current.position.z = Math.cos(t * 0.4) * 1.0
  })

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    // Ignore clicks during an active jump — feels less "spammy".
    if (jumpStartRef.current === null) {
      jumpStartRef.current = clock.getElapsedTime()
    }
  }

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    document.body.style.cursor = 'pointer'
  }

  const handlePointerOut = () => {
    document.body.style.cursor = 'auto'
  }

  return (
    <mesh
      ref={ref}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial color="#3b82f6" roughness={0.35} metalness={0.1} />
    </mesh>
  )
}
