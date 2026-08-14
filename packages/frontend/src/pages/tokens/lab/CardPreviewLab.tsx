import { formatCurrency } from '@l2beat/shared-pure'
import { useMemo } from 'react'
import {
  getRelationsNodeHeight,
  getRelationsNodeWidth,
} from '~/components/projects/sections/interop/token-relations/RelationsNode'
import {
  layoutWrappedRelationsGraph,
  wrappedEdgeKey,
} from '~/components/projects/sections/interop/token-relations/wrappedLayout'
import type {
  InteropTokenRelationsEdge,
  InteropTokenRelationsGraph,
  InteropTokenRelationsNode,
} from '~/server/features/scaling/interop/token/getInteropTokenRelationsGraph'
import type { TokenLayoutLabToken } from './getTokenLayoutLabPageData'

const PREVIEW_HEIGHT = 132
const CANVAS_WIDTH = 320
const CANVAS_HEIGHT = 132
const CANVAS_X_PADDING = 12
const CANVAS_Y_PADDING = 14
const NODE_RADIUS = 6
const LINE_NODE_GAP = 0.5

type TopologyVariant =
  | 'clean'
  | 'direction-cues'
  | 'top-route-badges'
  | 'cluster-authorities'
  | 'source-anchors'
  | 'risk-spotlight'
  | 'minter-counts'
  | 'balanced'

interface PreviewOptionDefinition {
  number: string
  title: string
  persona: string
  strength: string
  tradeoff: string
  payload: string
  variant: TopologyVariant
}

const OPTIONS: PreviewOptionDefinition[] = [
  {
    number: '1',
    title: 'Clean topology',
    persona: 'Holder scanning chains and overall structure',
    strength: 'Chain logos and cluster pills stay legible and calm.',
    tradeoff: 'Popularity and minter identity remain hidden.',
    payload: 'Needs chain icons and cluster membership',
    variant: 'clean',
  },
  {
    number: '2',
    title: 'Direction cues',
    persona: 'Holder trying to understand backing direction',
    strength: 'Colored arrowheads clarify flow without implying route weight.',
    tradeoff:
      'The accent can attract more attention than the topology warrants.',
    payload: 'No additional graph payload',
    variant: 'direction-cues',
  },
  {
    number: '3',
    title: 'Top-route minters',
    persona: 'Bridge user checking the busiest destination paths',
    strength: 'Names minters on only the three most active routes.',
    tradeoff: 'Less active routes still require opening the graph.',
    payload: 'Adds bridge identities and volume',
    variant: 'top-route-badges',
  },
  {
    number: '4',
    title: 'Cluster authorities',
    persona: 'User asking who controls the native burn-mint set',
    strength: 'Attaches authority badges only to burn-mint clusters.',
    tradeoff: 'Lock-mint bridge risk is not surfaced in the card.',
    payload: 'Adds burn-mint bridge identities',
    variant: 'cluster-authorities',
  },
  {
    number: '5',
    title: 'Source anchors',
    persona: 'Newcomer learning where the backing paths begin',
    strength: 'A quiet halo makes origins easier to locate and trace.',
    tradeoff: 'Source prominence says nothing about source safety.',
    payload: 'No additional graph payload',
    variant: 'source-anchors',
  },
  {
    number: '6',
    title: 'Risk spotlight',
    persona: 'Crosschain user tracing the most consequential paths',
    strength: 'Highlights three routes and dims the surrounding context.',
    tradeoff: 'The selected routes can look more canonical than they are.',
    payload: 'Adds bridge identities and volume',
    variant: 'risk-spotlight',
  },
  {
    number: '7',
    title: 'Multiple-minter cues',
    persona: 'Security reviewer looking for compounded authority risk',
    strength: 'Small counts flag nodes exposed to multiple minter systems.',
    tradeoff: 'Counts reveal complexity but not who the minters are.',
    payload: 'Adds bridge attribution',
    variant: 'minter-counts',
  },
  {
    number: '8',
    title: 'Balanced candidate',
    persona: 'Crosschain user balancing popularity and bridge risk',
    strength: 'Combines source cues with restrained authority badges.',
    tradeoff: 'Still carries more visual grammar than the clean version.',
    payload: 'Needs full preview metadata',
    variant: 'balanced',
  },
]

