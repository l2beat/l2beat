export interface RelationNode {
  id: string
  volume?: number | null
}

export interface LayoutNode extends RelationNode {
  volume: number | null
  width: number
  height: number
}

export interface LayoutEdge {
  /** `from` backs `to`. */
  from: string
  to: string
}

export interface NodeBox {
  x: number
  y: number
  width: number
  height: number
}

export interface RelationsLayout {
  boxes: Map<string, NodeBox>
  rowOf: Map<string, number>
  width: number
  height: number
  /** Y of the separator above the unconnected nodes, if any. */
  unconnectedDividerY: number | undefined
}

const SIDE_LANE_WIDTH = 72
const MIN_WORLD_WIDTH = 920
const MAX_WORLD_WIDTH = 1760
const NODE_GAP = 24
const ROW_GAP = 112

/**
 * Rows of nodes by backing depth, widest layers wrapped onto several rows so a
 * busy token stays readable. Children follow their parent's order, busiest
 * first within each sibling group. Groups stay together when they fit a row.
 */
export function layoutRelationsGraph(
  nodes: LayoutNode[],
  edges: LayoutEdge[],
  unconnected: LayoutNode[] = [],
): RelationsLayout {
  const { layers, primaryParent } = analyzeLayers(nodes, edges)

  const widestLayer = Math.max(0, ...layers.map(rowWidth))
  const width = Math.min(
    MAX_WORLD_WIDTH,
    Math.max(MIN_WORLD_WIDTH, widestLayer + SIDE_LANE_WIDTH * 2),
  )
  const usableWidth = width - SIDE_LANE_WIDTH * 2

  const boxes = new Map<string, NodeBox>()
  const rowOf = new Map<string, number>()
  let y = 0
  let row = 0
  const placeRows = (rows: LayoutNode[][]) => {
    for (const nodes of rows) {
      let x = SIDE_LANE_WIDTH + (usableWidth - rowWidth(nodes)) / 2
      for (const node of nodes) {
        boxes.set(node.id, { x, y, width: node.width, height: node.height })
        rowOf.set(node.id, row)
        x += node.width + NODE_GAP
      }
      y += Math.max(0, ...nodes.map((node) => node.height)) + ROW_GAP
      row++
    }
  }

  for (const layer of layers) {
    placeRows(
      packRows(layer, usableWidth, (node) => primaryParent.get(node.id)),
    )
  }

  let unconnectedDividerY: number | undefined
  if (unconnected.length > 0) {
    if (row > 0) unconnectedDividerY = y - ROW_GAP / 2
    placeRows(packRows(unconnected.toSorted(byVolumeThenId), usableWidth))
  }

  return {
    boxes,
    rowOf,
    width,
    height: Math.max(1, y - ROW_GAP),
    unconnectedDividerY,
  }
}

/** Nodes by backing depth, each layer in display order, without wrapping. */
export function orderRelationLayers<T extends RelationNode>(
  nodes: T[],
  edges: LayoutEdge[],
): T[][] {
  return analyzeLayers(nodes, edges).layers
}

function analyzeLayers<T extends RelationNode>(
  nodes: T[],
  edges: LayoutEdge[],
) {
  const layers = assignLayers(nodes, edges)
  const layerOf = new Map(
    layers.flatMap((layer, index) => layer.map((node) => [node.id, index])),
  )
  const primaryParent = getPrimaryParents(edges, layerOf)
  return { layers: orderLayers(layers, primaryParent), primaryParent }
}

/** Busiest first; unmeasured volume sorts after zero. */
function byVolumeThenId(a: RelationNode, b: RelationNode): number {
  return (b.volume ?? -1) - (a.volume ?? -1) || a.id.localeCompare(b.id)
}

