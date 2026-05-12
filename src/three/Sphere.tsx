import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'

/**
 * Sphere — a blue sphere that loops on a slow Lissajous-style path.
 *
 * Time-based animation: position is a pure function of elapsed time, so the
 * same sphere rendered in multiple Views (one per Block) stays perfectly in
 * sync — they all evaluate the same `t` on the same frame tick.
 */
export default function Sphere() {
  const ref = useRef<Mesh>(null)

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.getElapsedTime()
    // Amplitudes tuned so the sphere's screen projection traverses across
    // the page-sized canvas — it'll pass through different block windows
    // depending on where it is in world space.
    ref.current.position.x = Math.sin(t * 0.5) * 3.5
    ref.current.position.y = Math.sin(t * 0.35) * 1.5
    ref.current.position.z = Math.cos(t * 0.4) * 1.0
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial color="#3b82f6" roughness={0.35} metalness={0.1} />
    </mesh>
  )
}
