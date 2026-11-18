import type {
  AuditsScopeNode,
  AuditsScopeSnapshot,
} from '~/server/features/audits/types'

export type LaneId = 'named' | 'silent' | 'external'

export interface Box {
  x: number
  y: number
  width: number
  height: number
}

export interface Lane {
  id: LaneId
  /** Units in the lane. */
  count: number
  box: Box
}

/** A dependency package heading above its units in the external lane. */
export interface PackageLabel {
  text: string
  x: number
  y: number
}

export interface ScopeGraphLayout {
  width: number
  height: number
  /** By node index. */
  boxes: Box[]
  lanes: Lane[]
  packages: PackageLabel[]
}

export const NODE_WIDTH = 164
export const NODE_HEIGHT = 28
const ROW_GAP = 8
/** Room between columns for the arrows that pass there. */
const COLUMN_GAP = 52
const LANE_GAP = 44
const LANE_PADDING = 14
export const LANE_TITLE_HEIGHT = 30
const ROW_STEP = NODE_HEIGHT + ROW_GAP
const COLUMN_STEP = NODE_WIDTH + COLUMN_GAP
const ROWS_MIN = 5
/** The frame the graph is usually shown in; the layout aims to fill it. */
const TARGET_FRAME = { width: 900, height: 540 }

/** A unit or a package heading. */
type Slot = { node: number } | { label: string }

const STATE_ORDER: Record<AuditsScopeNode['state'], number> = {
  included: 0,
  excluded: 1,
  'not-mentioned': 2,
  unavailable: 3,
}

/** Which lane a unit is drawn in: what the report says, then where it is from. */
export function laneOf(node: AuditsScopeNode): LaneId {
  if (node.external) return 'external'
  return node.state === 'included' || node.state === 'excluded'
    ? 'named'
    : 'silent'
}

/**
 * Three lanes side by side, each a few columns of units: what the report
 * names, the project's own code it is silent about, and external
 * dependencies grouped by package. A lane lists what the audited code reaches
 * first, so arrows mostly run left to right and top to bottom.
 */
export function layoutScopeGraph(
  snapshot: AuditsScopeSnapshot,
): ScopeGraphLayout {
  const depth = depths(snapshot)
  const order = (a: number, b: number) => {
    const [na, nb] = [snapshot.nodes[a], snapshot.nodes[b]] as [
      AuditsScopeNode,
      AuditsScopeNode,
    ]
    return (
      STATE_ORDER[na.state] - STATE_ORDER[nb.state] ||
      Number(na.partial ?? false) - Number(nb.partial ?? false) ||
      (depth[a] ?? 0) - (depth[b] ?? 0) ||
      na.name.localeCompare(nb.name)
    )
  }

  const lanes = new Map<LaneId, Slot[]>()
  const indexes = snapshot.nodes.map((_, index) => index)
  for (const id of ['named', 'silent'] as const) {
    const members = indexes.filter(
      (i) => laneOf(snapshot.nodes[i] as AuditsScopeNode) === id,
    )
    if (members.length > 0) {
      lanes.set(
        id,
        members.toSorted(order).map((node) => ({ node })),
      )
    }
  }
  const packages = new Map<string, number[]>()
  for (const i of indexes) {
    const node = snapshot.nodes[i] as AuditsScopeNode
    if (!node.external) continue
    const label = packageLabel(node)
    packages.set(label, [...(packages.get(label) ?? []), i])
  }
  if (packages.size > 0) {
    lanes.set(
      'external',
      [...packages]
        .toSorted(([a, x], [b, y]) => y.length - x.length || a.localeCompare(b))
        .flatMap(([label, members]): Slot[] => [
          { label },
          ...members.toSorted(order).map((node) => ({ node })),
        ]),
    )
  }

  // The number of rows that shows the graph largest in a frame of the usual
  // shape; fewer rows on a tie, as wide reads better than tall here.
  const longest = Math.max(1, ...[...lanes.values()].map((l) => l.length))
  let best: ScopeGraphLayout | undefined
  let bestScale = 0
  for (let rows = ROWS_MIN; rows <= Math.max(ROWS_MIN, longest); rows++) {
    const placed = place(lanes, snapshot.nodes.length, rows)
    const scale = Math.min(
      TARGET_FRAME.width / placed.width,
      TARGET_FRAME.height / placed.height,
    )
    if (best === undefined || scale > bestScale + 1e-6) {
      best = placed
      bestScale = scale
    }
  }
  return best as ScopeGraphLayout
}

