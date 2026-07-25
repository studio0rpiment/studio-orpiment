import { useRef } from 'react'
import { useFrame, useThree, ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import type { Mesh } from 'three'

/**
 * Sphere — a blue sphere that:
 *   • drifts on a slow non-repeating path through world space,
 *   • floats up like a helium balloon on click,
 *   • drifts away from the cursor on hover (shy-balloon repulsion).
 *
 * Time-based animation: position is a pure function of elapsed time, so
 * the same sphere rendered in multiple Views (or visible across multiple
 * block windows of one shared canvas) stays perfectly in sync.
 *
 * Click & hover handling: relies on R3F's built-in raycaster. Requires
 * the parent <Canvas> to have pointer events enabled (i.e. NOT
 * `pointer-events: none`) so the canvas can receive the pointer event.
 */
const JUMP_DURATION = 2.0  // seconds — slow rise, slow settle
const JUMP_HEIGHT = 1.8    // world units at the peak
const SWAY_AMOUNT = 0.12   // horizontal sway while lifted (0 to disable)

// Shy-balloon hover repulsion — cursor pushes the ball away with quadratic
// falloff over distance.
const HOVER_RADIUS = 3.5    // world units; push begins when cursor closer than this
const HOVER_STRENGTH = 0.5  // max world units of push at zero distance

// Reusable temp objects so we don't allocate every frame.
const tempCursorWorld = new THREE.Vector3()
const groundPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)  // z=0 plane

/**
 * Quintic smootherstep — like CSS's smoothstep but with zero velocity AND
 * zero acceleration at the endpoints (C² continuity).
 */
function smootherstep(p: number): number {
  return p * p * p * (p * (p * 6 - 15) + 10)
}

/**
 * Asymmetric balloon lift curve — quick rise, long lazy descent.
 * Continuous smooth bump (no plateau), C² throughout.
 *
 * PEAK controls where the apex falls in the 0→1 progress range:
 *   0.5 = symmetric
 *   0.3 = brisk rise (30%), lazy descent (70%) — the helium read.
 */
const PEAK = 0.3
function balloonCurve(t: number): number {
  return t < PEAK
    ? smootherstep(t / PEAK)
    : smootherstep((1 - t) / (1 - PEAK))
}

export default function Sphere() {
  const ref = useRef<Mesh>(null)
  const jumpStartRef = useRef<number | null>(null)  // clock time of last click, or null
  const { clock } = useThree()

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.getElapsedTime()

    // Base path — two non-harmonic sin waves per axis so the path never
    // visibly repeats. Tune amplitudes / frequencies to taste.
    let x = Math.sin(t * 0.25) * 3.5 + Math.sin(t * 0.71) * 0.5
    let y = Math.sin(t * 0.18) * 1.5 + Math.cos(t * 0.53) * 0.3
    let z = Math.cos(t * 0.20) * 1.0 + Math.sin(t * 0.47) * 0.4

    // Helium lift on click — adds onto base y, with horizontal sway in both
    // x and z that tapers in/out with the lift amount.
    if (jumpStartRef.current !== null) {
      const elapsed = t - jumpStartRef.current
      if (elapsed < JUMP_DURATION) {
        const lift = balloonCurve(elapsed / JUMP_DURATION)
        y += lift * JUMP_HEIGHT
        x += (Math.sin(elapsed * 2) * 0.7 + Math.sin(elapsed * 3.3) * 0.3) * SWAY_AMOUNT * lift
        z += (Math.cos(elapsed * 1.7) * 0.6 + Math.sin(elapsed * 2.5) * 0.4) * SWAY_AMOUNT * lift
      } else {
        jumpStartRef.current = null
      }
    }

    // Hover repulsion — project the cursor's NDC onto the z=0 plane in world
    // space, then push the ball away with quadratic falloff. Uses canvas-
    // level pointer state (not mesh hover) so the ball doesn't oscillate
    // in/out of the cursor.
    state.raycaster.setFromCamera(state.pointer, state.camera)
    if (state.raycaster.ray.intersectPlane(groundPlane, tempCursorWorld)) {
      const dx = x - tempCursorWorld.x
      const dy = y - tempCursorWorld.y
      const dist = Math.hypot(dx, dy)
      if (dist < HOVER_RADIUS && dist > 0.001) {
        const falloff = 1 - dist / HOVER_RADIUS   // 0 at edge, 1 at center
        const push = falloff * falloff * HOVER_STRENGTH  // quadratic ramp
        x += (dx / dist) * push
        y += (dy / dist) * push
      }
    }

    ref.current.position.x = x
    ref.current.position.y = y
    ref.current.position.z = z
  })

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    // Ignore clicks during an active lift — keeps the float clean.
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
