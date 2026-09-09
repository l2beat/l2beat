import { layoutRelationsGraph } from '~/components/projects/sections/interop/onchain-deployments/relations-graph/layoutRelationsGraph'
import { getRelationsNodeSize } from '~/components/projects/sections/interop/onchain-deployments/relations-graph/nodeSize'
import type {
  TokenGraphTile,
  TokenGraphTileEdge,
  TokenGraphTileNode,
} from '~/server/features/tokens/buildTokenGraphTiles'

export const VIEW_WIDTH = 320
export const VIEW_HEIGHT = 132
export const X_PADDING = 12
export const Y_PADDING = 14
export const BASE_RADIUS = 6
export const SOURCE_RING_GAP = 3
export const LINE_GAP = 0.5
export const MAX_CLUSTER_ICONS = 5
const MIN_GAP = 3

/** Sizing by node count; scale is the desired one before width/height caps. */
const LARGE_GRAPH = {
  maxNodes: Number.POSITIVE_INFINITY,
  scale: 1,
  span: VIEW_HEIGHT - Y_PADDING * 2,
  maxGap: 16,
}
const SIZE_BUCKETS = [
  { maxNodes: 1, scale: 3, span: 82, maxGap: 40 },
  { maxNodes: 3, scale: 2.3, span: 82, maxGap: 40 },
  { maxNodes: 5, scale: 1.8, span: 84, maxGap: 30 },
  { maxNodes: 8, scale: 1.45, span: 90, maxGap: 16 },
  { maxNodes: 12, scale: 1.18, span: 96, maxGap: 16 },
  LARGE_GRAPH,
]

function getSizeBucket(nodeCount: number) {
  return (
    SIZE_BUCKETS.find((bucket) => nodeCount <= bucket.maxNodes) ?? LARGE_GRAPH
  )
}

export interface Mark {
  node: TokenGraphTileNode
  x: number
  y: number
  radius: number
  halfWidth: number
  row: number
  isSource: boolean
}

export function buildPreview(graph: TokenGraphTile['graph']): {
  marks: Mark[]
  path: string
  scale: number
} {
  const { nodes, edges } = graph
  const backed = new Set(edges.map((edge) => edge.to))
  const sourceIds = new Set(
    edges.map((edge) => edge.from).filter((id) => !backed.has(id)),
  )

  const rows = getRows(graph)

  const scale = getScale(nodes.length, rows, sourceIds)
  const radius = BASE_RADIUS * scale
  const rowHalfHeights = rows.map((row) =>
    getRowHalfHeight(row, radius, sourceIds),
  )
  const rowYs = getRowCenters(
    rowHalfHeights,
    getVerticalSpan(nodes.length, rows.length),
  )

  const marks = new Map<string, Mark>()
  rows.forEach((row, rowIndex) => {
    const halfWidths = row.map((node) => getHalfWidth(node, radius))
    const xs = placeRow(halfWidths, nodes.length)
    row.forEach((node, index) => {
      marks.set(node.id, {
        node,
        x: xs[index] ?? VIEW_WIDTH / 2,
        y: rowYs[rowIndex] ?? VIEW_HEIGHT / 2,
        radius,
        halfWidth: halfWidths[index] ?? radius,
        row: rowIndex,
        isSource: sourceIds.has(node.id),
      })
    })
  })

  return {
    marks: [...marks.values()],
    path: buildPaths(edges, marks).join(' '),
    scale,
  }
}

/** The same rows the full graph shows: real card sizes, so wrapping matches. */
function getRows({ nodes, edges }: TokenGraphTile['graph']) {
  const layout = layoutRelationsGraph(
    nodes.map((node) => ({
      id: node.id,
      volume: node.volume,
      ...getRelationsNodeSize(node.chains.length),
    })),
    edges,
  )
  const x = (node: TokenGraphTileNode) => layout.boxes.get(node.id)?.x ?? 0
  return [...Map.groupBy(nodes, (node) => layout.rowOf.get(node.id) ?? 0)]
    .toSorted(([a], [b]) => a - b)
    .map(([, row]) => row.toSorted((a, b) => x(a) - x(b)))
}

