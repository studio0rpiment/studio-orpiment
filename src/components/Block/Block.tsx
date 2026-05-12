import './Block.css'

type BlockProps = {
  /** Stable id — used by `ViewportCanvas` to find this block via `data-block-id`. */
  id?: string
  /** Class that places the block on the parent grid (e.g. `block--left-portrait`). */
  className?: string
}

/**
 * Block is a positioned rectangle on the landing grid AND a window into the
 * shared 3D world. The shared `<ViewportCanvas>` reads every block's DOM
 * rect (via `data-block-id`) and clips its render to the union of those
 * rects — so the same sphere, in the same world, is only visible through
 * these windows. The areas of the page between blocks "hide" the world.
 *
 * The block's dark CSS background shows through the canvas wherever the 3D
 * scene is transparent (i.e. around the sphere), giving the dark colour as
 * the in-window background.
 */
export default function Block({ id, className }: BlockProps) {
  const cls = className ? `block ${className}` : 'block'
  return <div className={cls} data-block-id={id} />
}
