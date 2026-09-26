import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { LineSegments, Mesh } from 'three'
import { getRotation } from './rotationStore'
import { getSpread, getSpreadRevision } from './spreadStore'
import { drawCard } from './faceCards'
import { projectBySlug } from '../projects'

const BOX = new THREE.BoxGeometry(1, 1, 1)
const EDGES_FULL = new THREE.EdgesGeometry(BOX)
const COLOR_INK = '#2B1810'
const COLOR_ORPIMENT = '#EEBD34'
const COLOR_PAPER = '#F5F4ED'   // the original paper colour the cells hold

function edgesOmitting(faces: Set<string>): THREE.BufferGeometry {
  const pos = EDGES_FULL.attributes.position
  const drop = (a: number, b: number): boolean =>
    (faces.has('left') && pos.getX(a) < -0.49 && pos.getX(b) < -0.49) ||
    (faces.has('right') && pos.getX(a) > 0.49 && pos.getX(b) > 0.49) ||
    (faces.has('bottom') && pos.getY(a) < -0.49 && pos.getY(b) < -0.49) ||
    (faces.has('top') && pos.getY(a) > 0.49 && pos.getY(b) > 0.49)
  const kept: number[] = []
  for (let i = 0; i < pos.count; i += 2) {
    if (drop(i, i + 1)) continue
    kept.push(pos.getX(i), pos.getY(i), pos.getZ(i), pos.getX(i + 1), pos.getY(i + 1), pos.getZ(i + 1))
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(kept, 3))
  return g
}
const EDGES_NO_BOTTOM = edgesOmitting(new Set(['bottom']))

export type PieceKind = 'block' | 'cell'

/** BoxGeometry material slots: [+x, -x, +y, -y, +z, -z].
    Which slot faces the camera after k quarter-turns depends on the axis. */
const ARRIVING_SLOT: Record<'x' | 'y', number[]> = {
  y: [4, 1, 5, 0], // tall pieces turn about Y
  x: [4, 2, 5, 3], // wide pieces turn about X
}

function makeBase(kind: PieceKind): THREE.MeshBasicMaterial {
  if (kind === 'block') {
    // dark window: writes the stencil so the Underlayer shows inside
    return new THREE.MeshBasicMaterial({
      color: COLOR_INK,
      stencilWrite: true,
      stencilRef: 1,
      stencilFunc: THREE.AlwaysStencilFunc,
      stencilZPass: THREE.ReplaceStencilOp,
    })
  }
  // opaque paper tile: holds the original colour, hides the void behind
  return new THREE.MeshBasicMaterial({ color: COLOR_PAPER })
}

export default function Cuboid({ element, kind }: { element: HTMLElement; kind: PieceKind }) {
  const ref = useRef<Mesh>(null)
  const edgeRef = useRef<LineSegments>(null)
  const angle = useRef(0)
  const ready = useRef(false)
  const paintedRevision = useRef(getSpreadRevision())
  const id = element.getAttribute('data-block-id') || element.getAttribute('data-cell-id') || ''
  const { size } = useThree()

  // one material per face so a card can ride a single face
  const materials = useMemo(() => Array.from({ length: 6 }, () => makeBase(kind)), [kind])
  useEffect(() => () => materials.forEach((m) => { m.map?.dispose(); m.dispose() }), [materials])

  useFrame((_, delta) => {
    const mesh = ref.current
    if (!mesh) return
    const r = element.getBoundingClientRect()
    // Pieces hidden by the active layout (display:none) collapse their rect —
    // hide the cuboid rather than easing a 1px ghost around.
    const hidden = r.width < 2 && r.height < 2
    mesh.visible = !hidden
    if (hidden) { ready.current = false; return }
    const w = Math.max(r.width, 1); const h = Math.max(r.height, 1); const d = Math.min(w, h)
    const axis: 'x' | 'y' = h > w ? 'y' : 'x'

    // A spread change paints the ARRIVING face before the turn lands.
    const revision = getSpreadRevision()
    if (revision !== paintedRevision.current) {
      paintedRevision.current = revision
      const k = Math.round(getRotation(id) / (Math.PI / 2))
      const slot = ARRIVING_SLOT[axis][((k % 4) + 4) % 4]
      const slug = getSpread()
      const project = slug ? projectBySlug(slug) : undefined
      const card = project?.spread?.[id]
      const old = materials[slot]
      if (project && card) {
        void drawCard(project, card, w, h).then((tex) => {
          if (paintedRevision.current !== revision) { tex.dispose(); return }
          old.map?.dispose()
          materials[slot] = new THREE.MeshBasicMaterial({ map: tex })
          if (ref.current) ref.current.material = [...materials]
        })
      } else {
        old.map?.dispose()
        materials[slot] = makeBase(kind)
        mesh.material = [...materials]
      }
    }

    const tx = r.left + w / 2 - size.width / 2; const ty = size.height / 2 - (r.top + h / 2)
    if (!ready.current) { mesh.position.set(tx, ty, 0); mesh.scale.set(w, h, d); ready.current = true }
    else {
      const ke = 1 - Math.pow(0.0009, delta)
      mesh.position.x += (tx - mesh.position.x) * ke; mesh.position.y += (ty - mesh.position.y) * ke
      mesh.scale.x += (w - mesh.scale.x) * ke; mesh.scale.y += (h - mesh.scale.y) * ke; mesh.scale.z += (d - mesh.scale.z) * ke
    }
    const kr = 1 - Math.pow(0.0016, delta)
    angle.current += (getRotation(id) - angle.current) * kr
    mesh.rotation.set(axis === 'x' ? angle.current : 0, axis === 'y' ? angle.current : 0, 0)
    const eg = edgeRef.current
    if (eg) { const atLeft = r.left < size.width * 0.06; const atBottom = r.bottom > size.height * 0.94; eg.visible = !atLeft; eg.geometry = atBottom ? EDGES_NO_BOTTOM : EDGES_FULL }
  })

  return (
    <mesh ref={ref} material={materials} renderOrder={0}>
      <boxGeometry args={[1, 1, 1]} />
      <lineSegments ref={edgeRef} geometry={EDGES_FULL} renderOrder={1}>
        <lineBasicMaterial color={kind === 'block' ? COLOR_ORPIMENT : COLOR_INK} transparent opacity={0.9} />
      </lineSegments>
    </mesh>
  )
}
