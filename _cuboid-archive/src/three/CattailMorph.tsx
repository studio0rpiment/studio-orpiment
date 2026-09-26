import { useMemo, useRef } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js'
import * as THREE from 'three'

/**
 * CattailMorph — a point cloud that loops through 4 cattail growth stages.
 *
 * Ported from a CodePen prototype (KevinPatton1/bNdggOm). Distilled down to:
 *   • Load 4 PLY files (with vertex colors) via `useLoader` + PLYLoader.
 *   • Normalize every stage to the same vertex count so each particle can be
 *     index-matched between stages (i.e. particle #i in stage A always maps
 *     to particle #i in stage B).
 *   • In `useFrame`, compute the current stage and a blend factor based on
 *     elapsed time, then write per-vertex interpolated positions and colors
 *     into the morphing geometry's buffers.
 *   • Cosine-smoothed transitions and a subtle vertical "breathing" bob.
 *
 * Other transition modes from the original (Bezier flow, spawn/dissolve,
 * organic) are intentionally not included; this is the "direct interpolation"
 * baseline. They can be reintroduced as alternate transition functions later.
 */

const STAGE_URLS = [
  'https://res.cloudinary.com/djz8b4fhb/image/upload/v1749068499/cattailStage_1_jnsmiw.ply',
  'https://res.cloudinary.com/djz8b4fhb/image/upload/v1749068499/cattailStage2_kf5iop.ply',
  'https://res.cloudinary.com/djz8b4fhb/image/upload/v1749068499/cattailStage3_ytnt4c.ply',
  'https://res.cloudinary.com/djz8b4fhb/image/upload/v1749068499/cattailStage4_wvvme4.ply',
]

const CYCLE_SECONDS = 20  // full pass through all 4 stages

type Stage = {
  positions: Float32Array
  colors: Float32Array | null
  count: number
}

// Cosine smoothing: maps a linear 0→1 ramp to a smooth ease-in-out 0→1 curve.
function smooth(t: number): number {
  return 0.5 * (1 - Math.cos(Math.PI * t))
}

export default function CattailMorph() {
  // useLoader takes an array of URLs and returns an array of results, all
  // through Suspense — the Canvas's built-in Suspense boundary handles the
  // loading state (nothing renders until all 4 PLYs finish loading).
  const sourceGeometries = useLoader(PLYLoader, STAGE_URLS)

  // Re-sample every stage to the same vertex count, picked as the minimum
  // across all 4. This lets us index-match particles between stages so
  // particle #i has a defined source and destination at every transition.
  const stages = useMemo<Stage[]>(() => {
    const minCount = Math.min(
      ...sourceGeometries.map((g) => g.attributes.position.count),
    )

    return sourceGeometries.map((geom) => {
      const positions = geom.attributes.position
      const colors = geom.attributes.color as THREE.BufferAttribute | undefined
      const step = positions.count / minCount

      const sampledPositions = new Float32Array(minCount * 3)
      const sampledColors = colors ? new Float32Array(minCount * 3) : null

      for (let i = 0; i < minCount; i++) {
        const idx = Math.floor(i * step)
        sampledPositions[i * 3] = positions.getX(idx)
        sampledPositions[i * 3 + 1] = positions.getY(idx)
        sampledPositions[i * 3 + 2] = positions.getZ(idx)
        if (colors && sampledColors) {
          sampledColors[i * 3] = colors.getX(idx)
          sampledColors[i * 3 + 1] = colors.getY(idx)
          sampledColors[i * 3 + 2] = colors.getZ(idx)
        }
      }

      return { positions: sampledPositions, colors: sampledColors, count: minCount }
    })
  }, [sourceGeometries])

  // The morphing geometry — starts as a copy of stage 0; useFrame mutates
  // its position and color buffers in place each frame.
  const morphGeometry = useMemo(() => {
    const geom = new THREE.BufferGeometry()
    geom.setAttribute(
      'position',
      new THREE.BufferAttribute(stages[0].positions.slice(), 3),
    )
    if (stages[0].colors) {
      geom.setAttribute(
        'color',
        new THREE.BufferAttribute(stages[0].colors.slice(), 3),
      )
    }
    return geom
  }, [stages])

  const pointsRef = useRef<THREE.Points>(null)

  useFrame((state) => {
    if (!pointsRef.current) return

    const t = state.clock.getElapsedTime()
    const cycleProgress = (t % CYCLE_SECONDS) / CYCLE_SECONDS  // 0 → 1, loops

    const stageCount = stages.length
    const stageProgress = cycleProgress * stageCount           // 0 → 4
    const currentIdx = Math.floor(stageProgress) % stageCount
    const nextIdx = (currentIdx + 1) % stageCount              // wraps 3 → 0
    const blend = smooth(stageProgress - Math.floor(stageProgress))

    const positions = morphGeometry.attributes.position as THREE.BufferAttribute
    const colors = morphGeometry.attributes.color as THREE.BufferAttribute | undefined
    const current = stages[currentIdx]
    const next = stages[nextIdx]

    for (let i = 0; i < current.count; i++) {
      const i3 = i * 3
      const cx = current.positions[i3]
      const cy = current.positions[i3 + 1]
      const cz = current.positions[i3 + 2]
      const nx = next.positions[i3]
      const ny = next.positions[i3 + 1]
      const nz = next.positions[i3 + 2]

      positions.setXYZ(
        i,
        cx + (nx - cx) * blend,
        cy + (ny - cy) * blend,
        cz + (nz - cz) * blend,
      )

      if (colors && current.colors && next.colors) {
        const cr = current.colors[i3]
        const cg = current.colors[i3 + 1]
        const cb = current.colors[i3 + 2]
        const nr = next.colors[i3]
        const ng = next.colors[i3 + 1]
        const nb = next.colors[i3 + 2]

        colors.setXYZ(
          i,
          cr + (nr - cr) * blend,
          cg + (ng - cg) * blend,
          cb + (nb - cb) * blend,
        )
      }
    }

    positions.needsUpdate = true
    if (colors) colors.needsUpdate = true

    // Subtle vertical breathing — slow sine bob on the whole cloud.
    pointsRef.current.position.y = Math.sin(t * 0.5) * 0.08
  })

  return (
    // PLY files come from Blender's Z-up world; rotate -90° on X to
    // re-orient the cattail's long axis to three.js's Y-up.
    <points ref={pointsRef} rotation={[-Math.PI / 2, 0, 0]}>
      <primitive object={morphGeometry} attach="geometry" />
      <pointsMaterial
        size={0.08}
        vertexColors={!!stages[0].colors}
        color={stages[0].colors ? undefined : 0xeebd34}
        sizeAttenuation
      />
    </points>
  )
}
