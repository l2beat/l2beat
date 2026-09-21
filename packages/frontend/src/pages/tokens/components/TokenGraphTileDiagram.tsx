import { useMemo } from 'react'
import type { TokenGraphTile } from '~/server/features/tokens/buildTokenGraphTiles'
import {
  BASE_RADIUS,
  buildPreview,
  getClusterMetrics,
  MAX_CLUSTER_ICONS,
  type Mark,
  VIEW_HEIGHT,
  VIEW_WIDTH,
} from './tilePreviewLayout'

const NODE_STROKE_WIDTH = 1
const EDGE_STROKE_WIDTH = 0.8

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
          strokeWidth={EDGE_STROKE_WIDTH}
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

  if (node.chains.length > 1) {
    const metrics = getClusterMetrics(node, radius)
    const shown = node.chains.slice(0, MAX_CLUSTER_ICONS)
    const remaining = node.chains.length - shown.length
    const contentLeft = x - metrics.contentWidth / 2
    return (
      <g>
        <title>Burn & mint across {node.chains.length} chains</title>
        <rect
          x={x - metrics.width / 2}
          y={y - radius}
          width={metrics.width}
          height={radius * 2}
          rx={radius}
          className="fill-surface-primary stroke-brand"
          strokeWidth={NODE_STROKE_WIDTH}
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
      <ChainMark iconUrl={chain?.iconUrl} x={x} y={y} radius={radius} />
    </g>
  )
}

function ChainMark({
  iconUrl,
  x,
  y,
  radius,
}: {
  iconUrl: string | undefined
  x: number
  y: number
  radius: number
}) {
  const iconSize = radius * 1.4
  return (
    <>
      <circle
        cx={x}
        cy={y}
        r={radius}
        className="fill-surface-primary stroke-divider"
        strokeWidth={NODE_STROKE_WIDTH}
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

export function TokenGraphTilesLegend() {
  const radius = BASE_RADIUS * 1.5
  const pill = getClusterMetrics(
    { id: '', volume: null, chains: [{ id: '', iconUrl: undefined }] },
    radius,
  )
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-label-value-13 text-secondary">
      <span className="flex items-center gap-2">
        <svg width={radius * 2 + 2} height={radius * 2 + 2} aria-hidden>
          <ChainMark
            iconUrl={undefined}
            x={radius + 1}
            y={radius + 1}
            radius={radius}
          />
        </svg>
        Deployment
      </span>
      <span className="flex items-center gap-2">
        <svg width={pill.width + 2} height={radius * 2 + 2} aria-hidden>
          <rect
            x={1}
            y={1}
            width={pill.width}
            height={radius * 2}
            rx={radius}
            className="fill-surface-primary stroke-brand"
            strokeWidth={NODE_STROKE_WIDTH}
          />
          <ChainMark
            iconUrl={undefined}
            x={1 + pill.width / 2}
            y={radius + 1}
            radius={pill.iconDiameter / 2}
          />
        </svg>
        Burn & mint cluster
      </span>
      <span className="flex items-center gap-2">
        <svg width="8" height="22" aria-hidden>
          <path
            d="M 4 1 V 21"
            fill="none"
            className="stroke-primary/25"
            strokeWidth={EDGE_STROKE_WIDTH * 1.5}
            strokeLinecap="round"
          />
        </svg>
        Backs the deployment below
      </span>
    </div>
  )
}
