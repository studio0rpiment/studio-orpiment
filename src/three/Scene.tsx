import Sphere from './Sphere'
import Lights from './Lights'

/**
 * Scene — the shared 3D content rendered through each Block's viewport.
 *
 * Kept as a single composable unit so any block can opt into showing it
 * (or pass different content as children to <Block>). To add more objects,
 * extend this file; every viewport picks the change up automatically.
 */
export default function Scene() {
  return (
    <>
      <Lights />
      <Sphere />
    </>
  )
}
