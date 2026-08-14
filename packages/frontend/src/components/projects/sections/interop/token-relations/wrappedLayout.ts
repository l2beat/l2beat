import type {
  InteropTokenRelationsEdge,
  InteropTokenRelationsNode,
} from '~/server/features/scaling/interop/token/getInteropTokenRelationsGraph'
import { layoutRelationsGraph, type NodeBox } from './layout'

const MAX_WORLD_WIDTH = 1760
const MIN_WORLD_WIDTH = 920
const SIDE_LANE_WIDTH = 72
const NODE_GAP = 24
const ROW_GAP = 112
const BUS_OFFSET = 44

export interface WrappedRelationsLayout {
  boxes: Map<string, NodeBox>
  /** The rendered row, including rows created by wrapping one logical layer. */
  rowOf: Map<string, number>
  /** The backing depth before wrapping. */
  layerOf: Map<string, number>
  width: number
  height: number
  /** Y of the separator above deployments with no observed relations. */
  unconnectedDividerY: number | undefined
}

export interface WrappedEdgeGeometry {
  path: string
  midX: number
  midY: number
}

export interface WrappedSourceLane {
  side: 'left' | 'right'
  index: number
}

/**
 * Starts with the same tidy-tree order as the regular top-to-bottom layout,
 * but wraps wide layers into multiple rows. This keeps cards readable without
 * turning a busy token such as USDC into a several-thousand-pixel-wide strip.
 */
export function layoutWrappedRelationsGraph(
  nodes: InteropTokenRelationsNode[],
  edges: InteropTokenRelationsEdge[],
  unconnectedNodeIds: string[],
  heightOverrides?: ReadonlyMap<string, number>,
  widthOverrides?: ReadonlyMap<string, number>,
): WrappedRelationsLayout {
  const nodeHeight = (node: InteropTokenRelationsNode) =>
    heightOverrides?.get(node.id) ?? 64
  const nodeWidth = (node: InteropTokenRelationsNode) =>
    widthOverrides?.get(node.id) ?? 168

  const unconnected = new Set(unconnectedNodeIds)
  const connected = nodes.filter((node) => !unconnected.has(node.id))
  const loose = nodes.filter((node) => unconnected.has(node.id))
  const connectedIds = new Set(connected.map((node) => node.id))
  const connectedEdges = edges.filter(
    (edge) => connectedIds.has(edge.from) && connectedIds.has(edge.to),
  )

  const baseline = layoutRelationsGraph(
    connected,
    connectedEdges,
    [],
    heightOverrides,
    'top-to-bottom',
    widthOverrides,
  )
  const width = Math.max(
    MIN_WORLD_WIDTH,
    Math.min(MAX_WORLD_WIDTH, baseline.width + SIDE_LANE_WIDTH * 2),
  )
  const usableWidth = width - SIDE_LANE_WIDTH * 2
  const layers = new Map<number, InteropTokenRelationsNode[]>()
  for (const node of connected) {
    const layer = baseline.columnOf.get(node.id) ?? 0
    layers.set(layer, [...(layers.get(layer) ?? []), node])
  }

  const boxes = new Map<string, NodeBox>()
  const rowOf = new Map<string, number>()
  const layerOf = new Map(baseline.columnOf)
  const primaryParentOf = getPrimaryParentOf(connectedEdges, layerOf)
  let y = 0
  let visualRow = 0

  const placeRows = (rows: InteropTokenRelationsNode[][]) => {
    for (const row of rows) {
      const rowWidth = row.reduce(
        (sum, node, index) =>
          sum + nodeWidth(node) + (index > 0 ? NODE_GAP : 0),
        0,
      )
      let x = SIDE_LANE_WIDTH + (usableWidth - rowWidth) / 2
      const rowHeight = Math.max(0, ...row.map(nodeHeight))
      for (const node of row) {
        const width = nodeWidth(node)
        boxes.set(node.id, {
          x,
          y,
          width,
          height: nodeHeight(node),
        })
        rowOf.set(node.id, visualRow)
        x += width + NODE_GAP
      }
      y += rowHeight + ROW_GAP
      visualRow++
    }
  }

  const logicalLayers = [...layers.keys()].toSorted((a, b) => a - b)
  for (const logicalLayer of logicalLayers) {
    const ordered = (layers.get(logicalLayer) ?? []).toSorted(
      (a, b) =>
        (baseline.boxes.get(a.id)?.x ?? 0) -
          (baseline.boxes.get(b.id)?.x ?? 0) || a.id.localeCompare(b.id),
    )
    placeRows(
      packRows(
        ordered,
        usableWidth,
        nodeWidth,
        (node) => primaryParentOf.get(node.id) ?? node.id,
      ),
    )
  }

  let unconnectedDividerY: number | undefined
  if (loose.length > 0) {
    if (visualRow > 0) unconnectedDividerY = y - ROW_GAP / 2
    const ordered = loose.toSorted(byVolumeThenId)
    placeRows(packRows(ordered, usableWidth, nodeWidth))
  }

  return {
    boxes,
    rowOf,
    layerOf,
    width,
    height: Math.max(1, y - ROW_GAP),
    unconnectedDividerY,
  }
}

