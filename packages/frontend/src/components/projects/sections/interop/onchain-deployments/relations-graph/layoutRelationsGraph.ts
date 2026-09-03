export interface LayoutNode {
  id: string
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

export const SIDE_LANE_WIDTH = 72
const MIN_WORLD_WIDTH = 920
const MAX_WORLD_WIDTH = 1760
const NODE_GAP = 24
const ROW_GAP = 112

/**
 * Rows of nodes by backing depth, widest layers wrapped onto several rows so a
 * busy token stays readable. Within a layer nodes keep a tidy-tree order and a
 * backer's children are never split across a wrap.
 */
export function layoutRelationsGraph(
  nodes: LayoutNode[],
  edges: LayoutEdge[],
  unconnected: LayoutNode[] = [],
): RelationsLayout {
  const layers = assignLayers(nodes, edges)
  const layerOf = new Map(
    layers.flatMap((layer, index) => layer.map((node) => [node.id, index])),
  )
  const primaryParent = getPrimaryParents(edges, layerOf)
  const order = orderWithinLayers(layers, edges, primaryParent)

  const extent = Math.max(
    0,
    ...nodes.map((node) => (order.get(node.id) ?? 0) + node.width),
  )
  const width = Math.min(
    MAX_WORLD_WIDTH,
    Math.max(MIN_WORLD_WIDTH, extent + SIDE_LANE_WIDTH * 2),
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
    const ordered = layer.toSorted(
      (a, b) =>
        (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0) ||
        a.id.localeCompare(b.id),
    )
    placeRows(
      packRows(ordered, usableWidth, (node) => primaryParent.get(node.id)),
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

/** Busiest first; unmeasured volume sorts after zero. */
function byVolumeThenId(a: LayoutNode, b: LayoutNode): number {
  return (b.volume ?? -1) - (a.volume ?? -1) || a.id.localeCompare(b.id)
}

/** Longest backing path from an unbacked node is the node's layer. */
function assignLayers(
  nodes: LayoutNode[],
  edges: LayoutEdge[],
): LayoutNode[][] {
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

  const layers: LayoutNode[][] = []
  for (const node of nodes) {
    const index = layer.get(node.id) ?? 0
    layers[index] = [...(layers[index] ?? []), node]
  }
  return layers.map((nodes) => nodes.toSorted(byVolumeThenId))
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

/**
 * Tidy-tree x positions on an unbounded row, used only for ordering: each
 * backer's children are contiguous and the backer sits over their centre.
 */
function orderWithinLayers(
  layers: LayoutNode[][],
  edges: LayoutEdge[],
  primaryParent: ReadonlyMap<string, string>,
): Map<string, number> {
  const nodeOf = new Map(layers.flat().map((node) => [node.id, node]))
  const width = (id: string) => nodeOf.get(id)?.width ?? 0
  const layerOf = new Map(
    layers.flatMap((layer, index) => layer.map((node) => [node.id, index])),
  )

  const children = new Map<string, string[]>()
  for (const [child, parent] of primaryParent) {
    children.set(parent, [...(children.get(parent) ?? []), child])
  }
  for (const [parent, kids] of children) {
    children.set(
      parent,
      kids.toSorted((a, b) =>
        byVolumeThenId(
          nodeOf.get(a) as LayoutNode,
          nodeOf.get(b) as LayoutNode,
        ),
      ),
    )
  }

  const position = new Map<string, number>()
  const center = (id: string) => (position.get(id) ?? 0) + width(id) / 2
  let cursor = 0
  const place = (id: string): void => {
    const kids = children.get(id) ?? []
    if (kids.length === 0) {
      position.set(id, cursor)
      cursor += width(id) + NODE_GAP
      return
    }
    for (const kid of kids) place(kid)
    const middle =
      (center(kids[0] as string) + center(kids.at(-1) as string)) / 2
    position.set(id, middle - width(id) / 2)
  }
  for (const layer of layers) {
    for (const node of layer) {
      if (!position.has(node.id)) place(node.id)
    }
  }

  const repack = (layer: LayoutNode[], desired: (id: string) => number) => {
    let minimum = Number.NEGATIVE_INFINITY
    for (const node of layer.toSorted(
      (a, b) => desired(a.id) - desired(b.id) || a.id.localeCompare(b.id),
    )) {
      const next = Math.max(desired(node.id), minimum)
      position.set(node.id, next)
      minimum = next + node.width + NODE_GAP
    }
  }
  // Centring a backer can push it into its neighbour.
  for (const layer of layers) repack(layer, (id) => position.get(id) ?? 0)

  // A child with several backers leaves the non-primary ones stranded, so pull
  // every backer toward the centre of all its children, bottom layer up.
  const allChildren = new Map<string, string[]>()
  for (const edge of edges) {
    if (layerOf.get(edge.to) !== (layerOf.get(edge.from) ?? 0) + 1) continue
    allChildren.set(edge.from, [...(allChildren.get(edge.from) ?? []), edge.to])
  }
  for (let index = layers.length - 2; index >= 0; index--) {
    const desired = new Map(
      (layers[index] ?? []).map((node) => {
        const kids = allChildren.get(node.id) ?? []
        if (kids.length === 0) return [node.id, position.get(node.id) ?? 0]
        const mean = kids.reduce((sum, id) => sum + center(id), 0) / kids.length
        return [node.id, mean - node.width / 2]
      }),
    )
    repack(layers[index] ?? [], (id) => desired.get(id) ?? 0)
  }

  return position
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
