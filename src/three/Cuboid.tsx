import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { Mesh, LineSegments } from 'three'
import { getRotation } from './rotationStore'

const BOX = new THREE.BoxGeometry(1, 1, 1)
const EDGES_FULL = new THREE.EdgesGeometry(BOX)
const COLOR_INK = '#2B1810'
const COLOR_ORPIMENT = '#EEBD34'

// Edges omitting a face (local x/y = ±0.5). Used so pieces on an OUTER edge of
// the composition (no rule line to meet) stay open there.
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

/**
 * Cuboid — one line-defined piece, mirroring its DOM placeholder in ortho pixel
 * space. It EASES toward its DOM rect (position + size) so layout rearranges
 * animate; rotation eases toward the rotation store's target. Its outline
 * adapts to POSITION: a piece sitting on the left page margin drops its outline
 * entirely (edges removed — the unconnected rule lines carry the shape); a piece
 * on the stage-end bottom drops just its bottom edge.
 */
export default function Cuboid({ element, kind }: { element: HTMLElement; kind: PieceKind }) {
  const ref = useRef<Mesh>(null)
  const edgeRef = useRef<LineSegments>(null)
  const angle = useRef(0)
  const ready = useRef(false)
  const id = element.getAttribute('data-block-id') || element.getAttribute('data-cell-id') || ''
  const { size } = useThree()

  useFrame((_, delta) => {
    const mesh = ref.current
    if (!mesh) return
    const r = element.getBoundingClientRect()
    const w = Math.max(r.width, 1)
    const h = Math.max(r.height, 1)
    const d = Math.min(w, h)
    const axis: 'x' | 'y' = h > w ? 'y' : 'x'
    const tx = r.left + w / 2 - size.width / 2
    const ty = size.height / 2 - (r.top + h / 2)

    if (!ready.current) {
      mesh.position.set(tx, ty, 0)
      mesh.scale.set(w, h, d)
      ready.current = true
    } else {
      const ke = 1 - Math.pow(0.0009, delta) // ease toward the (possibly new) rect
      mesh.position.x += (tx - mesh.position.x) * ke
      mesh.position.y += (ty - mesh.position.y) * ke
      mesh.scale.x += (w - mesh.scale.x) * ke
      mesh.scale.y += (h - mesh.scale.y) * ke
      mesh.scale.z += (d - mesh.scale.z) * ke
    }

    const kr = 1 - Math.pow(0.0016, delta)
    angle.current += (getRotation(id) - angle.current) * kr
    mesh.rotation.set(axis === 'x' ? angle.current : 0, axis === 'y' ? angle.current : 0, 0)

    // outline follows position
    const eg = edgeRef.current
    if (eg) {
      const atLeft = r.left < size.width * 0.06
      const atBottom = r.bottom > size.height * 0.94
      eg.visible = !atLeft
      eg.geometry = atBottom ? EDGES_NO_BOTTOM : EDGES_FULL
    }
  })

  return (
    <mesh ref={ref} renderOrder={0}>
      <boxGeometry args={[1, 1, 1]} />
      {kind === 'block' ? (
        <meshBasicMaterial color={COLOR_INK} stencilWrite stencilRef={1} stencilFunc={THREE.AlwaysStencilFunc} stencilZPass={THREE.ReplaceStencilOp} />
      ) : (
        <meshBasicMaterial colorWrite={false} stencilWrite stencilRef={1} stencilFunc={THREE.AlwaysStencilFunc} stencilZPass={THREE.ReplaceStencilOp} />
      )}
      <lineSegments ref={edgeRef} geometry={EDGES_FULL} renderOrder={1}>
        <lineBasicMaterial color={kind === 'block' ? COLOR_ORPIMENT : COLOR_INK} transparent opacity={0.9} />
      </lineSegments>
    </mesh>
  )
}