function packRows(
  nodes: InteropTokenRelationsNode[],
  available: number,
  nodeWidth: (node: InteropTokenRelationsNode) => number,
  groupOf?: (node: InteropTokenRelationsNode) => string,
): InteropTokenRelationsNode[][] {
  const groups: InteropTokenRelationsNode[][] = []
  for (const node of nodes) {
    const previous = groups.at(-1)
    if (
      previous &&
      groupOf &&
      groupOf(previous[0] as InteropTokenRelationsNode) === groupOf(node)
    ) {
      previous.push(node)
    } else {
      groups.push([node])
    }
  }

  const rows: InteropTokenRelationsNode[][] = []
  let row: InteropTokenRelationsNode[] = []
  let used = 0

  const flush = () => {
    if (row.length > 0) rows.push(row)
    row = []
    used = 0
  }
  const append = (node: InteropTokenRelationsNode) => {
    used += (row.length > 0 ? NODE_GAP : 0) + nodeWidth(node)
    row.push(node)
  }

  for (const group of groups) {
    const groupWidth = group.reduce(
      (sum, node, index) => sum + nodeWidth(node) + (index > 0 ? NODE_GAP : 0),
      0,
    )
    const next = used + (row.length > 0 ? NODE_GAP : 0) + groupWidth

    // Siblings form one visual bus. When the whole block fits on a row, never
    // split it at the wrap boundary: doing so makes the parent's route cross
    // unrelated destinations left behind on the previous row.
    if (groupWidth <= available) {
      if (row.length > 0 && next > available) flush()
      for (const node of group) append(node)
      continue
    }

    // An exceptionally large sibling block has to wrap, but starts on a fresh
    // row so no unrelated block is mixed into its continuation.
    flush()
    for (const node of group) {
      const width = nodeWidth(node)
      const nextNode = used + (row.length > 0 ? NODE_GAP : 0) + width
      if (row.length > 0 && nextNode > available) flush()
      append(node)
    }
    flush()
  }
  flush()
  return rows
}

function getPrimaryParentOf(
  edges: InteropTokenRelationsEdge[],
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

function byVolumeThenId(
  a: InteropTokenRelationsNode,
  b: InteropTokenRelationsNode,
): number {
  return (b.volume ?? -1) - (a.volume ?? -1) || a.id.localeCompare(b.id)
}

export function getWrappedTargetPorts(
  edges: InteropTokenRelationsEdge[],
  boxes: ReadonlyMap<string, NodeBox>,
): Map<string, number> {
  const incoming = new Map<string, InteropTokenRelationsEdge[]>()
  for (const edge of edges) {
    incoming.set(edge.to, [...(incoming.get(edge.to) ?? []), edge])
  }
  const result = new Map<string, number>()
  for (const group of incoming.values()) {
    const ordered = group.toSorted(
      (a, b) =>
        (boxes.get(a.from)?.x ?? 0) - (boxes.get(b.from)?.x ?? 0) ||
        a.from.localeCompare(b.from),
    )
    ordered.forEach((edge, index) =>
      result.set(wrappedEdgeKey(edge), (index + 1) / (ordered.length + 1)),
    )
  }
  return result
}

export function getWrappedSourceLanes(
  edges: InteropTokenRelationsEdge[],
  boxes: ReadonlyMap<string, NodeBox>,
  worldWidth: number,
): Map<string, WrappedSourceLane> {
  const sourceIds = [...new Set(edges.map((edge) => edge.from))].toSorted()
  const countBySide = { left: 0, right: 0 }
  return new Map(
    sourceIds.map((sourceId) => {
      const source = boxes.get(sourceId)
      const sourceX = source ? source.x + source.width / 2 : 0
      const side: WrappedSourceLane['side'] =
        sourceX <= worldWidth / 2 ? 'left' : 'right'
      const lane = { side, index: countBySide[side] }
      countBySide[side]++
      return [sourceId, lane] as const
    }),
  )
}

export function getWrappedEdgeGeometry({
  from,
  to,
  sourceRow,
  targetRow,
  targetPort,
  sourceLane,
  worldWidth,
}: {
  from: NodeBox
  to: NodeBox
  sourceRow: number
  targetRow: number
  targetPort: number
  sourceLane: WrappedSourceLane
  worldWidth: number
}): WrappedEdgeGeometry {
  const startX = from.x + from.width / 2
  const startY = from.y + from.height
  const endX = to.x + to.width * targetPort
  const endY = to.y
  const busY = endY - BUS_OFFSET

  if (targetRow === sourceRow + 1) {
    return {
      path: `M ${startX} ${startY} V ${busY} H ${endX} V ${endY}`,
      midX: endX,
      midY: busY,
    }
  }

  // A wrapped row may have other cards between it and its parent. Reach its
  // bus through a narrow side lane so the trunk never cuts through those cards.
  const laneOffset = sourceLane.index * 6
  const laneX =
    sourceLane.side === 'left' ? 22 + laneOffset : worldWidth - 22 - laneOffset
  const departureY = startY + Math.min(28, (busY - startY) / 2)
  return {
    path: `M ${startX} ${startY} V ${departureY} H ${laneX} V ${busY} H ${endX} V ${endY}`,
    midX: endX,
    midY: busY,
  }
}

export function wrappedEdgeKey(edge: InteropTokenRelationsEdge): string {
  return `${edge.from}->${edge.to}-${edge.kind}`
}