function place(
  lanes: Map<LaneId, Slot[]>,
  nodes: number,
  rows: number,
): ScopeGraphLayout {
  const boxes: Box[] = Array.from({ length: nodes }, () => ({
    x: 0,
    y: 0,
    width: NODE_WIDTH,
    height: NODE_HEIGHT,
  }))
  const placedLanes: Lane[] = []
  const labels: PackageLabel[] = []
  let x = 0
  let tallest = 0
  for (const [id, lane] of lanes) {
    const left = x
    x += LANE_PADDING
    let column = 0
    let row = 0
    for (const [i, slot] of lane.entries()) {
      // A heading stays with the first unit of its package.
      const isLastRow = row === rows - 1
      if (row >= rows || ('label' in slot && isLastRow && i > 0)) {
        column++
        row = 0
      }
      const slotX = x + column * COLUMN_STEP
      const slotY = LANE_TITLE_HEIGHT + row * ROW_STEP
      if ('label' in slot) {
        labels.push({ text: slot.label, x: slotX, y: slotY })
      } else {
        boxes[slot.node] = {
          x: slotX,
          y: slotY,
          width: NODE_WIDTH,
          height: NODE_HEIGHT,
        }
      }
      row++
      tallest = Math.max(tallest, row)
    }
    const width = (column + 1) * COLUMN_STEP - COLUMN_GAP + LANE_PADDING * 2
    placedLanes.push({
      id,
      count: lane.filter((slot) => 'node' in slot).length,
      box: { x: left, y: 0, width, height: 0 },
    })
    x = left + width + LANE_GAP
  }
  const height = LANE_TITLE_HEIGHT + tallest * ROW_STEP - ROW_GAP + LANE_PADDING
  for (const lane of placedLanes) lane.box.height = height
  return {
    width: Math.max(1, x - LANE_GAP),
    height,
    boxes,
    lanes: placedLanes,
    packages: labels,
  }
}

/** How many steps a unit is from the audited code, 0 for the audited code. */
function depths(snapshot: AuditsScopeSnapshot): number[] {
  const depth = snapshot.nodes.map((node) =>
    node.state === 'included' ? 0 : Number.POSITIVE_INFINITY,
  )
  const queue = depth.flatMap((d, index) => (d === 0 ? [index] : []))
  for (const from of queue) {
    for (const [source, to] of snapshot.edges) {
      if (source !== from || depth[to] !== Number.POSITIVE_INFINITY) continue
      depth[to] = (depth[from] as number) + 1
      queue.push(to)
    }
  }
  return depth
}

export function packageLabel(node: AuditsScopeNode): string {
  if (!node.external) return ''
  const { package: name, version } = node.external
  // `OpenZeppelin/openzeppelin-contracts` reads better as its repository name.
  const short =
    name.includes('/') && !name.startsWith('@')
      ? (name.split('/').at(-1) as string)
      : name
  return version ? `${short} ${version}` : short
}

/**
 * A curve from one unit to another: out of the side facing the target, or
 * around the right-hand side when both sit in one column.
 */
export function edgePath(from: Box, to: Box): string {
  const fromY = from.y + from.height / 2
  const toY = to.y + to.height / 2
  if (from.x === to.x) {
    const right = from.x + from.width
    const bulge = Math.min(COLUMN_GAP - 14, 16 + Math.abs(toY - fromY) / 8)
    return `M ${right} ${fromY} C ${right + bulge} ${fromY}, ${right + bulge} ${toY}, ${right} ${toY}`
  }
  const forward = to.x > from.x
  const startX = forward ? from.x + from.width : from.x
  const endX = forward ? to.x : to.x + to.width
  const bend = Math.max(22, Math.abs(endX - startX) / 2)
  const sign = forward ? 1 : -1
  return `M ${startX} ${fromY} C ${startX + sign * bend} ${fromY}, ${endX - sign * bend} ${toY}, ${endX} ${toY}`
}