/** Longest backing path from an unbacked node is the node's layer. */
function assignLayers<T extends RelationNode>(
  nodes: T[],
  edges: LayoutEdge[],
): T[][] {
  const ids = new Set(nodes.map((node) => node.id))
  const outgoing = new Map<string, string[]>()
  const remaining = new Map(nodes.map((node) => [node.id, 0]))
  for (const edge of edges) {
    if (!ids.has(edge.from) || !ids.has(edge.to)) continue
    outgoing.set(edge.from, [...(outgoing.get(edge.from) ?? []), edge.to])
    remaining.set(edge.to, (remaining.get(edge.to) ?? 0) + 1)
  }

  const layer = new Map(nodes.map((node) => [node.id, 0]))
  const queue = nodes
    .filter((node) => remaining.get(node.id) === 0)
    .map((node) => node.id)
  for (const id of queue) {
    for (const next of outgoing.get(id) ?? []) {
      layer.set(next, Math.max(layer.get(next) ?? 0, (layer.get(id) ?? 0) + 1))
      remaining.set(next, (remaining.get(next) ?? 0) - 1)
      if (remaining.get(next) === 0) queue.push(next)
    }
  }
  // Nodes on a cycle never reach the queue; keep them drawable in layer 0.

  const layers: T[][] = []
  for (const node of nodes) {
    const index = layer.get(node.id) ?? 0
    layers[index] = [...(layers[index] ?? []), node]
  }
  return layers
}

/** The first backer one layer up claims the child; other backers are extra lines. */
function getPrimaryParents(
  edges: LayoutEdge[],
  layerOf: ReadonlyMap<string, number>,
): Map<string, string> {
  const result = new Map<string, string>()
  for (const edge of edges.toSorted(
    (a, b) => a.from.localeCompare(b.from) || a.to.localeCompare(b.to),
  )) {
    if (result.has(edge.to)) continue
    if (layerOf.get(edge.to) !== (layerOf.get(edge.from) ?? 0) + 1) continue
    result.set(edge.to, edge.from)
  }
  return result
}

/** Order roots by volume, then each layer by parent order and sibling volume. */
function orderLayers<T extends RelationNode>(
  layers: T[][],
  primaryParent: ReadonlyMap<string, string>,
): T[][] {
  const order = new Map<string, number>()
  const parentOrder = (node: RelationNode) => {
    const parent = primaryParent.get(node.id)
    return parent === undefined ? -1 : (order.get(parent) ?? -1)
  }

  return layers.map((layer) => {
    const ordered = layer.toSorted(
      (a, b) => parentOrder(a) - parentOrder(b) || byVolumeThenId(a, b),
    )
    ordered.forEach((node, index) => order.set(node.id, index))
    return ordered
  })
}

/** Rows never split a backer's block unless the block alone is wider than a row. */
function packRows(
  nodes: LayoutNode[],
  available: number,
  groupOf: (node: LayoutNode) => string | undefined = () => undefined,
): LayoutNode[][] {
  const blocks: LayoutNode[][] = []
  for (const node of nodes) {
    const previous = blocks.at(-1)
    const group = groupOf(node)
    if (
      previous &&
      group !== undefined &&
      groupOf(previous[0] as LayoutNode) === group
    ) {
      previous.push(node)
    } else {
      blocks.push([node])
    }
  }

  const rows: LayoutNode[][] = []
  let row: LayoutNode[] = []
  const flush = () => {
    if (row.length > 0) rows.push(row)
    row = []
  }
  const fits = (nodes: LayoutNode[]) =>
    rowWidth([...row, ...nodes]) <= available
  for (const block of blocks) {
    if (rowWidth(block) <= available) {
      if (!fits(block)) flush()
      row.push(...block)
      continue
    }
    flush()
    for (const node of block) {
      if (row.length > 0 && !fits([node])) flush()
      row.push(node)
    }
    flush()
  }
  flush()
  return rows
}

function rowWidth(nodes: LayoutNode[]): number {
  return nodes.reduce(
    (sum, node, index) => sum + node.width + (index > 0 ? NODE_GAP : 0),
    0,
  )
}
