/**
 * Lights — the standard rig used in every viewport's scene.
 *
 * Three-point setup: low ambient for base illumination, a strong directional
 * key from upper-right, and a softer fill point-light from upper-left for a
 * touch of rim. Tune intensities here once and every block updates.
 */
export default function Lights() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <pointLight position={[-3, 2, 4]} intensity={0.6} color="#ffffff" />
    </>
  )
}
