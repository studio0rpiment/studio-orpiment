/**
 * isWebGLAvailable — probe whether this browser can actually hand out a
 * WebGL context right now.
 *
 * Returns false when hardware acceleration is disabled, the GPU is
 * blocklisted, or the GPU process failed to initialize (the Chrome case
 * "A WebGL context could not be created … GL_VENDOR = Disabled,
 * BindToCurrentSequence failed"). Lets callers skip mounting a <Canvas>
 * instead of letting three.js throw an uncaught "THREE.WebGLRenderer: A
 * WebGL context could not be created".
 *
 * Probes WebGL2 first (three r0.169's default), then WebGL1. The probe
 * canvas is never attached to the DOM, so it's collected right after.
 */
export function isWebGLAvailable(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')
    return gl != null
  } catch {
    return false
  }
}
