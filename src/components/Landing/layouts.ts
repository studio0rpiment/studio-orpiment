/**
 * Layout definitions for the landing composition, per breakpoint.
 *
 * A LayoutConfig names which pieces are visible and where each one sits:
 * `assignments[layout][pieceIndex] -> slotIndex` (blocks first, then cells).
 * Desktop keeps the prime-permutation trick over all 17 slots; mobile is a
 * hand-composed portrait set (8 pieces, 8 slots, 2 art-directed layouts).
 * Row names (stage-start / rule-1 / rule-2 / rule-3 / stage-end) are shared
 * between the desktop and mobile grids, so placements stay valid in both.
 */

export type Placement = { col: string; row: string; straddle?: boolean }

export type LayoutConfig = {
  slots: Placement[]
  blockIds: string[]
  cellIds: string[]
  /** per layout: pieceIndex (blocks, then cells) -> slotIndex */
  assignments: number[][]
}

export const BLOCK_IDS = ['left-portrait', 'right-portrait', 'lower-left', 'lower-right']
export const ALL_CELL_IDS = ['r1c0', 'r1c2', 'r2c0', 'r2c1', 'r2c2', 'r3c0', 'r3c1', 'r3c2', 'r3c3', 'r4c0', 'r4c1', 'r4c2', 'r4c3']

const DESKTOP_BLOCK_SLOTS: Placement[] = [
  { col: '3 / 9', row: 'stage-start / rule-1' },
  { col: '14 / 20', row: 'stage-start / rule-2' },
  { col: '4 / 12', row: 'rule-1 / rule-2', straddle: true },
  { col: '10 / 19', row: 'rule-2 / rule-3', straddle: true },
]
const DESKTOP_CELL_SLOTS: Placement[] = [
  { col: '1 / 3', row: 'stage-start / rule-1' }, { col: '9 / 14', row: 'stage-start / rule-1' },
  { col: '1 / 3', row: 'rule-1 / rule-2' }, { col: '3 / 9', row: 'rule-1 / rule-2' }, { col: '9 / 14', row: 'rule-1 / rule-2' },
  { col: '1 / 3', row: 'rule-2 / rule-3' }, { col: '3 / 9', row: 'rule-2 / rule-3' }, { col: '9 / 14', row: 'rule-2 / rule-3' }, { col: '14 / 20', row: 'rule-2 / rule-3' },
  { col: '1 / 3', row: 'rule-3 / stage-end' }, { col: '3 / 9', row: 'rule-3 / stage-end' }, { col: '9 / 14', row: 'rule-3 / stage-end' }, { col: '14 / 20', row: 'rule-3 / stage-end' },
]
const DESKTOP_SLOTS = [...DESKTOP_BLOCK_SLOTS, ...DESKTOP_CELL_SLOTS]
// 17 slots and 17 is prime: any stride 1..16 is a bijection (same-area guarantee).
const DESKTOP_PERMUTATIONS = [
  { stride: 1, shift: 0 },
  { stride: 5, shift: 3 },
  { stride: 7, shift: 1 },
]

export const DESKTOP: LayoutConfig = {
  slots: DESKTOP_SLOTS,
  blockIds: BLOCK_IDS,
  cellIds: ALL_CELL_IDS,
  assignments: DESKTOP_PERMUTATIONS.map(({ stride, shift }) =>
    DESKTOP_SLOTS.map((_, i) => (i * stride + shift) % DESKTOP_SLOTS.length),
  ),
}

/**
 * Mobile: portrait poster on an 8-column grid. Hand-composed — with only
 * 8 pieces the permutation trick isn't needed, and art direction wins.
 */
const MOBILE_SLOTS: Placement[] = [
  { col: '2 / 7', row: 'stage-start / rule-1' }, // 0 hero portrait
  { col: '7 / 9', row: 'stage-start / rule-1' }, // 1 tall right column
  { col: '1 / 2', row: 'stage-start / rule-1' }, // 2 left sliver
  { col: '1 / 5', row: 'rule-1 / rule-2' },      // 3 mid left
  { col: '5 / 9', row: 'rule-1 / rule-2' },      // 4 mid right
  { col: '1 / 3', row: 'rule-2 / rule-3' },      // 5 low left
  { col: '3 / 8', row: 'rule-2 / rule-3' },      // 6 low wide
  { col: '8 / 9', row: 'rule-2 / rule-3' },      // 7 low sliver
]

export const MOBILE: LayoutConfig = {
  slots: MOBILE_SLOTS,
  blockIds: BLOCK_IDS,
  cellIds: ['r1c0', 'r1c2', 'r2c1', 'r3c2'],
  assignments: [
    // blocks: hero, right column, mid-left, low-wide · cells fill the rest
    [0, 1, 3, 6, 2, 4, 5, 7],
    // rearranged: blocks drop lower, hero hands to a cell
    [4, 6, 0, 1, 5, 2, 7, 3],
  ],
}

export function placementFor(config: LayoutConfig, id: string, layout: number): Placement {
  const ids = [...config.blockIds, ...config.cellIds]
  const i = ids.indexOf(id)
  const assignment = config.assignments[layout % config.assignments.length]
  return config.slots[assignment[i]]
}
