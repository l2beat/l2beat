import { formatCurrency } from '@l2beat/shared-pure'
import { scaleLinear } from 'd3-scale'
import { area, line } from 'd3-shape'
import { useId, useState } from 'react'
import type { EthSupplyDay } from '~/server/features/eth-supply/types'
import { formatTimestamp } from '~/utils/dates'
import { COLORS, nearestIndex, nonNullRuns } from './chart'
import { formatSignedShare, formatUsdPrice } from './format'
import {
  Figure,
  HoverTip,
  Tile,
  TileTitle,
  TipRow,
  TipTitle,
  TYPE,
  useChartSize,
} from './ui'

/** The sparkline's floor; it grows into whatever height the row gives the tile. */
const MIN_HEIGHT = 48

type Run = { item: EthSupplyDay; value: number }[]

/** The latest price and market cap over a sparkline of the window. */
export function PriceTile({
  days,
  rangeLabel,
}: {
  days: EthSupplyDay[]
  rangeLabel: string
}) {
  const id = useId()
  const [ref, { width, height }] = useChartSize(MIN_HEIGHT, 280)
  const [hover, setHover] = useState<number | null>(null)
  const priced = days.filter((p) => p.ethPriceUsd !== null)
  const latest = priced.at(-1)
  const first = priced[0]

  if (!latest || !first || latest.ethPriceUsd === null) {
    return (
      <Tile area="price" label="ETH price">
        <TileTitle meta={rangeLabel}>ETH price</TileTitle>
        <div className="font-medium text-label-value-14 text-secondary">
          No price data
        </div>
      </Tile>
    )
  }

  const price = latest.ethPriceUsd
  const values = priced.map((p) => p.ethPriceUsd ?? 0)
  const lo = Math.min(...values)
  const hi = Math.max(...values)
  const change = first.ethPriceUsd ? price / first.ethPriceUsd - 1 : null
  const x = scaleLinear()
    .domain([days[0]?.timestamp ?? 0, days.at(-1)?.timestamp ?? 1])
    .range([1, width - 6])
  const y = scaleLinear()
    .domain([lo, hi])
    .range([height - 2, 6])
  const runs = nonNullRuns(days, (p) => p.ethPriceUsd)
  const linePath = line<Run[number]>()
    .x((d) => x(d.item.timestamp))
    .y((d) => y(d.value))
  const areaPath = area<Run[number]>()
    .x((d) => x(d.item.timestamp))
    .y0(height)
    .y1((d) => y(d.value))
  const hovered = hover !== null ? days[hover] : undefined

  return (
    <Tile area="price" label="ETH price">
      <TileTitle meta={rangeLabel}>ETH price</TileTitle>
      <Figure
        value={formatUsdPrice(price)}
        after={
          change !== null ? (
            <span className={TYPE.value}>{formatSignedShare(change, 1)}</span>
          ) : undefined
        }
        sub={`${formatCurrency(price * latest.totalSupply, 'usd')} market cap`}
      />
      <div
        ref={ref}
        className="relative flex-1"
        style={{ minHeight: MIN_HEIGHT }}
      >
        <svg
          width={width}
          height={height}
          role="img"
          aria-label={`ETH price, ${rangeLabel}`}
          className="absolute inset-0 block touch-pan-y overflow-visible"
          onPointerMove={(e) => {
            const box = e.currentTarget.getBoundingClientRect()
            setHover(
              nearestIndex(
                days,
                x.invert(e.clientX - box.left),
                (p) => p.timestamp,
              ),
            )
          }}
          onPointerLeave={() => setHover(null)}
        >
          <defs>
            <linearGradient id={`${id}-fade`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor={COLORS.price} stopOpacity={0.22} />
              <stop offset="1" stopColor={COLORS.price} stopOpacity={0} />
            </linearGradient>
          </defs>
          {runs.map((run, i) => (
            <g key={i}>
              <path d={areaPath(run) ?? undefined} fill={`url(#${id}-fade)`} />
              <path
                d={linePath(run) ?? undefined}
                fill="none"
                stroke={COLORS.price}
                strokeWidth={2}
                strokeLinejoin="round"
              />
            </g>
          ))}
          <circle
            cx={x(latest.timestamp)}
            cy={y(price)}
            r={4}
            fill={COLORS.price}
            stroke="var(--surface-primary)"
            strokeWidth={2}
          />
          {hovered && hovered.ethPriceUsd !== null && (
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
                cy={y(hovered.ethPriceUsd)}
                r={4}
                fill={COLORS.price}
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
              color={COLORS.price}
              line
              label="ETH price"
              value={
                hovered.ethPriceUsd !== null
                  ? formatUsdPrice(hovered.ethPriceUsd)
                  : 'No data'
              }
            />
          </HoverTip>
        )}
      </div>
    </Tile>
  )
}
