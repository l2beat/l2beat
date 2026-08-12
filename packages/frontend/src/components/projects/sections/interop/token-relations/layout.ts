import type {
  InteropTokenRelationsEdge,
  InteropTokenRelationsNode,
} from '~/server/features/scaling/interop/token/getInteropTokenRelationsGraph'

/**
 * Places the nodes of a token relations graph. Backing runs left to right: a
 * node sits one column right of everything that backs it, so reading rightwards
 * is reading "…is backed by the column to its left".
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
/** Between stacked nodes inside one column. */
const STACK_GAP = 24
/** Between one column and the next, leaving room for the connections. */
const COLUMN_GAP = 148
const UNCONNECTED_GAP = 96

export interface NodeBox {
  x: number
  y: number
  width: number
  height: number
}

export interface RelationsLayout {
  boxes: Map<string, NodeBox>
  /** Which column each node landed in, so edges know how far they reach. */
  columnOf: Map<string, number>
  /** Left edge of each column, so captions can sit above them. */
  columnXs: number[]
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
): RelationsLayout {
  const nodeHeight = (node: InteropTokenRelationsNode) =>
    heightOverrides?.get(node.id) ??
    (node.deployments.length > 1 ? GROUP_NODE_HEIGHT : NODE_HEIGHT)

  const unconnected = new Set(unconnectedNodeIds)
  const connected = nodes.filter((node) => !unconnected.has(node.id))
  const loose = nodes.filter((node) => unconnected.has(node.id))

  const columns = assignColumnGroups(connected, edges)
  const columnOf = new Map<string, number>()
  columns.forEach((column, index) => {
    for (const node of column) columnOf.set(node.id, index)
  })

  const boxes = new Map<string, NodeBox>()
  const ys = stackWithinColumns(columns, edges, nodeHeight)

  let x = 0
  const columnXs: number[] = []
  for (const column of columns) {
    columnXs.push(x)
    for (const node of column) {
      boxes.set(node.id, {
        x,
        y: ys.get(node.id) ?? 0,
        width: NODE_WIDTH,
        height: nodeHeight(node),
      })
    }
    x += NODE_WIDTH + COLUMN_GAP
  }
  const dagWidth = columns.length > 0 ? x - COLUMN_GAP : 0
  const dagHeight = Math.max(
    0,
    ...[...boxes.values()].map((box) => box.y + box.height),
  )

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
    loose.forEach((node, index) => {
      const column = Math.floor(index / rowsNeeded)
      const row = index % rowsNeeded
      boxes.set(node.id, {
        x: startX + column * (NODE_WIDTH + STACK_GAP),
        y: row * (NODE_HEIGHT + STACK_GAP),
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
      })
    })
    const looseColumns = Math.ceil(loose.length / rowsNeeded)
    width = startX + looseColumns * NODE_WIDTH + (looseColumns - 1) * STACK_GAP
    height = Math.max(
      dagHeight,
      rowsNeeded * NODE_HEIGHT + (rowsNeeded - 1) * STACK_GAP,
    )
  }

  return { boxes, columnOf, columnXs, width, height, unconnectedDividerX }
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
 * Tidy-tree y positions. Leaves are stacked top to bottom in the order their
 * backers appear, and every backer sits level with the top of its own block of
 * children, so its connections fan out to a contiguous block to its right and
 * never pass over an unrelated node.
 */
function stackWithinColumns(
  columns: InteropTokenRelationsNode[][],
  edges: InteropTokenRelationsEdge[],
  nodeHeight: (node: InteropTokenRelationsNode) => number,
): Map<string, number> {
  const columnOf = new Map<string, number>()
  const heightOf = new Map<string, number>()
  columns.forEach((column, index) => {
    for (const node of column) {
      columnOf.set(node.id, index)
      heightOf.set(node.id, nodeHeight(node))
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

  const y = new Map<string, number>()
  let cursor = 0
  const place = (id: string): void => {
    const kids = children.get(id) ?? []
    if (kids.length === 0) {
      y.set(id, cursor)
      cursor += (heightOf.get(id) ?? NODE_HEIGHT) + STACK_GAP
      return
    }
    for (const kid of kids) place(kid)
    // Top-aligned with its first child rather than centred against the block:
    // a backer of twenty nodes would otherwise sit ten rows down, so the
    // busiest thing in a column would never be the first thing you see.
    y.set(id, y.get(kids[0] as string) ?? 0)
  }

  // Roots first, then anything a spanning-forest edge never reached (a node
  // whose only backers sit more than one column to its left).
  for (const node of columns[0] ?? []) place(node.id)
  for (const column of columns) {
    for (const node of column) {
      if (!y.has(node.id)) place(node.id)
    }
  }

  // Centring a backer can pull it above its upper neighbour; a single
  // top-to-bottom sweep per column restores the gap without reordering.
  for (const column of columns) {
    const ordered = column.toSorted(
      (a, b) =>
        (y.get(a.id) ?? 0) - (y.get(b.id) ?? 0) || a.id.localeCompare(b.id),
    )
    let minY = Number.NEGATIVE_INFINITY
    for (const node of ordered) {
      const next = Math.max(y.get(node.id) ?? 0, minY)
      y.set(node.id, next)
      minY = next + (heightOf.get(node.id) ?? NODE_HEIGHT) + STACK_GAP
    }
  }

  const smallest = Math.min(0, ...y.values())
  for (const [id, value] of y) y.set(id, value - smallest)
  return y
}