export function CardPreviewLab({ token }: { token: TokenLayoutLabToken }) {
  return (
    <section>
      <header className="mb-3">
        <h2 className="font-bold text-heading-20">
          Topology preview experiments
        </h2>
        <p className="max-w-4xl text-label-value-13 text-secondary">
          Eight controlled variants of chain-logo nodes, explicit burn-mint
          cluster pills, and lighter buses. Each option changes one emphasis so
          the useful additions can be separated from the clutter.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {OPTIONS.map((option) => (
          <PreviewOption key={option.number} {...option}>
            <TokenPreviewFrame token={token}>
              <TopologyPreview graph={token.graph} variant={option.variant} />
            </TokenPreviewFrame>
          </PreviewOption>
        ))}
      </div>
    </section>
  )
}

function PreviewOption({
  number,
  title,
  persona,
  strength,
  tradeoff,
  payload,
  children,
}: Omit<PreviewOptionDefinition, 'variant'> & { children: React.ReactNode }) {
  return (
    <article className="min-w-0">
      <div className="mb-3 min-h-[140px]">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-full bg-brand font-bold text-label-value-12 text-white">
            {number}
          </span>
          <h3 className="font-bold text-label-value-15">{title}</h3>
        </div>
        <p className="mt-1.5 text-label-value-12 text-secondary">
          <span className="font-medium text-primary">For:</span> {persona}
        </p>
        <p className="text-label-value-12">
          <span className="font-medium">Strength:</span> {strength}
        </p>
        <p className="text-label-value-12 text-secondary">
          <span className="font-medium">Tradeoff:</span> {tradeoff}
        </p>
        <p className="text-label-value-12 text-secondary">{payload}</p>
      </div>
      {children}
    </article>
  )
}

function TokenPreviewFrame({
  token,
  children,
}: {
  token: TokenLayoutLabToken
  children: React.ReactNode
}) {
  const deploymentCount = token.graph.nodes.reduce(
    (sum, node) => sum + node.deployments.length,
    0,
  )
  const chainCount = new Set(
    token.graph.nodes.flatMap((node) =>
      node.deployments.map((deployment) => deployment.chain),
    ),
  ).size
  const volumes = token.graph.nodes.flatMap((node) =>
    node.volume === null ? [] : [node.volume],
  )
  const volume =
    volumes.length === 0 ? null : volumes.reduce((sum, value) => sum + value, 0)
  const minterCount = new Set([
    ...token.graph.nodes.flatMap((node) =>
      node.bridges.map((bridge) => bridge.id),
    ),
    ...token.graph.edges.flatMap((edge) =>
      edge.bridges.map((bridge) => bridge.id),
    ),
  ]).size

  return (
    <div className="flex flex-col rounded-lg border border-divider bg-surface-primary p-4 text-left transition-colors hover:border-brand">
      <div className="flex items-center gap-2">
        {token.iconUrl && (
          <img
            src={token.iconUrl}
            alt=""
            width={24}
            height={24}
            className="size-6 shrink-0 rounded-full"
          />
        )}
        <div className="min-w-0">
          <p className="truncate font-bold text-label-value-15">
            {token.symbol}
          </p>
          {token.issuer && (
            <p className="truncate text-label-value-12 text-secondary">
              Issued by <span className="capitalize">{token.issuer}</span>
            </p>
          )}
        </div>
        {volume !== null && (
          <span className="ml-auto shrink-0 font-medium text-label-value-13 text-secondary">
            {formatCurrency(volume, 'usd')}
          </span>
        )}
      </div>

      <div
        className="my-3 grow overflow-hidden"
        style={{ height: PREVIEW_HEIGHT }}
      >
        {children}
      </div>

      <p className="text-label-value-12 text-secondary">
        {deploymentCount} {deploymentCount === 1 ? 'deployment' : 'deployments'}{' '}
        · {chainCount} {chainCount === 1 ? 'chain' : 'chains'}
        {' · '}
        {minterCount} {minterCount === 1 ? 'minter' : 'minters'}
      </p>
    </div>
  )
}

interface TopologyConfig {
  directionCues: boolean
  edgeBadges: number
  clusterBadges: boolean
  rootEmphasis: boolean
  spotlight: number
  minterCounts: boolean
}

