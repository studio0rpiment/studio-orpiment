import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { Points } from 'three'
import { onBump } from './rotationStore'

/**
 * Underlayer — the shared world seen through every cuboid window.
 * The Kenilworth plant point clouds (lotus → lily → cattail) with their real
 * scan colors, morphing continuously — the morph is ambience, part of the
 * render loop exactly like the drift. Clicks still matter: every cuboid
 * click (rotationStore bump) gives the morph a velocity impulse, surging it
 * toward the next form.
 *
 * Frame format (from scripts/convert-underlayer-ply.py, v2):
 *   POINT_COUNT * 3 float32 positions (centered, unit-box normalized)
 *   POINT_COUNT * 3 uint8   sRGB vertex colors
 * All frames share the same point count so morphing is a direct lerp of
 * position and color buffers (the Kenilworth "Direct Interpolation" mode).
 */

const FRAME_URLS = [
  '/models/underlayer/lotus_2.bin', // pink bloom
  '/models/underlayer/lily_1.bin', // green pads
  '/models/underlayer/cattail_1.bin', // olive spikes
]
const POINT_COUNT = 24000
/** ambient morph rate, phases/second (one full form change ≈ 25s) */
const BASE_SPEED = 0.04
/** fraction of each phase spent DWELLING on a resolved form, per side —
    the cloud holds a pure frame (true colors) between transitions instead
    of living in a muddy mid-blend */
const DWELL = 0.35
/** extra phase velocity added per cuboid click */
const CLICK_IMPULSE = 0.5
/** impulse decay factor, per second */
const IMPULSE_DECAY = 1.8

type Frame = { pos: Float32Array; col: Float32Array }

const smoothstep = (t: number) => t * t * (3 - 2 * t)
const srgbToLinear = (c: number) => Math.pow(c, 2.2)

export default function Underlayer() {
  const ref = useRef<Points>(null)
  const { size } = useThree()
  const [frames, setFrames] = useState<Frame[] | null>(null)
  const phaseRef = useRef(0)
  const impulseRef = useRef(0)
  const lastKRef = useRef(-1)
  const lastBaseRef = useRef(-1)

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const pos = new THREE.BufferAttribute(new Float32Array(POINT_COUNT * 3), 3)
    const col = new THREE.BufferAttribute(new Float32Array(POINT_COUNT * 3), 3)
    pos.setUsage(THREE.DynamicDrawUsage)
    col.setUsage(THREE.DynamicDrawUsage)
    geo.setAttribute('position', pos)
    geo.setAttribute('color', col)
    return geo
  }, [])

  // Load all frames once; seed the buffers with the first cloud.
  useEffect(() => {
    let cancelled = false
    Promise.all(
      FRAME_URLS.map((url) =>
        fetch(url)
          .then((r) => {
            if (!r.ok) throw new Error(`${url}: ${r.status}`)
            return r.arrayBuffer()
          })
          .then((buf): Frame => {
            const pos = new Float32Array(buf, 0, POINT_COUNT * 3)
            const raw = new Uint8Array(buf, POINT_COUNT * 3 * 4, POINT_COUNT * 3)
            const col = new Float32Array(POINT_COUNT * 3)
            for (let i = 0; i < col.length; i++) col[i] = srgbToLinear(raw[i] / 255)
            return { pos, col }
          }),
      ),
    )
      .then((loaded) => {
        if (cancelled) return
        setFrames(loaded)
        const pos = geometry.getAttribute('position') as THREE.BufferAttribute
        const col = geometry.getAttribute('color') as THREE.BufferAttribute
        ;(pos.array as Float32Array).set(loaded[0].pos)
        ;(col.array as Float32Array).set(loaded[0].col)
        pos.needsUpdate = true
        col.needsUpdate = true
        geometry.computeBoundingSphere()
      })
      .catch(() => {
        /* under-layer is ambience — fail silent, windows just stay empty */
      })
    return () => {
      cancelled = true
    }
  }, [geometry])

  // A cuboid click surges the morph toward the next form.
  useEffect(() => onBump(() => { impulseRef.current += CLICK_IMPULSE }), [])

  useFrame((state, delta) => {
    const points = ref.current
    if (!points) return

    // Drift + scale in orthographic pixel space (same family as the old Ball).
    const t = state.clock.elapsedTime
    const w = size.width
    const h = size.height
    points.position.set(
      -0.16 * w + Math.sin(t * 0.25) * 0.16 * w + Math.sin(t * 0.71) * 0.03 * w,
      0.04 * h + Math.sin(t * 0.18) * 0.16 * h + Math.cos(t * 0.53) * 0.03 * h,
      0,
    )
    points.scale.setScalar(Math.min(w, h) * 0.85)
    points.rotation.y = t * 0.05

    if (!frames) return

    // Continuous morph: ambient rate plus decaying click impulses.
    impulseRef.current *= Math.max(0, 1 - delta * IMPULSE_DECAY)
    phaseRef.current += delta * (BASE_SPEED + impulseRef.current)
    const phase = phaseRef.current

    const n = frames.length
    const base = Math.floor(phase)
    const a = frames[base % n]
    const b = frames[(base + 1) % n]
    const frac = phase - base
    const travel = frac <= DWELL ? 0 : frac >= 1 - DWELL ? 1 : (frac - DWELL) / (1 - 2 * DWELL)
    const k = smoothstep(travel)
    // Dwelling: the buffers already hold this exact blend — skip the rewrite.
    if (k === lastKRef.current && base === lastBaseRef.current) return
    lastKRef.current = k
    lastBaseRef.current = base
    const pos = geometry.getAttribute('position') as THREE.BufferAttribute
    const col = geometry.getAttribute('color') as THREE.BufferAttribute
    const po = pos.array as Float32Array
    const co = col.array as Float32Array
    for (let i = 0; i < po.length; i++) {
      po[i] = a.pos[i] + (b.pos[i] - a.pos[i]) * k
      co[i] = a.col[i] + (b.col[i] - a.col[i]) * k
    }
    pos.needsUpdate = true
    col.needsUpdate = true
  })

  return (
    <points ref={ref} geometry={geometry} renderOrder={2} frustumCulled={false}>
      <pointsMaterial
        vertexColors
        size={2}
        sizeAttenuation={false}
        depthTest={false}
        stencilWrite
        stencilRef={1}
        stencilFunc={THREE.EqualStencilFunc}
        stencilFail={THREE.KeepStencilOp}
        stencilZFail={THREE.KeepStencilOp}
        stencilZPass={THREE.KeepStencilOp}
      />
    </points>
  )
}
