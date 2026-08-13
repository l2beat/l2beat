import type {
  InteropTokenRelationsEdge,
  InteropTokenRelationsNode,
} from '~/server/features/scaling/interop/token/getInteropTokenRelationsGraph'

/**
 * Places the nodes of a token relations graph. Backing runs along one primary
 * axis: either left to right in compact views or top to bottom when a wide
 * canvas can give a busy graph room to fan out.
 *
 * Within a column, nodes are arranged as a tidy tree — every node's children
 * are contiguous and the node is centred against them. Almost every token graph
 * is a forest (across the whole dataset only 11 nodes have a second backer and
 * only 7 connections skip a column), so this ordering leaves connections
 * running cleanly between columns instead of cutting across other nodes.
 *
 * Deployments with no connection at all are set aside in a block past the last
 * column, where they cannot be mistaken for part of the structure.
 */

export const NODE_WIDTH = 168
export const NODE_HEIGHT = 64
export const GROUP_NODE_HEIGHT = 76
/** Between neighbouring nodes inside one layer. */
const STACK_GAP = 24
/** Between one column and the next, leaving room for the connections. */
const COLUMN_GAP = 148
/** Between one row and the next in the wide, top-to-bottom layout. */
const ROW_GAP = 112
const UNCONNECTED_GAP = 96

export type RelationsLayoutOrientation = 'left-to-right' | 'top-to-bottom'

export interface NodeBox {
  x: number
  y: number
  width: number
  height: number
}

export interface RelationsLayout {
  boxes: Map<string, NodeBox>
  /** Which logical layer each node landed in, so edges know how far they reach. */
  columnOf: Map<string, number>
  /** Start of each layer on the primary axis. */
  columnXs: number[]
  orientation: RelationsLayoutOrientation
  width: number
  height: number
  /** X of the divider left of the unconnected block, if there is one. */
  unconnectedDividerX: number | undefined
}

export function layoutRelationsGraph(
  nodes: InteropTokenRelationsNode[],
  edges: InteropTokenRelationsEdge[],
  unconnectedNodeIds: string[],
  /** Overrides for nodes drawn taller than usual, e.g. an expanded group. */
  heightOverrides?: ReadonlyMap<string, number>,
  orientation: RelationsLayoutOrientation = 'left-to-right',
  /** Overrides for nodes drawn wider than usual, e.g. an expanded group. */
  widthOverrides?: ReadonlyMap<string, number>,
): RelationsLayout {
  const nodeHeight = (node: InteropTokenRelationsNode) =>
    heightOverrides?.get(node.id) ??
    (node.deployments.length > 1 ? GROUP_NODE_HEIGHT : NODE_HEIGHT)
  const nodeWidth = (node: InteropTokenRelationsNode) =>
    widthOverrides?.get(node.id) ?? NODE_WIDTH

  const unconnected = new Set(unconnectedNodeIds)
  const connected = nodes.filter((node) => !unconnected.has(node.id))
  const loose = nodes.filter((node) => unconnected.has(node.id))

  const columns = assignColumnGroups(connected, edges)
  const columnOf = new Map<string, number>()
  columns.forEach((column, index) => {
    for (const node of column) columnOf.set(node.id, index)
  })

  const boxes = new Map<string, NodeBox>()
  const columnXs: number[] = []
  let dagWidth = 0
  let dagHeight = 0

  if (orientation === 'top-to-bottom') {
    const xs = stackWithinLayers(columns, edges, nodeWidth, 'center')
    let y = 0
    for (const column of columns) {
      columnXs.push(y)
      const layerHeight = Math.max(0, ...column.map(nodeHeight))
      for (const node of column) {
        boxes.set(node.id, {
          x: xs.get(node.id) ?? 0,
          y,
          width: nodeWidth(node),
          height: nodeHeight(node),
        })
      }
      y += layerHeight + ROW_GAP
    }
    dagWidth = Math.max(
      0,
      ...[...boxes.values()].map((box) => box.x + box.width),
    )
    dagHeight = columns.length > 0 ? y - ROW_GAP : 0
  } else {
    const ys = stackWithinLayers(columns, edges, nodeHeight, 'start')
    let x = 0
    for (const column of columns) {
      columnXs.push(x)
      const columnWidth = Math.max(NODE_WIDTH, ...column.map(nodeWidth))
      for (const node of column) {
        boxes.set(node.id, {
          x,
          y: ys.get(node.id) ?? 0,
          width: nodeWidth(node),
          height: nodeHeight(node),
        })
      }
      x += columnWidth + COLUMN_GAP
    }
    dagWidth = columns.length > 0 ? x - COLUMN_GAP : 0
    dagHeight = Math.max(
      0,
      ...[...boxes.values()].map((box) => box.y + box.height),
    )
  }

  let unconnectedDividerX: number | undefined
  let width = dagWidth
  let height = dagHeight
  if (loose.length > 0) {
    const startX = dagWidth > 0 ? dagWidth + UNCONNECTED_GAP : 0
    unconnectedDividerX =
      dagWidth > 0 ? dagWidth + UNCONNECTED_GAP / 2 : undefined
    // Shaped to stand about as tall as the structure beside it, so the block
    // reads as a sidebar rather than a second diagram.
    const perColumn = Math.max(
      1,
      Math.round(dagHeight / (NODE_HEIGHT + STACK_GAP)) || 1,
    )
    const rowsNeeded = Math.min(perColumn, loose.length)
    let looseX = startX
    let looseHeight = 0
    for (let start = 0; start < loose.length; start += rowsNeeded) {
      const column = loose.slice(start, start + rowsNeeded)
      const columnWidth = Math.max(NODE_WIDTH, ...column.map(nodeWidth))
      let looseY = 0
      for (const node of column) {
        boxes.set(node.id, {
          x: looseX,
          y: looseY,
          width: nodeWidth(node),
          height: nodeHeight(node),
        })
        looseY += nodeHeight(node) + STACK_GAP
      }
      looseHeight = Math.max(looseHeight, looseY - STACK_GAP)
      looseX += columnWidth + STACK_GAP
    }
    width = looseX - STACK_GAP
    height = Math.max(dagHeight, looseHeight)
  }

  return {
    boxes,
    columnOf,
    columnXs,
    orientation,
    width,
    height,
    unconnectedDividerX,
  }
}