const CONFIGS: Record<TopologyVariant, TopologyConfig> = {
  clean: {
    directionCues: false,
    edgeBadges: 0,
    clusterBadges: false,
    rootEmphasis: false,
    spotlight: 0,
    minterCounts: false,
  },
  'direction-cues': {
    directionCues: true,
    edgeBadges: 0,
    clusterBadges: false,
    rootEmphasis: false,
    spotlight: 0,
    minterCounts: false,
  },
  'top-route-badges': {
    directionCues: false,
    edgeBadges: 3,
    clusterBadges: false,
    rootEmphasis: false,
    spotlight: 0,
    minterCounts: false,
  },
  'cluster-authorities': {
    directionCues: false,
    edgeBadges: 0,
    clusterBadges: true,
    rootEmphasis: false,
    spotlight: 0,
    minterCounts: false,
  },
  'source-anchors': {
    directionCues: false,
    edgeBadges: 0,
    clusterBadges: false,
    rootEmphasis: true,
    spotlight: 0,
    minterCounts: false,
  },
  'risk-spotlight': {
    directionCues: false,
    edgeBadges: 3,
    clusterBadges: false,
    rootEmphasis: false,
    spotlight: 3,
    minterCounts: false,
  },
  'minter-counts': {
    directionCues: false,
    edgeBadges: 0,
    clusterBadges: false,
    rootEmphasis: false,
    spotlight: 0,
    minterCounts: true,
  },
  balanced: {
    directionCues: false,
    edgeBadges: 2,
    clusterBadges: true,
    rootEmphasis: true,
    spotlight: 0,
    minterCounts: false,
  },
}

interface PreviewPoint {
  x: number
  y: number
  radius: number
  row: number
}

interface PreviewEdgeGeometry {
  routePath: string
  branchPath: string
  badgeX: number
  badgeY: number
}

interface PreviewPathGeometry {
  key: string
  path: string
}

interface CompactTopology {
  nodes: InteropTokenRelationsNode[]
  edges: InteropTokenRelationsEdge[]
  points: Map<string, PreviewPoint>
  connectors: PreviewPathGeometry[]
  buses: PreviewPathGeometry[]
  geometries: Map<string, PreviewEdgeGeometry>
  prominentEdgeKeys: Set<string>
  rootIds: Set<string>
  minterCountByNode: Map<string, number>
}

