import { useMemo } from 'react'
import {
  getRelationsNodeHeight,
  getRelationsNodeWidth,
} from '~/components/projects/sections/interop/token-relations/RelationsNode'
import { layoutWrappedRelationsGraph } from '~/components/projects/sections/interop/token-relations/wrappedLayout'
import type {
  TokenGraphTileGraph,
  TokenGraphTileNode,
} from '~/server/features/tokens/buildTokenGraphTiles'

const VIEW_WIDTH = 320
const VIEW_HEIGHT = 132
const X_PADDING = 12
const Y_PADDING = 14
const BASE_NODE_RADIUS = 6
const LINE_NODE_GAP = 0.5

interface PreviewPoint {
  x: number
  y: number
  radius: number
  halfWidth: number
  row: number
}

interface PreviewTopology {
  nodes: TokenGraphTileNode[]
  points: Map<string, PreviewPoint>
  path: string
  rootIds: Set<string>
  scale: number
}

/**
 * A deliberately compact structural preview. Chain marks identify the useful
 * destinations, burn-mint sets collapse into one pill, and a quiet outer ring
 * identifies backing sources. Directional arrows and risk details stay in the
 * full graph, where they have enough room to be unambiguous.
 */
export function TokenGraphTileDiagram({
  graph,
}: {
  graph: TokenGraphTileGraph
}) {
  const topology = useMemo(() => buildPreviewTopology(graph), [graph])

  if (topology.nodes.length === 0) return null

  return (
    <svg
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      height={VIEW_HEIGHT}
      width="100%"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="How this token's deployments are connected"
    >
      {topology.path && (
        <path
          d={topology.path}
          fill="none"
          className="stroke-primary"
          strokeOpacity={0.22}
          strokeWidth={0.8 * Math.min(topology.scale, 1.4)}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}

      {topology.nodes.map((node) => {
        if (!topology.rootIds.has(node.id)) return null
        const point = topology.points.get(node.id)
        if (!point) return null
        return (
          <SourceRing key={`source-${node.id}`} node={node} point={point} />
        )
      })}

      {topology.nodes.map((node) => {
        const point = topology.points.get(node.id)
        if (!point) return null
        return <NodeMark key={node.id} node={node} point={point} />
      })}
    </svg>
  )
}

function NodeMark({
  node,
  point,
}: {
  node: TokenGraphTileNode
  point: PreviewPoint
}) {
  if (node.chains.length > 1) {
    const metrics = getClusterMetrics(node, point.radius)
    const shown = node.chains.slice(0, getVisibleChainCount(node))
    const remaining = node.chains.length - shown.length
    const left = point.x - metrics.width / 2
    const contentLeft = point.x - metrics.contentWidth / 2
    return (
      <g>
        <title>Burn-mint set across {node.chains.length} chains</title>
        <rect
          x={left}
          y={point.y - point.radius}
          width={metrics.width}
          height={point.radius * 2}
          rx={point.radius}
          className="fill-surface-primary stroke-brand"
          strokeWidth={1.2 * Math.min(metrics.scale, 1.35)}
        />
        {shown.map((chain, index) => {
          const centreX =
            contentLeft + metrics.iconDiameter / 2 + index * metrics.iconStep
          const iconUrl = node.chainIconUrls?.[index]
          return (
            <g key={`${node.id}-${chain}-${index}`}>
              <circle
                cx={centreX}
                cy={point.y}
                r={metrics.iconDiameter / 2}
                className="fill-surface-primary stroke-divider"
                strokeWidth={0.7 * Math.min(metrics.scale, 1.35)}
              />
              {iconUrl && (
                <image
                  href={iconUrl}
                  x={centreX - metrics.logoSize / 2}
                  y={point.y - metrics.logoSize / 2}
                  width={metrics.logoSize}
                  height={metrics.logoSize}
                  preserveAspectRatio="xMidYMid meet"
                />
              )}
            </g>
          )
        })}
        {remaining > 0 && (
          <text
            x={
              contentLeft +
              metrics.iconStackWidth +
              metrics.contentGap +
              metrics.countSlotWidth / 2
            }
            y={point.y + 2.5 * metrics.scale}
            textAnchor="middle"
            className="fill-secondary font-bold"
            style={{ fontSize: 7 * metrics.scale }}
          >
            +{remaining}
          </text>
        )}
      </g>
    )
  }

  const iconUrl = node.chainIconUrls?.[0]
  const iconSize = point.radius * 1.35
  return (
    <g>
      <title>{node.chains[0] ?? 'Unknown chain'}</title>
      <circle
        cx={point.x}
        cy={point.y}
        r={point.radius}
        className="fill-surface-primary stroke-divider"
        strokeWidth={Math.min(point.radius / BASE_NODE_RADIUS, 1.4)}
      />
      {iconUrl ? (
        <image
          href={iconUrl}
          x={point.x - iconSize / 2}
          y={point.y - iconSize / 2}
          width={iconSize}
          height={iconSize}
          preserveAspectRatio="xMidYMid meet"
        />
      ) : (
        <circle
          cx={point.x}
          cy={point.y}
          r={point.radius * 0.375}
          className="fill-brand"
          fillOpacity={0.6}
        />
      )}
    </g>
  )
}

function SourceRing({
  node,
  point,
}: {
  node: TokenGraphTileNode
  point: PreviewPoint
}) {
  if (node.chains.length > 1) {
    const scale = point.radius / BASE_NODE_RADIUS
    const width = getClusterMetrics(node, point.radius).width + 6 * scale
    return (
      <rect
        x={point.x - width / 2}
        y={point.y - point.radius - 3 * scale}
        width={width}
        height={point.radius * 2 + 6 * scale}
        rx={point.radius + 3 * scale}
        fill="none"
        className="stroke-brand"
        strokeOpacity={0.3}
        strokeWidth={0.9 * Math.min(scale, 1.35)}
      />
    )
  }

  return (
    <circle
      cx={point.x}
      cy={point.y}
      r={point.radius + 3 * (point.radius / BASE_NODE_RADIUS)}
      fill="none"
      className="stroke-brand"
      strokeOpacity={0.3}
      strokeWidth={0.9 * Math.min(point.radius / BASE_NODE_RADIUS, 1.35)}
    />
  )
}

function buildPreviewTopology(graph: TokenGraphTileGraph): PreviewTopology {
  const unconnected = new Set(graph.unconnectedNodeIds)
  const nodes = graph.nodes.filter((node) => !unconnected.has(node.id))
  const nodeIds = new Set(nodes.map((node) => node.id))
  const edges = graph.edges.filter(
    (edge) => nodeIds.has(edge.from) && nodeIds.has(edge.to),
  )
  const layoutNodes = nodes.map((node) => ({
    id: node.id,
    bridges: [],
    volume: null,
    deployments: node.chains.map((chain, index) => ({
      chain,
      chainName: chain,
      iconUrl: node.chainIconUrls?.[index] ?? undefined,
      address: '',
      symbol: '',
      explorerUrl: undefined,
      volume: null,
    })),
  }))
  const layoutEdges = edges.map((edge) => ({ ...edge, bridges: [] }))
  const heights = new Map(
    layoutNodes.map((node) => [node.id, getRelationsNodeHeight(node)]),
  )
  const widths = new Map(
    layoutNodes.map((node) => [node.id, getRelationsNodeWidth(node)]),
  )
  const layout = layoutWrappedRelationsGraph(
    layoutNodes,
    layoutEdges,
    [],
    heights,
    widths,
  )

  const rows = new Map<number, TokenGraphTileNode[]>()
  for (const node of nodes) {
    const row = layout.rowOf.get(node.id) ?? 0
    rows.set(row, [...(rows.get(row) ?? []), node])
  }
  const rowNumbers = [...rows.keys()].toSorted((a, b) => a - b)
  const scale = getPreviewScale(nodes.length, rows)
  const radius = BASE_NODE_RADIUS * scale
  const horizontalSpread = getHorizontalSpread(nodes.length)
  const compactRowOf = new Map(rowNumbers.map((row, index) => [row, index]))
  const lastRow = Math.max(0, rowNumbers.length - 1)
  const points = new Map<string, PreviewPoint>()

  for (const rowNumber of rowNumbers) {
    const row = (rows.get(rowNumber) ?? []).toSorted(
      (a, b) =>
        (layout.boxes.get(a.id)?.x ?? 0) - (layout.boxes.get(b.id)?.x ?? 0) ||
        a.id.localeCompare(b.id),
    )
    const desired = row.map((node) => {
      const box = layout.boxes.get(node.id)
      const centre = box ? box.x + box.width / 2 : layout.width / 2
      const fullWidthPosition =
        X_PADDING +
        (centre / Math.max(1, layout.width)) * (VIEW_WIDTH - X_PADDING * 2)
      return (
        VIEW_WIDTH / 2 + (fullWidthPosition - VIEW_WIDTH / 2) * horizontalSpread
      )
    })
    const halfWidths = row.map((node) => getNodeHalfWidth(node, radius))
    const spreadXs = spreadRow(desired, halfWidths)
    const xs = nodes.length <= 5 ? centerRow(spreadXs, halfWidths) : spreadXs
    const rowIndex = compactRowOf.get(rowNumber) ?? 0
    const verticalSpan = getVerticalSpan(nodes.length, lastRow)
    const y =
      lastRow === 0
        ? VIEW_HEIGHT / 2
        : (VIEW_HEIGHT - verticalSpan) / 2 + (rowIndex / lastRow) * verticalSpan
    row.forEach((node, index) => {
      points.set(node.id, {
        x: xs[index] ?? VIEW_WIDTH / 2,
        y,
        radius,
        halfWidth: halfWidths[index] ?? radius,
        row: rowIndex,
      })
    })
  }

  const path = buildCompactPaths(edges, points).join(' ')
  const incomingIds = new Set(edges.map((edge) => edge.to))
  const rootIds = new Set(
    nodes.filter((node) => !incomingIds.has(node.id)).map((node) => node.id),
  )
  return {
    nodes,
    points,
    path,
    rootIds,
    scale,
  }
}

function getPreviewScale(
  nodeCount: number,
  rows: ReadonlyMap<number, TokenGraphTileNode[]>,
): number {
  const desired = getDensityScale(nodeCount)
  const availableWidth = VIEW_WIDTH - X_PADDING * 2
  const rowCaps = [...rows.values()].map((row) => {
    const baseWidth = row.reduce(
      (sum, node) => sum + getNodeHalfWidth(node, BASE_NODE_RADIUS) * 2,
      0,
    )
    const minimumGaps = Math.max(0, row.length - 1) * 3
    return baseWidth === 0
      ? desired
      : (availableWidth - minimumGaps) / baseWidth
  })
  return Math.max(1, Math.min(desired, ...rowCaps))
}

function getDensityScale(nodeCount: number): number {
  if (nodeCount <= 1) return 3
  if (nodeCount <= 3) return 2.3
  if (nodeCount <= 5) return 1.8
  if (nodeCount <= 8) return 1.45
  if (nodeCount <= 12) return 1.18
  return 1
}

function getHorizontalSpread(nodeCount: number): number {
  if (nodeCount <= 1) return 0
  if (nodeCount <= 3) return 0.4
  if (nodeCount <= 5) return 0.58
  if (nodeCount <= 8) return 0.72
  if (nodeCount <= 12) return 0.86
  return 1
}

function getVerticalSpan(nodeCount: number, lastRow: number): number {
  if (lastRow === 0) return 0
  if (lastRow === 1 && nodeCount <= 5) return 58
  if (nodeCount <= 3) return lastRow === 1 ? 58 : 82
  if (nodeCount <= 5) return 84
  if (nodeCount <= 8) return 90
  if (nodeCount <= 12) return 96
  return VIEW_HEIGHT - Y_PADDING * 2
}

interface TargetRowGroup {
  row: number
  busY: number
  edges: TokenGraphTileGraph['edges']
}

function buildCompactPaths(
  edges: TokenGraphTileGraph['edges'],
  points: ReadonlyMap<string, PreviewPoint>,
): string[] {
  const outgoing = new Map<string, TokenGraphTileGraph['edges']>()
  for (const edge of edges) {
    outgoing.set(edge.from, [...(outgoing.get(edge.from) ?? []), edge])
  }

  const paths: string[] = []
  const sourceIds = [...outgoing.keys()].toSorted()
  sourceIds.forEach((sourceId, sourceLane) => {
    const from = points.get(sourceId)
    if (!from) return
    const startY = from.y + from.radius + LINE_NODE_GAP
    const edgesByRow = new Map<number, TokenGraphTileGraph['edges']>()
    for (const edge of outgoing.get(sourceId) ?? []) {
      const target = points.get(edge.to)
      if (!target) continue
      edgesByRow.set(target.row, [...(edgesByRow.get(target.row) ?? []), edge])
    }

    const groups: TargetRowGroup[] = [...edgesByRow]
      .toSorted(([a], [b]) => a - b)
      .map(([row, rowEdges]) => {
        const targetY = Math.min(
          ...rowEdges.map((edge) => {
            const target = points.get(edge.to)
            return target
              ? target.y - target.radius - LINE_NODE_GAP
              : VIEW_HEIGHT
          }),
        )
        const available = Math.max(0, targetY - startY)
        const clearance = Math.max(3, Math.min(6, available * 0.3))
        return {
          row,
          busY: available > 5 ? targetY - clearance : startY + available / 2,
          edges: rowEdges,
        }
      })

    const adjacent = groups.find((group) => group.row === from.row + 1)
    const deep = groups.filter((group) => group !== adjacent)
    if (adjacent) paths.push(`M ${from.x} ${startY} V ${adjacent.busY}`)

    let laneX: number | undefined
    if (deep.length > 0) {
      laneX = getSideLane(from, deep, points, sourceLane)
      const firstBusY = Math.min(...deep.map((group) => group.busY))
      const deepestBusY = Math.max(...deep.map((group) => group.busY))
      const connectorLimit = adjacent
        ? Math.min(adjacent.busY, firstBusY)
        : firstBusY
      const departureY =
        startY +
        Math.max(1.5, Math.min(4, Math.max(0, connectorLimit - startY) / 2))
      paths.push(
        adjacent
          ? `M ${from.x} ${departureY} H ${laneX} V ${deepestBusY}`
          : `M ${from.x} ${startY} V ${departureY} H ${laneX} V ${deepestBusY}`,
      )
    }

    for (const group of groups) {
      const anchorX = group === adjacent ? from.x : laneX
      if (anchorX === undefined) continue
      const targets = group.edges.flatMap((edge) => {
        const target = points.get(edge.to)
        return target ? [target] : []
      })
      const minX = Math.min(anchorX, ...targets.map((target) => target.x))
      const maxX = Math.max(anchorX, ...targets.map((target) => target.x))
      if (maxX - minX > 0.5) {
        paths.push(`M ${minX} ${group.busY} H ${maxX}`)
      }
      for (const target of targets) {
        const endY = target.y - target.radius - LINE_NODE_GAP
        paths.push(`M ${target.x} ${group.busY} V ${endY}`)
      }
    }
  })
  return paths
}

function getSideLane(
  from: PreviewPoint,
  groups: TargetRowGroup[],
  points: ReadonlyMap<string, PreviewPoint>,
  sourceLane: number,
): number {
  const deepestRow = Math.max(...groups.map((group) => group.row))
  const traversed = [...points.values()].filter(
    (point) => point.row > from.row && point.row <= deepestRow,
  )
  const leftBoundary = Math.min(
    from.x - from.halfWidth,
    ...traversed.map((point) => point.x - point.halfWidth),
  )
  const rightBoundary = Math.max(
    from.x + from.halfWidth,
    ...traversed.map((point) => point.x + point.halfWidth),
  )
  const laneGap = 7 + sourceLane * 1.5
  const left = Math.max(3, leftBoundary - laneGap)
  const right = Math.min(VIEW_WIDTH - 3, rightBoundary + laneGap)
  const targetXs = groups.flatMap((group) =>
    group.edges.flatMap((edge) => {
      const target = points.get(edge.to)
      return target ? [target.x] : []
    }),
  )
  const targetCentre =
    targetXs.reduce((sum, x) => sum + x, 0) / Math.max(1, targetXs.length)
  const leftDistance = Math.abs(from.x - left) + Math.abs(targetCentre - left)
  const rightDistance =
    Math.abs(from.x - right) + Math.abs(targetCentre - right)
  return leftDistance <= rightDistance ? left : right
}

function spreadRow(desired: number[], halfWidths: number[]): number[] {
  if (desired.length === 0) return []
  if (desired.length === 1) {
    const halfWidth = halfWidths[0] ?? BASE_NODE_RADIUS
    return [
      Math.max(
        X_PADDING + halfWidth,
        Math.min(VIEW_WIDTH - X_PADDING - halfWidth, desired[0] ?? 0),
      ),
    ]
  }

  const totalWidth = halfWidths.reduce(
    (sum, halfWidth) => sum + halfWidth * 2,
    0,
  )
  const available = VIEW_WIDTH - X_PADDING * 2
  const gap = Math.max(
    2,
    Math.min(8, (available - totalWidth) / (desired.length - 1)),
  )
  const result = [...desired]
  for (let index = 0; index < result.length; index++) {
    const halfWidth = halfWidths[index] ?? BASE_NODE_RADIUS
    const minimum =
      index === 0
        ? X_PADDING + halfWidth
        : (result[index - 1] ?? 0) +
          (halfWidths[index - 1] ?? BASE_NODE_RADIUS) +
          halfWidth +
          gap
    result[index] = Math.max(result[index] ?? 0, minimum)
  }

  const last = result.length - 1
  const overflow =
    (result[last] ?? 0) +
    (halfWidths[last] ?? BASE_NODE_RADIUS) -
    (VIEW_WIDTH - X_PADDING)
  if (overflow > 0) {
    for (let index = 0; index < result.length; index++) {
      result[index] = (result[index] ?? 0) - overflow
    }
  }
  for (let index = result.length - 2; index >= 0; index--) {
    const maximum =
      (result[index + 1] ?? 0) -
      (halfWidths[index + 1] ?? BASE_NODE_RADIUS) -
      (halfWidths[index] ?? BASE_NODE_RADIUS) -
      gap
    result[index] = Math.min(result[index] ?? 0, maximum)
  }
  return result
}

function centerRow(xs: number[], halfWidths: number[]): number[] {
  if (xs.length === 0) return []

  const left = Math.min(
    ...xs.map((x, index) => x - (halfWidths[index] ?? BASE_NODE_RADIUS)),
  )
  const right = Math.max(
    ...xs.map((x, index) => x + (halfWidths[index] ?? BASE_NODE_RADIUS)),
  )
  const desiredShift = VIEW_WIDTH / 2 - (left + right) / 2
  const minimumShift = X_PADDING - left
  const maximumShift = VIEW_WIDTH - X_PADDING - right
  const shift = Math.max(minimumShift, Math.min(maximumShift, desiredShift))

  return xs.map((x) => x + shift)
}

interface ClusterMetrics {
  scale: number
  width: number
  contentWidth: number
  iconStackWidth: number
  iconDiameter: number
  iconStep: number
  logoSize: number
  contentGap: number
  countSlotWidth: number
}

function getClusterMetrics(
  node: TokenGraphTileNode,
  radius: number,
): ClusterMetrics {
  const scale = radius / BASE_NODE_RADIUS
  const shown = getVisibleChainCount(node)
  const iconDiameter = 8.5 * scale
  const iconStep = 6.5 * scale
  const logoSize = 6.25 * scale
  const iconStackWidth = iconDiameter + Math.max(0, shown - 1) * iconStep
  const remaining = node.chains.length - shown
  const contentGap = remaining > 0 ? 3 * scale : 0
  const countSlotWidth =
    remaining > 0 ? (String(remaining).length * 4 + 5) * scale : 0
  const contentWidth = iconStackWidth + contentGap + countSlotWidth
  return {
    scale,
    width: contentWidth + 10 * scale,
    contentWidth,
    iconStackWidth,
    iconDiameter,
    iconStep,
    logoSize,
    contentGap,
    countSlotWidth,
  }
}

function getVisibleChainCount(node: TokenGraphTileNode): number {
  return Math.min(5, node.chains.length)
}

function getNodeHalfWidth(node: TokenGraphTileNode, radius: number): number {
  return node.chains.length > 1
    ? getClusterMetrics(node, radius).width / 2
    : radius
}