function getScale(
  nodeCount: number,
  rows: TokenGraphTileNode[][],
  sourceIds: ReadonlySet<string>,
): number {
  const desired = getSizeBucket(nodeCount).scale
  const widthCaps = rows.map((row) => {
    const width = row.reduce(
      (sum, node) => sum + getHalfWidth(node, BASE_RADIUS) * 2,
      0,
    )
    const gaps = Math.max(0, row.length - 1) * MIN_GAP
    return width === 0 ? desired : (VIEW_WIDTH - X_PADDING * 2 - gaps) / width
  })
  const height = rows.reduce(
    (sum, row) => sum + getRowHalfHeight(row, BASE_RADIUS, sourceIds) * 2,
    0,
  )
  const heightCap =
    height === 0
      ? desired
      : (VIEW_HEIGHT - Y_PADDING * 2 - Math.max(0, rows.length - 1) * MIN_GAP) /
        height
  return Math.min(desired, ...widthCaps, heightCap)
}

function getRowHalfHeight(
  row: TokenGraphTileNode[],
  radius: number,
  sourceIds: ReadonlySet<string>,
): number {
  const ringGap = (SOURCE_RING_GAP / BASE_RADIUS) * radius
  return radius + (row.some((node) => sourceIds.has(node.id)) ? ringGap : 0)
}

function getVerticalSpan(nodeCount: number, rowCount: number): number {
  if (rowCount <= 1) return 0
  if (rowCount === 2 && nodeCount <= 8) return 58
  return getSizeBucket(nodeCount).span
}

function getRowCenters(halfHeights: number[], span: number): number[] {
  if (halfHeights.length <= 1) return [VIEW_HEIGHT / 2]
  const occupied = halfHeights
    .slice(1)
    .reduce(
      (sum, halfHeight, index) => sum + (halfHeights[index] ?? 0) + halfHeight,
      0,
    )
  const gap = Math.max(0, (span - occupied) / (halfHeights.length - 1))
  const centers = [
    (VIEW_HEIGHT - occupied - gap * (halfHeights.length - 1)) / 2,
  ]
  for (let index = 1; index < halfHeights.length; index++) {
    centers.push(
      (centers[index - 1] ?? 0) +
        (halfHeights[index - 1] ?? 0) +
        gap +
        (halfHeights[index] ?? 0),
    )
  }
  return centers
}

function placeRow(halfWidths: number[], nodeCount: number): number[] {
  if (halfWidths.length === 0) return []
  const available = VIEW_WIDTH - X_PADDING * 2
  const total = halfWidths.reduce((sum, halfWidth) => sum + halfWidth * 2, 0)
  const maxGap = getSizeBucket(nodeCount).maxGap
  const gap =
    halfWidths.length > 1
      ? Math.max(
          2,
          Math.min(maxGap, (available - total) / (halfWidths.length - 1)),
        )
      : 0
  let x = (VIEW_WIDTH - total - gap * (halfWidths.length - 1)) / 2
  return halfWidths.map((halfWidth) => {
    const centre = x + halfWidth
    x += halfWidth * 2 + gap
    return centre
  })
}

interface RowGroup {
  row: number
  busY: number
  targets: Mark[]
}