function TopologyPreview({
  graph,
  variant,
}: {
  graph: InteropTokenRelationsGraph
  variant: TopologyVariant
}) {
  const config = CONFIGS[variant]
  const topology = useMemo(
    () => buildCompactTopology(graph, config),
    [graph, config],
  )
  const markerId = `token-preview-arrow-${variant}`
  const activeMarkerId = `token-preview-active-arrow-${variant}`
  const hasSpotlight = config.spotlight > 0
  const structurePath = [...topology.connectors, ...topology.buses]
    .map((geometry) => geometry.path)
    .join(' ')
  const branchesPath = topology.edges
    .flatMap((edge) => {
      const geometry = topology.geometries.get(wrappedEdgeKey(edge))
      return geometry ? [geometry.branchPath] : []
    })
    .join(' ')

  return (
    <svg
      viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
      width="100%"
      height={PREVIEW_HEIGHT}
      role="img"
      aria-label={`${variant} topology preview`}
    >
      <defs>
        <marker
          id={markerId}
          viewBox="0 0 4 4"
          refX="3.7"
          refY="2"
          markerWidth="3.5"
          markerHeight="3.5"
          markerUnits="userSpaceOnUse"
          orient="auto"
        >
          <path
            d="M 0 0 L 4 2 L 0 4 z"
            className="fill-primary"
            fillOpacity={0.4}
          />
        </marker>
        <marker
          id={activeMarkerId}
          viewBox="0 0 4 4"
          refX="3.7"
          refY="2"
          markerWidth="3.5"
          markerHeight="3.5"
          markerUnits="userSpaceOnUse"
          orient="auto"
        >
          <path d="M 0 0 L 4 2 L 0 4 z" className="fill-brand" />
        </marker>
      </defs>

      {structurePath && (
        <path
          d={structurePath}
          fill="none"
          className="stroke-primary"
          strokeOpacity={hasSpotlight ? 0.08 : 0.22}
          strokeWidth={0.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}

      {branchesPath && (
        <path
          d={branchesPath}
          fill="none"
          className="stroke-primary"
          strokeOpacity={hasSpotlight ? 0.08 : 0.24}
          strokeWidth={0.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          markerEnd={
            config.directionCues ? `url(#${activeMarkerId})` : undefined
          }
        />
      )}

      {hasSpotlight &&
        topology.edges.map((edge) => {
          const edgeKey = wrappedEdgeKey(edge)
          const geometry = topology.geometries.get(edgeKey)
          if (!geometry || !topology.prominentEdgeKeys.has(edgeKey)) return null
          return (
            <path
              key={`spotlight-${edgeKey}`}
              d={geometry.routePath}
              fill="none"
              className="stroke-brand"
              strokeOpacity={0.9}
              strokeWidth={1.1}
              strokeLinecap="round"
              strokeLinejoin="round"
              markerEnd={`url(#${activeMarkerId})`}
            />
          )
        })}

      {config.edgeBadges > 0 &&
        topology.edges.map((edge) => {
          const edgeKey = wrappedEdgeKey(edge)
          const geometry = topology.geometries.get(edgeKey)
          if (
            !geometry ||
            edge.bridges.length === 0 ||
            !topology.prominentEdgeKeys.has(edgeKey)
          ) {
            return null
          }
          return (
            <BridgeMark
              key={`bridge-${edgeKey}`}
              bridges={edge.bridges}
              x={geometry.badgeX}
              y={geometry.badgeY}
            />
          )
        })}

      {config.rootEmphasis &&
        topology.nodes.map((node) => {
          if (!topology.rootIds.has(node.id)) return null
          const point = topology.points.get(node.id)
          if (!point) return null
          return <RootHalo key={`root-${node.id}`} node={node} point={point} />
        })}

      {topology.nodes.map((node) => {
        const point = topology.points.get(node.id)
        if (!point) return null
        return <NodeMark key={node.id} node={node} point={point} />
      })}

      {config.clusterBadges &&
        topology.nodes.map((node) => {
          const point = topology.points.get(node.id)
          if (
            !point ||
            node.deployments.length < 2 ||
            node.bridges.length === 0
          ) {
            return null
          }
          const halfWidth =
            node.deployments.length > 1
              ? clusterMarkWidth(node) / 2
              : point.radius
          return (
            <BridgeMark
              key={`node-bridge-${node.id}`}
              bridges={node.bridges}
              x={point.x + halfWidth + 3}
              y={point.y - point.radius - 1}
            />
          )
        })}

      {config.minterCounts &&
        topology.nodes.map((node) => {
          const point = topology.points.get(node.id)
          const count = topology.minterCountByNode.get(node.id) ?? 0
          if (!point || count < 2) return null
          return (
            <MinterCountMark
              key={`minter-count-${node.id}`}
              node={node}
              point={point}
              count={count}
            />
          )
        })}
    </svg>
  )
}

function NodeMark({
  node,
  point,
}: {
  node: InteropTokenRelationsNode
  point: PreviewPoint
}) {
  const isGroup = node.deployments.length > 1
  const first = node.deployments[0]
  if (!first) return null

  if (isGroup) {
    const deployments = node.deployments
      .toSorted(byDeploymentVolume)
      .slice(0, 3)
    const metrics = getClusterMarkMetrics(node)
    const width = metrics.width
    const left = point.x - width / 2
    const contentLeft = point.x - metrics.contentWidth / 2
    return (
      <g>
        <title>{previewNodeTitle(node)}</title>
        <rect
          x={left}
          y={point.y - point.radius}
          width={width}
          height={point.radius * 2}
          rx={point.radius}
          className="fill-surface-primary stroke-brand"
          strokeWidth={1.2}
        />
        {deployments.map((deployment, index) => (
          <g key={`${deployment.chain}-${deployment.address}`}>
            <circle
              cx={
                contentLeft +
                metrics.iconDiameter / 2 +
                index * metrics.iconStep
              }
              cy={point.y}
              r={metrics.iconDiameter / 2}
              className="fill-surface-primary stroke-divider"
              strokeWidth={0.7}
            />
            {deployment.iconUrl && (
              <image
                href={deployment.iconUrl}
                x={
                  contentLeft +
                  metrics.iconDiameter / 2 +
                  index * metrics.iconStep -
                  metrics.logoSize / 2
                }
                y={point.y - metrics.logoSize / 2}
                width={metrics.logoSize}
                height={metrics.logoSize}
                preserveAspectRatio="xMidYMid meet"
              />
            )}
          </g>
        ))}
        <text
          x={
            contentLeft +
            metrics.iconStackWidth +
            metrics.contentGap +
            metrics.countSlotWidth / 2
          }
          y={point.y + 2.5}
          textAnchor="middle"
          className="fill-secondary font-bold"
          style={{ fontSize: 7 }}
        >
          {node.deployments.length}
        </text>
      </g>
    )
  }

  if (first.iconUrl) {
    const iconSize = point.radius * 1.35
    return (
      <g>
        <title>{previewNodeTitle(node)}</title>
        <circle
          cx={point.x}
          cy={point.y}
          r={point.radius}
          className="fill-surface-primary stroke-divider"
          strokeWidth={1}
        />
        <image
          href={first.iconUrl}
          x={point.x - iconSize / 2}
          y={point.y - iconSize / 2}
          width={iconSize}
          height={iconSize}
          preserveAspectRatio="xMidYMid meet"
        />
      </g>
    )
  }

  return (
    <g>
      <title>{previewNodeTitle(node)}</title>
      <circle
        cx={point.x}
        cy={point.y}
        r={point.radius}
        className="fill-brand stroke-brand"
        fillOpacity={isGroup ? 0.9 : 0.6}
        strokeWidth={1}
      />
      {isGroup && (
        <text
          x={point.x}
          y={point.y + 2.5}
          textAnchor="middle"
          className="fill-white font-bold"
          style={{ fontSize: 7 }}
        >
          {node.deployments.length}
        </text>
      )}
    </g>
  )
}

function RootHalo({
  node,
  point,
}: {
  node: InteropTokenRelationsNode
  point: PreviewPoint
}) {
  const isGroup = node.deployments.length > 1
  if (isGroup) {
    const width = clusterMarkWidth(node) + 6
    return (
      <g>
        <title>Backing source: {previewNodeTitle(node)}</title>
        <rect
          x={point.x - width / 2}
          y={point.y - point.radius - 3}
          width={width}
          height={point.radius * 2 + 6}
          rx={point.radius + 3}
          fill="none"
          className="stroke-brand"
          strokeOpacity={0.3}
          strokeWidth={0.9}
        />
      </g>
    )
  }

  return (
    <g>
      <title>Backing source: {previewNodeTitle(node)}</title>
      <circle
        cx={point.x}
        cy={point.y}
        r={point.radius + 3}
        fill="none"
        className="stroke-brand"
        strokeOpacity={0.3}
        strokeWidth={0.9}
      />
    </g>
  )
}

function MinterCountMark({
  node,
  point,
  count,
}: {
  node: InteropTokenRelationsNode
  point: PreviewPoint
  count: number
}) {
  const halfWidth =
    node.deployments.length > 1 ? clusterMarkWidth(node) / 2 : point.radius
  const x = point.x + halfWidth - 1
  const y = point.y - point.radius + 1
  const width = count > 9 ? 15 : 11

  return (
    <g>
      <title>{count} minter systems</title>
      <rect
        x={x - width / 2}
        y={y - 5.5}
        width={width}
        height={11}
        rx={5.5}
        className="fill-surface-primary stroke-brand"
        strokeWidth={1}
      />
      <text
        x={x}
        y={y + 2.5}
        textAnchor="middle"
        className="fill-brand font-bold"
        style={{ fontSize: 7 }}
      >
        {count}
      </text>
    </g>
  )
}

interface ClusterMarkMetrics {
  width: number
  contentWidth: number
  iconStackWidth: number
  iconDiameter: number
  iconStep: number
  logoSize: number
  contentGap: number
  countSlotWidth: number
}

function getClusterMarkMetrics(
  node: InteropTokenRelationsNode,
): ClusterMarkMetrics {
  const shown = Math.min(3, node.deployments.length)
  const iconDiameter = 8.5
  const iconStep = 6.5
  const logoSize = 6.25
  const iconStackWidth = iconDiameter + Math.max(0, shown - 1) * iconStep
  const contentGap = 3
  const countSlotWidth = String(node.deployments.length).length === 1 ? 5 : 9
  const contentWidth = iconStackWidth + contentGap + countSlotWidth
  return {
    width: contentWidth + 10,
    contentWidth,
    iconStackWidth,
    iconDiameter,
    iconStep,
    logoSize,
    contentGap,
    countSlotWidth,
  }
}

function clusterMarkWidth(node: InteropTokenRelationsNode): number {
  return getClusterMarkMetrics(node).width
}

function BridgeMark({
  bridges,
  x,
  y,
}: {
  bridges: InteropTokenRelationsEdge['bridges']
  x: number
  y: number
}) {
  const shown = bridges.slice(0, 2)
  const width = 10 + Math.max(0, shown.length - 1) * 6
  return (
    <g transform={`translate(${x - width / 2}, ${y - 5})`}>
      <title>{bridges.map((bridge) => bridge.name).join(', ')}</title>
      <rect
        x={-2}
        y={-2}
        width={width + 4}
        height={14}
        rx={7}
        className="fill-surface-primary stroke-divider"
        strokeWidth={0.7}
      />
      {shown.map((bridge, index) => (
        <image
          key={bridge.id}
          href={bridge.icon}
          x={index * 6}
          width={10}
          height={10}
          preserveAspectRatio="xMidYMid meet"
        />
      ))}
    </g>
  )
}

function buildCompactTopology(
  graph: InteropTokenRelationsGraph,
  config: TopologyConfig,
): CompactTopology {
  const unconnected = new Set(graph.unconnectedNodeIds)
  const nodes = graph.nodes.filter((node) => !unconnected.has(node.id))
  const ids = new Set(nodes.map((node) => node.id))
  const edges = graph.edges.filter(
    (edge) => ids.has(edge.from) && ids.has(edge.to),
  )
  const heights = new Map(
    nodes.map((node) => [node.id, getRelationsNodeHeight(node)]),
  )
  const widths = new Map(
    nodes.map((node) => [node.id, getRelationsNodeWidth(node)]),
  )
  const full = layoutWrappedRelationsGraph(nodes, edges, [], heights, widths)

  const rows = new Map<number, InteropTokenRelationsNode[]>()
  for (const node of nodes) {
    const row = full.rowOf.get(node.id) ?? 0
    rows.set(row, [...(rows.get(row) ?? []), node])
  }
  const rowNumbers = [...rows.keys()].toSorted((a, b) => a - b)
  const compactRowOf = new Map(rowNumbers.map((row, index) => [row, index]))
  const lastRow = Math.max(0, rowNumbers.length - 1)
  const points = new Map<string, PreviewPoint>()

  for (const rowNumber of rowNumbers) {
    const row = (rows.get(rowNumber) ?? []).toSorted(
      (a, b) =>
        (full.boxes.get(a.id)?.x ?? 0) - (full.boxes.get(b.id)?.x ?? 0) ||
        a.id.localeCompare(b.id),
    )
    const desired = row.map((node) => {
      const box = full.boxes.get(node.id)
      const centre = box ? box.x + box.width / 2 : full.width / 2
      return (
        CANVAS_X_PADDING +
        (centre / Math.max(1, full.width)) *
          (CANVAS_WIDTH - CANVAS_X_PADDING * 2)
      )
    })
    const xs = spreadRow(desired)
    const rowIndex = compactRowOf.get(rowNumber) ?? 0
    const y =
      lastRow === 0
        ? CANVAS_HEIGHT / 2
        : CANVAS_Y_PADDING +
          (rowIndex / lastRow) * (CANVAS_HEIGHT - CANVAS_Y_PADDING * 2)
    row.forEach((node, index) => {
      points.set(node.id, {
        x: xs[index] ?? CANVAS_WIDTH / 2,
        y,
        radius: NODE_RADIUS,
        row: rowIndex,
      })
    })
  }

  const routing = buildCompactRouting(edges, points)

  const nodesById = new Map(nodes.map((node) => [node.id, node]))
  const prominentCount = Math.max(config.edgeBadges, config.spotlight)
  const prominentEdgeKeys = new Set(
    edges
      .filter((edge) => edge.bridges.length > 0)
      .toSorted(
        (a, b) =>
          (nodesById.get(b.to)?.volume ?? -1) -
            (nodesById.get(a.to)?.volume ?? -1) ||
          wrappedEdgeKey(a).localeCompare(wrappedEdgeKey(b)),
      )
      .slice(0, prominentCount)
      .map(wrappedEdgeKey),
  )
  const incomingNodeIds = new Set(edges.map((edge) => edge.to))
  const rootIds = new Set(
    nodes
      .filter((node) => !incomingNodeIds.has(node.id))
      .map((node) => node.id),
  )
  const minterIdsByNode = new Map(
    nodes.map((node) => [
      node.id,
      new Set(node.bridges.map((bridge) => bridge.id)),
    ]),
  )
  for (const edge of edges) {
    const minterIds = minterIdsByNode.get(edge.to)
    for (const bridge of edge.bridges) minterIds?.add(bridge.id)
  }
  const minterCountByNode = new Map(
    [...minterIdsByNode].map(([nodeId, minterIds]) => [nodeId, minterIds.size]),
  )

  return {
    nodes,
    edges,
    points,
    connectors: routing.connectors,
    buses: routing.buses,
    geometries: routing.geometries,
    prominentEdgeKeys,
    rootIds,
    minterCountByNode,
  }
}

function spreadRow(desired: number[]): number[] {
  if (desired.length <= 1) return desired
  const available = CANVAS_WIDTH - CANVAS_X_PADDING * 2
  const gap = Math.min(28, available / (desired.length - 1))
  const result = [...desired]
  for (let index = 1; index < result.length; index++) {
    result[index] = Math.max(result[index] ?? 0, (result[index - 1] ?? 0) + gap)
  }
  const overflow = (result.at(-1) ?? 0) - (CANVAS_WIDTH - CANVAS_X_PADDING)
  if (overflow > 0) {
    for (let index = 0; index < result.length; index++) {
      result[index] = (result[index] ?? 0) - overflow
    }
  }
  for (let index = result.length - 2; index >= 0; index--) {
    result[index] = Math.min(result[index] ?? 0, (result[index + 1] ?? 0) - gap)
  }
  const underflow = CANVAS_X_PADDING - (result[0] ?? 0)
  if (underflow > 0) {
    for (let index = 0; index < result.length; index++) {
      result[index] = (result[index] ?? 0) + underflow
    }
  }
  return result
}

interface CompactRouting {
  connectors: PreviewPathGeometry[]
  buses: PreviewPathGeometry[]
  geometries: Map<string, PreviewEdgeGeometry>
}

interface TargetRowGroup {
  row: number
  busY: number
  edges: InteropTokenRelationsEdge[]
}

function buildCompactRouting(
  edges: InteropTokenRelationsEdge[],
  points: ReadonlyMap<string, PreviewPoint>,
): CompactRouting {
  const outgoing = new Map<string, InteropTokenRelationsEdge[]>()
  for (const edge of edges) {
    outgoing.set(edge.from, [...(outgoing.get(edge.from) ?? []), edge])
  }

  const connectors: PreviewPathGeometry[] = []
  const buses: PreviewPathGeometry[] = []
  const geometries = new Map<string, PreviewEdgeGeometry>()
  const sourceIds = [...outgoing.keys()].toSorted()

  sourceIds.forEach((sourceId, sourceLane) => {
    const from = points.get(sourceId)
    if (!from) return
    const sourceEdges = outgoing.get(sourceId) ?? []
    const startY = from.y + from.radius + LINE_NODE_GAP
    const edgesByRow = new Map<number, InteropTokenRelationsEdge[]>()
    for (const edge of sourceEdges) {
      const target = points.get(edge.to)
      if (!target) continue
      edgesByRow.set(target.row, [...(edgesByRow.get(target.row) ?? []), edge])
    }

    const groups: TargetRowGroup[] = [...edgesByRow]
      .toSorted(([a], [b]) => a - b)
      .map(([row, rowEdges]) => {
        const nearestTargetY = Math.min(
          ...rowEdges.map((edge) => {
            const target = points.get(edge.to)
            return target
              ? target.y - target.radius - LINE_NODE_GAP
              : CANVAS_HEIGHT
          }),
        )
        const available = Math.max(0, nearestTargetY - startY)
        const clearance = Math.max(3, Math.min(6, available * 0.3))
        return {
          row,
          busY:
            available > 5 ? nearestTargetY - clearance : startY + available / 2,
          edges: rowEdges,
        }
      })

    const adjacent = groups.find((group) => group.row === from.row + 1)
    const deep = groups.filter((group) => group !== adjacent)
    const connectorParts: string[] = []
    if (adjacent) {
      connectorParts.push(`M ${from.x} ${startY} V ${adjacent.busY}`)
    }

    let laneX: number | undefined
    let departureY: number | undefined
    if (deep.length > 0) {
      laneX = getCompactSideLane(from, deep, points, sourceLane)
      const firstBusY = Math.min(...deep.map((group) => group.busY))
      const deepestBusY = Math.max(...deep.map((group) => group.busY))
      const connectorLimit = adjacent
        ? Math.min(adjacent.busY, firstBusY)
        : firstBusY
      departureY =
        startY +
        Math.max(1.5, Math.min(4, Math.max(0, connectorLimit - startY) / 2))
      connectorParts.push(
        adjacent
          ? `M ${from.x} ${departureY} H ${laneX} V ${deepestBusY}`
          : `M ${from.x} ${startY} V ${departureY} H ${laneX} V ${deepestBusY}`,
      )
    }

    if (connectorParts.length > 0) {
      connectors.push({
        key: `connector-${sourceId}`,
        path: connectorParts.join(' '),
      })
    }

    for (const group of groups) {
      const isAdjacent = group === adjacent
      const anchorX = isAdjacent ? from.x : laneX
      if (anchorX === undefined) continue
      const targetXs = group.edges.flatMap((edge) => {
        const target = points.get(edge.to)
        return target ? [target.x] : []
      })
      const minX = Math.min(anchorX, ...targetXs)
      const maxX = Math.max(anchorX, ...targetXs)
      if (maxX - minX > 0.5) {
        buses.push({
          key: `bus-${sourceId}-${group.row}`,
          path: `M ${minX} ${group.busY} H ${maxX}`,
        })
      }

      for (const edge of group.edges) {
        const target = points.get(edge.to)
        if (!target) continue
        const endY = target.y - target.radius - LINE_NODE_GAP
        const routePath = isAdjacent
          ? `M ${from.x} ${startY} V ${group.busY} H ${target.x} V ${endY}`
          : `M ${from.x} ${startY} V ${departureY} H ${laneX} V ${group.busY} H ${target.x} V ${endY}`
        geometries.set(wrappedEdgeKey(edge), {
          routePath,
          branchPath: `M ${target.x} ${group.busY} V ${endY}`,
          badgeX: target.x,
          badgeY: group.busY,
        })
      }
    }
  })

  return { connectors, buses, geometries }
}

function getCompactSideLane(
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
    from.x - from.radius,
    ...traversed.map((point) => point.x - point.radius),
  )
  const rightBoundary = Math.max(
    from.x + from.radius,
    ...traversed.map((point) => point.x + point.radius),
  )
  const laneGap = 7 + sourceLane * 1.5
  const left = Math.max(3, leftBoundary - laneGap)
  const right = Math.min(CANVAS_WIDTH - 3, rightBoundary + laneGap)
  const targetXs = groups.flatMap((group) =>
    group.edges.flatMap((edge) => {
      const target = points.get(edge.to)
      return target ? [target.x] : []
    }),
  )
  const targetCentre =
    targetXs.reduce((sum, targetX) => sum + targetX, 0) /
    Math.max(1, targetXs.length)
  const leftDistance = Math.abs(from.x - left) + Math.abs(targetCentre - left)
  const rightDistance =
    Math.abs(from.x - right) + Math.abs(targetCentre - right)
  return leftDistance <= rightDistance ? left : right
}

function byDeploymentVolume(
  a: InteropTokenRelationsNode['deployments'][number],
  b: InteropTokenRelationsNode['deployments'][number],
) {
  return (b.volume ?? -1) - (a.volume ?? -1) || a.chain.localeCompare(b.chain)
}

function previewNodeTitle(node: InteropTokenRelationsNode): string {
  if (node.deployments.length > 1) {
    return `Burn-mint set: ${node.deployments.map((deployment) => deployment.chainName).join(', ')}`
  }
  return node.deployments[0]?.chainName ?? 'Unknown deployment'
}
