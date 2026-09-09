import { useMemo } from 'react'
import type { TokenGraphTile } from '~/server/features/tokens/buildTokenGraphTiles'
import {
  BASE_RADIUS,
  buildPreview,
  getClusterMetrics,
  MAX_CLUSTER_ICONS,
  type Mark,
  SOURCE_RING_GAP,
  VIEW_HEIGHT,
  VIEW_WIDTH,
} from './tilePreviewLayout'

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
