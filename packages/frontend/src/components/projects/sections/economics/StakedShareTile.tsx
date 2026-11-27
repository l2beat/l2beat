import { scaleLinear } from 'd3-scale'
import { area, line } from 'd3-shape'
import { useId, useState } from 'react'
import type { EthSupplyOverview } from '~/server/features/eth-supply/types'
import { formatTimestamp } from '~/utils/dates'
import { COLORS, nearestIndex } from './chart'
import { formatEthShort, formatShare } from './format'
import {
  Figure,
  HoverTip,
  Tile,
  TileTitle,
  TipRow,
  TipTitle,
  useChartSize,
} from './ui'

/** The chart's floor; it grows into whatever height the row gives the tile. */
const MIN_HEIGHT = 64

type Point = { timestamp: number; share: number }

/** The share of the supply that is staked, over the selected range. */
export function StakedShareTile({
  staking,
  from,
  supply,
  rangeLabel,
}: {
  staking: EthSupplyOverview['staking']
  /** The range's first day */
  from: number
  /** On the last day with supply data, which the history ends on too */
  supply: number
  rangeLabel: string
}) {
  const id = useId()
  const [ref, { width, height, svg }] = useChartSize(MIN_HEIGHT, 280)
  const [hover, setHover] = useState<number | null>(null)
  const points = (staking?.stakedShareHistory ?? []).filter(
    (p) => p.timestamp >= from,
  )
  const first = points[0]
  const latest = points.at(-1)

  if (!staking || !first || !latest) {
    return (
      <Tile area="share" label="Share of supply staked">
        <TileTitle meta={rangeLabel}>Share of supply staked</TileTitle>
        <div className="font-medium text-label-value-14 text-secondary">
          No staking data
        </div>
      </Tile>
    )
  }

  const values = points.map((p) => p.share)
  const lo = Math.min(...values)
  const hi = Math.max(...values)
  const pad = (hi - lo) * 0.1 || 0.001
  const x = scaleLinear()
    .domain([first.timestamp, latest.timestamp])
    .range([1, width - 6])
  const y = scaleLinear()
    .domain([lo - pad, hi + pad])
    .range([height - 2, 6])
  const linePath = line<Point>()
    .x((p) => x(p.timestamp))
    .y((p) => y(p.share))(points)
  const areaPath = area<Point>()
    .x((p) => x(p.timestamp))
    .y0(height)
    .y1((p) => y(p.share))(points)
  const change = latest.share - first.share
  const hovered = hover !== null ? points[hover] : undefined

  return (
    <Tile area="share" label="Share of supply staked">
      <TileTitle meta={rangeLabel}>Share of supply staked</TileTitle>
      <Figure
        value={formatShare(latest.share)}
        after={
          <span className="font-medium text-label-value-14 tabular-nums">
            {formatPoints(change)}
          </span>
        }
        sub={`${formatEthShort(latest.share * supply)} of ${formatEthShort(supply)} ETH`}
      />
      <div
        ref={ref}
        className="relative flex-1"
        style={{ minHeight: MIN_HEIGHT }}
      >
        <svg
          {...svg}
          role="img"
          aria-label={`Share of supply staked, ${formatShare(first.share)} on ${formatTimestamp(first.timestamp)} to ${formatShare(latest.share)}`}
          className="absolute inset-0 block touch-pan-y overflow-visible"
          onPointerMove={(e) => {
            const box = e.currentTarget.getBoundingClientRect()
            setHover(
              nearestIndex(
                points,
                x.invert(e.clientX - box.left),
                (p) => p.timestamp,
              ),
            )
          }}
          onPointerLeave={() => setHover(null)}
        >
          <defs>
            <linearGradient id={`${id}-fade`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor={COLORS.staked} stopOpacity={0.22} />
              <stop offset="1" stopColor={COLORS.staked} stopOpacity={0} />
            </linearGradient>
          </defs>
          <path d={areaPath ?? undefined} fill={`url(#${id}-fade)`} />
          <path
            d={linePath ?? undefined}
            fill="none"
            stroke={COLORS.staked}
            strokeWidth={2}
            strokeLinejoin="round"
          />
          <circle
            cx={x(latest.timestamp)}
            cy={y(latest.share)}
            r={4}
            fill={COLORS.staked}
            stroke="var(--surface-primary)"
            strokeWidth={2}
          />
          {hovered && (
            <g pointerEvents="none">
              <line
                x1={x(hovered.timestamp)}
                x2={x(hovered.timestamp)}
                y1={0}
                y2={height}
                stroke="var(--secondary)"
              />
              <circle
                cx={x(hovered.timestamp)}
                cy={y(hovered.share)}
                r={4}
                fill={COLORS.staked}
                stroke="var(--surface-primary)"
                strokeWidth={2}
              />
            </g>
          )}
        </svg>
        {hovered && (
          <HoverTip
            x={x(hovered.timestamp)}
            y={height / 2}
            width={width}
            contained
          >
            <TipTitle>{formatTimestamp(hovered.timestamp)}</TipTitle>
            <TipRow
              color={COLORS.staked}
              line
              label="Staked"
              value={formatShare(hovered.share)}
            />
          </HoverTip>
        )}
      </div>
    </Tile>
  )
}

/** A change between two shares, in percentage points: +12.3 pp */
function formatPoints(value: number): string {
  const sign = value > 0 ? '+' : value < 0 ? '−' : ''
  return `${sign}${Math.abs(value * 100).toFixed(1)} pp`
}
