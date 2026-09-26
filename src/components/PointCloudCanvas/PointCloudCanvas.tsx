import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as THREE from 'three'
import type { CloudForm } from '../../content/types'

/**
 * Frame format (scripts/convert-underlayer-ply.py, v2):
 *   POINT_COUNT * 3 float32 positions (centred, unit-box normalised)
 *   POINT_COUNT * 3 uint8   sRGB vertex colours
 * Every frame shares the point count, so morphing is a direct lerp.
 */
const POINT_COUNT = 24000
const MORPH_SECONDS = 1.4

type Frame = { pos: Float32Array; col: Float32Array }

const smoothstep = (t: number) => t * t * (3 - 2 * t)
const srgbToLinear = (c: number) => Math.pow(c, 2.2)

async function loadFrame(url: string): Promise<Frame> {
  const r = await fetch(url)
  if (!r.ok) throw new Error(`${url}: ${r.status}`)
  const buf = await r.arrayBuffer()
  const pos = new Float32Array(buf, 0, POINT_COUNT * 3)
  const raw = new Uint8Array(buf, POINT_COUNT * 3 * 4, POINT_COUNT * 3)
  const col = new Float32Array(POINT_COUNT * 3)
  for (let i = 0; i < col.length; i++) col[i] = srgbToLinear(raw[i] / 255)
  return { pos, col }
}

/**
 * Renders on demand only: a frame is drawn when the controls move or while
 * a morph is in progress — when nothing is touched, nothing is drawn.
 */
function Cloud({ frames, target }: { frames: Frame[]; target: number }) {
  const invalidate = useThree((s) => s.invalidate)
  const dpr = useThree((s) => s.viewport.dpr)
  const from = useRef<{ pos: Float32Array; col: Float32Array } | null>(null)
  const progress = useRef(1)

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const pos = new THREE.BufferAttribute(frames[target].pos.slice(), 3)
    const col = new THREE.BufferAttribute(frames[target].col.slice(), 3)
    pos.setUsage(THREE.DynamicDrawUsage)
    col.setUsage(THREE.DynamicDrawUsage)
    geo.setAttribute('position', pos)
    geo.setAttribute('color', col)
    geo.computeBoundingSphere()
    return geo
    // seeded once per frame set; later changes of `target` morph instead
  }, [frames])

  useEffect(() => () => geometry.dispose(), [geometry])

  // A new target (a button press) snapshots the current cloud and starts a morph.
  useEffect(() => {
    const pos = geometry.getAttribute('position').array as Float32Array
    const col = geometry.getAttribute('color').array as Float32Array
    from.current = { pos: pos.slice(), col: col.slice() }
    progress.current = 0
    invalidate()
  }, [target, geometry, invalidate])

  useFrame((_, delta) => {
    if (progress.current >= 1 || !from.current) return
    progress.current = Math.min(1, progress.current + delta / MORPH_SECONDS)
    const k = smoothstep(progress.current)
    const a = from.current
    const b = frames[target]
    const posAttr = geometry.getAttribute('position') as THREE.BufferAttribute
    const colAttr = geometry.getAttribute('color') as THREE.BufferAttribute
    const po = posAttr.array as Float32Array
    const co = colAttr.array as Float32Array
    for (let i = 0; i < po.length; i++) {
      po[i] = a.pos[i] + (b.pos[i] - a.pos[i]) * k
      co[i] = a.col[i] + (b.col[i] - a.col[i]) * k
    }
    posAttr.needsUpdate = true
    colAttr.needsUpdate = true
    // keep drawing only until the morph lands
    if (progress.current < 1) invalidate()
  })

  return (
    // scans are Blender Z-up; turn them to three.js Y-up
    <points geometry={geometry} frustumCulled={false} rotation={[-Math.PI / 2, 0, 0]}>
      <pointsMaterial vertexColors size={1.6 * dpr} sizeAttenuation={false} />
    </points>
  )
}

/**
 * Drag to turn. Controls emit 'change' when moved (or while damping settles),
 * and each change requests exactly one frame. On touch screens a vertical
 * swipe still scrolls the page; a horizontal one turns the cloud.
 */
function TurnControls() {
  const camera = useThree((s) => s.camera)
  const gl = useThree((s) => s.gl)
  const invalidate = useThree((s) => s.invalidate)
  const controls = useMemo(() => new OrbitControls(camera, gl.domElement), [camera, gl])

  useEffect(() => {
    controls.enableZoom = false
    controls.enablePan = false
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.rotateSpeed = 0.6
    controls.minPolarAngle = Math.PI * 0.2
    controls.maxPolarAngle = Math.PI * 0.8
    gl.domElement.style.touchAction = 'pan-y'
    const onChange = () => invalidate()
    controls.addEventListener('change', onChange)
    return () => {
      controls.removeEventListener('change', onChange)
      controls.dispose()
    }
  }, [controls, gl, invalidate])

  // only runs on frames that were requested; damping keeps requesting until still
  useFrame(() => controls.update())
  return null
}

export default function PointCloudCanvas({ forms, activeId }: { forms: CloudForm[]; activeId: string }) {
  const [frames, setFrames] = useState<Frame[] | null>(null)
  const urls = forms.map((f) => f.src).join('|')

  useEffect(() => {
    let cancelled = false
    Promise.all(urls.split('|').map(loadFrame))
      .then((f) => !cancelled && setFrames(f))
      .catch(() => { /* exhibit stays an empty frame */ })
    return () => {
      cancelled = true
    }
  }, [urls])

  const target = Math.max(0, forms.findIndex((f) => f.id === activeId))

  return (
    <Canvas
      flat
      frameloop="demand"
      dpr={[1, 2]}
      camera={{ position: [0, 0.28, 1.7], fov: 35, near: 0.01, far: 20 }}
      aria-label="Interactive point cloud of plants from Kenilworth Aquatic Gardens"
    >
      {frames && <Cloud frames={frames} target={target} />}
      <TurnControls />
    </Canvas>
  )
}