/**
 * Busiest first. A node with no measured volume sorts last rather than as
 * zero, so "nothing moved" and "not measured" do not read the same.
 */
function byVolumeThenId(
  a: { id: string; volume: number | null },
  b: { id: string; volume: number | null },
): number {
  const left = a.volume ?? -1
  const right = b.volume ?? -1
  return right - left || a.id.localeCompare(b.id)
}

/** Longest path from a node nothing backs, which is the node's column. */
function assignColumnGroups(
  nodes: InteropTokenRelationsNode[],
  edges: InteropTokenRelationsEdge[],
): InteropTokenRelationsNode[][] {
  if (nodes.length === 0) return []

  const ids = new Set(nodes.map((node) => node.id))
  const backing = edges.filter(
    (edge) => edge.kind === 'backs' && ids.has(edge.from) && ids.has(edge.to),
  )

  const outgoing = new Map<string, string[]>()
  const remaining = new Map<string, number>(nodes.map((node) => [node.id, 0]))
  for (const edge of backing) {
    outgoing.set(edge.from, [...(outgoing.get(edge.from) ?? []), edge.to])
    remaining.set(edge.to, (remaining.get(edge.to) ?? 0) + 1)
  }

  const column = new Map<string, number>(nodes.map((node) => [node.id, 0]))
  const queue = nodes
    .filter((node) => remaining.get(node.id) === 0)
    .map((node) => node.id)
  let processed = 0
  while (queue.length > 0) {
    const id = queue.shift() as string
    processed++
    for (const next of outgoing.get(id) ?? []) {
      column.set(
        next,
        Math.max(column.get(next) ?? 0, (column.get(id) ?? 0) + 1),
      )
      remaining.set(next, (remaining.get(next) ?? 0) - 1)
      if (remaining.get(next) === 0) queue.push(next)
    }
  }
  // Defensive only: upstream guarantees acyclicity, but a cycle must degrade to
  // a drawable picture rather than losing nodes.
  if (processed < nodes.length) {
    for (const node of nodes) {
      if ((remaining.get(node.id) ?? 0) > 0) column.set(node.id, 0)
    }
  }

  const depth = Math.max(0, ...column.values())
  const groups: InteropTokenRelationsNode[][] = Array.from(
    { length: depth + 1 },
    () => [],
  )
  for (const node of nodes) groups[column.get(node.id) ?? 0]?.push(node)
  // Busiest first, so the left column reads top-down by how much actually
  // moves through each deployment. Id breaks ties, keeping the drawing
  // independent of the order the graph arrived in.
  return groups.map((g) => g.toSorted(byVolumeThenId))
}

/**
 * Tidy-tree positions on the axis perpendicular to the direction of backing.
 * Leaves are stacked in the order their backers appear, and every backer's
 * children stay contiguous so connections do not cut across unrelated nodes.
 */
