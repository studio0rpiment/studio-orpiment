import Lights from './Lights'
import Sphere from './Sphere'

/**
 * Scene — the shared 3D content rendered through each Block's viewport.
 *
 * Currently shows a single clickable sphere drifting through one shared
 * world. CattailMorph (the 4-stage point cloud morph) is staged in
 * `./CattailMorph.tsx` for when we wire up project-specific scenes per
 * block — just swap <Sphere /> for <CattailMorph /> to try it.
 */
export default function Scene() {
  return (
    <>
      <Lights />
      <Sphere />
    </>
  )
}
