import { useMemo } from 'react'
import { layoutRelationsGraph } from '~/components/projects/sections/interop/onchain-deployments/relations-graph/layoutRelationsGraph'
import type {
  TokenGraphTile,
  TokenGraphTileEdge,
  TokenGraphTileNode,
} from '~/server/features/tokens/buildTokenGraphTiles'

const VIEW_WIDTH = 320
const VIEW_HEIGHT = 132
const X_PADDING = 12
const Y_PADDING = 14
const BASE_RADIUS = 6
const SOURCE_RING_GAP = 3
const LINE_GAP = 0.5
const MAX_CLUSTER_ICONS = 5

interface Mark {
  node: TokenGraphTileNode
  x: number
  y: number
  radius: number
  halfWidth: number
  row: number
  isSource: boolean
}

/**
 * A deliberately compact structural preview: chain marks identify the
 * deployments, burn-and-mint sets collapse into one pill, and a quiet outer
 * ring identifies the backing sources. Directions, addresses and activity
 * stay in the full graph, where they have room to be unambiguous.
 */
export function TokenGraphTileDiagram({
  graph,
}: {
  graph: TokenGraphTile['graph']
}) {
  const preview = useMemo(() => buildPreview(graph), [graph])

  return (
    <svg
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      height={VIEW_HEIGHT}
      width="100%"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="How this token's deployments are connected"
    >
      {preview.path && (
        <path
          d={preview.path}
          fill="none"
          className="stroke-primary/25"
          strokeWidth={0.8 * Math.min(preview.scale, 1.4)}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {preview.marks.map((mark) => (
        <NodeMark key={mark.node.id} mark={mark} />
      ))}
    </svg>
  )
}

function NodeMark({ mark }: { mark: Mark }) {
  const { node, x, y, radius } = mark
  const scale = radius / BASE_RADIUS
  const strokeWidth = Math.min(scale, 1.35)

  if (node.chains.length > 1) {
    const metrics = getClusterMetrics(node, radius)
    const shown = node.chains.slice(0, MAX_CLUSTER_ICONS)
    const remaining = node.chains.length - shown.length
    const contentLeft = x - metrics.contentWidth / 2
    return (
      <g>
        <title>Burn & mint across {node.chains.length} chains</title>
        {mark.isSource && (
          <SourceRing
            x={x}
            y={y}
            halfWidth={metrics.width / 2}
            radius={radius}
          />
        )}
        <rect
          x={x - metrics.width / 2}
          y={y - radius}
          width={metrics.width}
          height={radius * 2}
          rx={radius}
          className="fill-surface-primary stroke-brand"
          strokeWidth={1.2 * strokeWidth}
        />
        {shown.map((chain, index) => {
          const centreX =
            contentLeft + metrics.iconDiameter / 2 + index * metrics.iconStep
          return (
            <ChainMark
              key={`${chain.id}-${index}`}
              iconUrl={chain.iconUrl}
              x={centreX}
              y={y}
              radius={metrics.iconDiameter / 2}
              strokeWidth={0.7 * strokeWidth}
            />
          )
        })}
        {remaining > 0 && (
          <text
            x={contentLeft + metrics.contentWidth - metrics.countWidth / 2}
            y={y + 2.5 * scale}
            textAnchor="middle"
            className="fill-secondary font-bold"
            style={{ fontSize: 7 * scale }}
          >
            +{remaining}
          </text>
        )}
      </g>
    )
  }

  const chain = node.chains[0]
  return (
    <g>
      <title>{chain?.id ?? 'Unknown chain'}</title>
      {mark.isSource && (
        <SourceRing x={x} y={y} halfWidth={radius} radius={radius} />
      )}
      <ChainMark
        iconUrl={chain?.iconUrl}
        x={x}
        y={y}
        radius={radius}
        strokeWidth={strokeWidth}
      />
    </g>
  )
}

function ChainMark({
  iconUrl,
  x,
  y,
  radius,
  strokeWidth,
}: {
  iconUrl: string | undefined
  x: number
  y: number
  radius: number
  strokeWidth: number
}) {
  const iconSize = radius * 1.4
  return (
    <>
      <circle
        cx={x}
        cy={y}
        r={radius}
        className="fill-surface-primary stroke-divider"
        strokeWidth={strokeWidth}
      />
      {iconUrl ? (
        <image
          href={iconUrl}
          x={x - iconSize / 2}
          y={y - iconSize / 2}
          width={iconSize}
          height={iconSize}
          preserveAspectRatio="xMidYMid meet"
        />
      ) : (
        <circle cx={x} cy={y} r={radius * 0.4} className="fill-brand/60" />
      )}
    </>
  )
}

function SourceRing({
  x,
  y,
  halfWidth,
  radius,
}: {
  x: number
  y: number
  halfWidth: number
  radius: number
}) {
  const scale = radius / BASE_RADIUS
  const gap = SOURCE_RING_GAP * scale
  return (
    <rect
      x={x - halfWidth - gap}
      y={y - radius - gap}
      width={(halfWidth + gap) * 2}
      height={(radius + gap) * 2}
      rx={radius + gap}
      fill="none"
      className="stroke-brand/30"
      strokeWidth={0.9 * Math.min(scale, 1.35)}
    />
  )
}

function buildPreview(graph: TokenGraphTile['graph']): {
  marks: Mark[]
  path: string
  scale: number
} {
  const { nodes, edges } = graph
  const backed = new Set(edges.map((edge) => edge.to))
  const sourceIds = new Set(
    edges.map((edge) => edge.from).filter((id) => !backed.has(id)),
  )

  // Only the rows and the order within them are borrowed from the real
  // layout; the preview places marks on its own, much tighter, grid.
  const layout = layoutRelationsGraph(
    nodes.map((node) => ({ id: node.id, volume: null, width: 1, height: 1 })),
    edges,
  )
  const byRow = new Map<number, TokenGraphTileNode[]>()
  for (const node of nodes) {
    const row = layout.rowOf.get(node.id) ?? 0
    byRow.set(row, [...(byRow.get(row) ?? []), node])
  }
  const rows = [...byRow.entries()]
    .toSorted(([a], [b]) => a - b)
    .map(([, row]) =>
      row.toSorted(
        (a, b) =>
          (layout.boxes.get(a.id)?.x ?? 0) - (layout.boxes.get(b.id)?.x ?? 0),
      ),
    )

  const scale = getScale(nodes.length, rows)
  const radius = BASE_RADIUS * scale
  const rowHalfHeights = rows.map(
    (row) =>
      radius +
      (row.some((node) => sourceIds.has(node.id))
        ? SOURCE_RING_GAP * scale
        : 0),
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

/** Bigger marks for sparse graphs, capped so the widest row still fits. */
function getScale(nodeCount: number, rows: TokenGraphTileNode[][]): number {
  const desired =
    nodeCount <= 1
      ? 3
      : nodeCount <= 3
        ? 2.3
        : nodeCount <= 5
          ? 1.8
          : nodeCount <= 8
            ? 1.45
            : nodeCount <= 12
              ? 1.18
              : 1
  const available = VIEW_WIDTH - X_PADDING * 2
  const caps = rows.map((row) => {
    const width = row.reduce(
      (sum, node) => sum + getHalfWidth(node, BASE_RADIUS) * 2,
      0,
    )
    const gaps = Math.max(0, row.length - 1) * 3
    return width === 0 ? desired : (available - gaps) / width
  })
  return Math.max(1, Math.min(desired, ...caps))
}

function getVerticalSpan(nodeCount: number, rowCount: number): number {
  if (rowCount <= 1) return 0
  if (rowCount === 2 && nodeCount <= 8) return 58
  if (nodeCount <= 3) return 82
  if (nodeCount <= 5) return 84
  if (nodeCount <= 8) return 90
  if (nodeCount <= 12) return 96
  return VIEW_HEIGHT - Y_PADDING * 2
}

/** Rows centred vertically with equal gaps between their visible extents. */
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

/** Marks of a row centred horizontally, closer together in sparse graphs. */
function placeRow(halfWidths: number[], nodeCount: number): number[] {
  if (halfWidths.length === 0) return []
  const available = VIEW_WIDTH - X_PADDING * 2
  const total = halfWidths.reduce((sum, halfWidth) => sum + halfWidth * 2, 0)
  const maxGap = nodeCount <= 3 ? 40 : nodeCount <= 5 ? 30 : 16
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

/**
 * Orthogonal connectors: each source drops to a horizontal bus above every
 * row it backs, and the bus fans out to the targets. Rows further than the
 * next one are reached through a side lane so lines do not cross marks.
 */
function buildPaths(
  edges: TokenGraphTileEdge[],
  marks: ReadonlyMap<string, Mark>,
): string[] {
  const outgoing = new Map<string, Mark[]>()
  for (const edge of edges) {
    const target = marks.get(edge.to)
    if (!target) continue
    outgoing.set(edge.from, [...(outgoing.get(edge.from) ?? []), target])
  }

  const paths: string[] = []
  const sourceIds = [...outgoing.keys()].toSorted()
  sourceIds.forEach((sourceId, lane) => {
    const from = marks.get(sourceId)
    if (!from) return
    const startY = from.y + from.radius + LINE_GAP

    const byRow = new Map<number, Mark[]>()
    for (const target of outgoing.get(sourceId) ?? []) {
      byRow.set(target.row, [...(byRow.get(target.row) ?? []), target])
    }
    const groups: RowGroup[] = [...byRow]
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

/** The free vertical lane beside every row a deep connector passes. */
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

function getClusterMetrics(
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