function stackWithinLayers(
  columns: InteropTokenRelationsNode[][],
  edges: InteropTokenRelationsEdge[],
  nodeSize: (node: InteropTokenRelationsNode) => number,
  parentAlignment: 'start' | 'center',
): Map<string, number> {
  const columnOf = new Map<string, number>()
  const sizeOf = new Map<string, number>()
  columns.forEach((column, index) => {
    for (const node of column) {
      columnOf.set(node.id, index)
      sizeOf.set(node.id, nodeSize(node))
    }
  })

  // A spanning forest: a node with several backers is drawn beside the first,
  // and the remaining connections are simply extra lines.
  const children = new Map<string, string[]>()
  const claimed = new Set<string>()
  const sorted = edges
    .filter((edge) => edge.kind === 'backs')
    .toSorted(
      (a, b) => a.from.localeCompare(b.from) || a.to.localeCompare(b.to),
    )
  for (const edge of sorted) {
    if (claimed.has(edge.to)) continue
    if ((columnOf.get(edge.to) ?? 0) !== (columnOf.get(edge.from) ?? 0) + 1) {
      continue
    }
    claimed.add(edge.to)
    children.set(edge.from, [...(children.get(edge.from) ?? []), edge.to])
  }

  const volumeOf = new Map(columns.flat().map((node) => [node.id, node.volume]))
  for (const [parent, kids] of children) {
    // Within one backer's block, busiest first — the same rule as the roots.
    children.set(
      parent,
      kids.toSorted((a, b) =>
        byVolumeThenId(
          { id: a, volume: volumeOf.get(a) ?? null },
          { id: b, volume: volumeOf.get(b) ?? null },
        ),
      ),
    )
  }

  const position = new Map<string, number>()
  let cursor = 0
  const place = (id: string): void => {
    const kids = children.get(id) ?? []
    if (kids.length === 0) {
      position.set(id, cursor)
      cursor += (sizeOf.get(id) ?? NODE_HEIGHT) + STACK_GAP
      return
    }
    for (const kid of kids) place(kid)
    const first = kids[0] as string
    if (parentAlignment === 'start') {
      // Top-aligned with its first child rather than centred against the block:
      // a backer of twenty nodes would otherwise sit ten rows down, so the
      // busiest thing in a vertical column would never be the first thing seen.
      position.set(id, position.get(first) ?? 0)
    } else {
      const last = kids.at(-1) as string
      const firstCenter =
        (position.get(first) ?? 0) + (sizeOf.get(first) ?? NODE_WIDTH) / 2
      const lastCenter =
        (position.get(last) ?? 0) + (sizeOf.get(last) ?? NODE_WIDTH) / 2
      position.set(
        id,
        (firstCenter + lastCenter) / 2 - (sizeOf.get(id) ?? NODE_WIDTH) / 2,
      )
    }
  }

  // Roots first, then anything a spanning-forest edge never reached (a node
  // whose only backers sit more than one column to its left).
  for (const node of columns[0] ?? []) place(node.id)
  for (const column of columns) {
    for (const node of column) {
      if (!position.has(node.id)) place(node.id)
    }
  }

  // Centring a backer can pull it before its neighbour; a single sweep per
  // layer restores the gap without reordering.
  for (const column of columns) {
    const ordered = column.toSorted(
      (a, b) =>
        (position.get(a.id) ?? 0) - (position.get(b.id) ?? 0) ||
        a.id.localeCompare(b.id),
    )
    let minimum = Number.NEGATIVE_INFINITY
    for (const node of ordered) {
      const next = Math.max(position.get(node.id) ?? 0, minimum)
      position.set(node.id, next)
      minimum = next + (sizeOf.get(node.id) ?? NODE_HEIGHT) + STACK_GAP
    }
  }

  if (parentAlignment === 'center') {
    alignParentsWithAllChildren(columns, edges, columnOf, sizeOf, position)
  }

  const smallest = Math.min(0, ...position.values())
  for (const [id, value] of position) position.set(id, value - smallest)
  return position
}

/**
 * The spanning forest above gives every child one primary parent, which keeps
 * subtrees contiguous. A shared child can still leave another parent stranded
 * at the far end of its layer, though, producing an edge across the whole
 * diagram. In the wide layout, move each parent toward the centre of all its
 * immediate children, including the non-primary ones, then repack the layer.
 */
function alignParentsWithAllChildren(
  columns: InteropTokenRelationsNode[][],
  edges: InteropTokenRelationsEdge[],
  columnOf: ReadonlyMap<string, number>,
  sizeOf: ReadonlyMap<string, number>,
  position: Map<string, number>,
): void {
  const children = new Map<string, string[]>()
  for (const edge of edges) {
    const parentColumn = columnOf.get(edge.from)
    if (parentColumn === undefined) continue
    if (columnOf.get(edge.to) !== parentColumn + 1) continue
    children.set(edge.from, [...(children.get(edge.from) ?? []), edge.to])
  }

  for (let columnIndex = columns.length - 2; columnIndex >= 0; columnIndex--) {
    const desired = new Map<string, number>()
    for (const node of columns[columnIndex] ?? []) {
      const kids = children.get(node.id) ?? []
      if (kids.length === 0) {
        desired.set(node.id, position.get(node.id) ?? 0)
        continue
      }
      const childrenCenter =
        kids.reduce(
          (sum, id) =>
            sum + (position.get(id) ?? 0) + (sizeOf.get(id) ?? NODE_WIDTH) / 2,
          0,
        ) / kids.length
      desired.set(
        node.id,
        childrenCenter - (sizeOf.get(node.id) ?? NODE_WIDTH) / 2,
      )
    }

    const ordered = (columns[columnIndex] ?? []).toSorted(
      (a, b) =>
        (desired.get(a.id) ?? 0) - (desired.get(b.id) ?? 0) ||
        a.id.localeCompare(b.id),
    )
    let minimum = Number.NEGATIVE_INFINITY
    for (const node of ordered) {
      const next = Math.max(desired.get(node.id) ?? 0, minimum)
      position.set(node.id, next)
      minimum = next + (sizeOf.get(node.id) ?? NODE_WIDTH) + STACK_GAP
    }
  }
}