/** Source drops to a bus above each backed row; deeper rows go via a side lane. */
function buildPaths(
  edges: TokenGraphTileEdge[],
  marks: ReadonlyMap<string, Mark>,
): string[] {
  const outgoing = Map.groupBy(
    edges.flatMap((edge) => {
      const target = marks.get(edge.to)
      return target ? [{ from: edge.from, target }] : []
    }),
    (edge) => edge.from,
  )

  const paths: string[] = []
  const sourceIds = [...outgoing.keys()].toSorted()
  sourceIds.forEach((sourceId, lane) => {
    const from = marks.get(sourceId)
    if (!from) return
    const startY = from.y + from.radius + LINE_GAP

    const targets = (outgoing.get(sourceId) ?? []).map((edge) => edge.target)
    const groups: RowGroup[] = [...Map.groupBy(targets, (target) => target.row)]
      .toSorted(([a], [b]) => a - b)
      .map(([row, targets]) => {
        const targetY = Math.min(
          ...targets.map((target) => target.y - target.radius - LINE_GAP),
        )
        const available = Math.max(0, targetY - startY)
        const clearance = Math.max(3, Math.min(6, available * 0.3))
        return {
          row,
          busY: available > 5 ? targetY - clearance : startY + available / 2,
          targets,
        }
      })

    const adjacent = groups.find((group) => group.row === from.row + 1)
    const deep = groups.filter((group) => group !== adjacent)
    if (adjacent) paths.push(`M ${from.x} ${startY} V ${adjacent.busY}`)

    let laneX: number | undefined
    if (deep.length > 0) {
      laneX = getSideLane(from, deep, marks, lane)
      const firstBusY = Math.min(...deep.map((group) => group.busY))
      const deepestBusY = Math.max(...deep.map((group) => group.busY))
      const limit = adjacent ? Math.min(adjacent.busY, firstBusY) : firstBusY
      const departureY =
        startY + Math.max(1.5, Math.min(4, Math.max(0, limit - startY) / 2))
      paths.push(
        adjacent
          ? `M ${from.x} ${departureY} H ${laneX} V ${deepestBusY}`
          : `M ${from.x} ${startY} V ${departureY} H ${laneX} V ${deepestBusY}`,
      )
    }

    for (const group of groups) {
      const anchorX = group === adjacent ? from.x : laneX
      if (anchorX === undefined) continue
      const xs = [anchorX, ...group.targets.map((target) => target.x)]
      const minX = Math.min(...xs)
      const maxX = Math.max(...xs)
      if (maxX - minX > 0.5) paths.push(`M ${minX} ${group.busY} H ${maxX}`)
      for (const target of group.targets) {
        const endY = target.y - target.radius - LINE_GAP
        paths.push(`M ${target.x} ${group.busY} V ${endY}`)
      }
    }
  })
  return paths
}

function getSideLane(
  from: Mark,
  groups: RowGroup[],
  marks: ReadonlyMap<string, Mark>,
  lane: number,
): number {
  const deepestRow = Math.max(...groups.map((group) => group.row))
  const passed = [...marks.values()].filter(
    (mark) => mark.row > from.row && mark.row <= deepestRow,
  )
  const leftEdge = Math.min(
    from.x - from.halfWidth,
    ...passed.map((mark) => mark.x - mark.halfWidth),
  )
  const rightEdge = Math.max(
    from.x + from.halfWidth,
    ...passed.map((mark) => mark.x + mark.halfWidth),
  )
  const laneGap = 7 + lane * 1.5
  const left = Math.max(3, leftEdge - laneGap)
  const right = Math.min(VIEW_WIDTH - 3, rightEdge + laneGap)
  const targetXs = groups.flatMap((group) =>
    group.targets.map((target) => target.x),
  )
  const targetCentre =
    targetXs.reduce((sum, x) => sum + x, 0) / Math.max(1, targetXs.length)
  const leftDistance = Math.abs(from.x - left) + Math.abs(targetCentre - left)
  const rightDistance =
    Math.abs(from.x - right) + Math.abs(targetCentre - right)
  return leftDistance <= rightDistance ? left : right
}

interface ClusterMetrics {
  width: number
  contentWidth: number
  iconDiameter: number
  iconStep: number
  countWidth: number
}

export function getClusterMetrics(
  node: TokenGraphTileNode,
  radius: number,
): ClusterMetrics {
  const scale = radius / BASE_RADIUS
  const shown = Math.min(MAX_CLUSTER_ICONS, node.chains.length)
  const remaining = node.chains.length - shown
  const iconDiameter = 8.5 * scale
  const iconStep = 6.5 * scale
  const iconsWidth = iconDiameter + (shown - 1) * iconStep
  const countWidth =
    remaining > 0 ? (String(remaining).length * 4 + 5) * scale : 0
  const contentWidth = iconsWidth + (remaining > 0 ? 3 * scale : 0) + countWidth
  return {
    width: contentWidth + 10 * scale,
    contentWidth,
    iconDiameter,
    iconStep,
    countWidth,
  }
}

function getHalfWidth(node: TokenGraphTileNode, radius: number): number {
  return node.chains.length > 1
    ? getClusterMetrics(node, radius).width / 2
    : radius
}
