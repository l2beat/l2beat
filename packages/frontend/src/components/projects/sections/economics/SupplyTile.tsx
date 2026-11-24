import { scaleLinear } from 'd3-scale'
import { line } from 'd3-shape'
import { useMemo, useState } from 'react'
import type { EthSupplyDay } from '~/server/features/eth-supply/types'
import { cn } from '~/utils/cn'
import { formatTimestamp } from '~/utils/dates'
import { COLORS, nearestIndex, placeLabels, timeTicks } from './chart'
import {
  type EconomicsRange,
  rangeLabel,
  UPGRADES,
  type WindowSummary,
} from './economics'
import {
  formatEth,
  formatEthShort,
  formatMonthYear,
  formatSignedEth,
  formatSignedShare,
} from './format'
import {
  Figure,
  HoverTip,
  Key,
  Legend,
  Tile,
  TileTitle,
  TipRow,
  TipTitle,
  TYPE,
  useChartSize,
} from './ui'

/** The chart's floor; it grows into whatever height the row gives the tile. */
const MIN_HEIGHT = 200
const PAD = { top: 22, right: 10, bottom: 24, left: 46 }

export function SupplyTile({
  days,
  windowDays,
  summary,
  summary30d,
  range,
}: {
  days: EthSupplyDay[]
  windowDays: EthSupplyDay[]
  summary: WindowSummary
  summary30d: WindowSummary
  range: EconomicsRange
}) {
  const last = days.at(-1)
  if (!last) return null

  return (
    <Tile area="hero" label="Total supply" className="gap-5">
      <div className="flex @md:flex-row flex-col @md:items-start @md:justify-between gap-5">
        <div className="flex min-w-0 flex-col gap-4">
          <TileTitle>Total supply</TileTitle>
          <div>
            <div className="flex items-baseline gap-2 whitespace-nowrap">
              <span className={TYPE.hero}>{formatEth(last.totalSupply)}</span>
              <span className={cn(TYPE.unit, '@xl:text-label-value-16')}>
                ETH
              </span>
            </div>
            <div className={cn(TYPE.label, 'mt-2.5')}>
              End of {formatTimestamp(last.timestamp)} UTC
            </div>
          </div>
        </div>
        <div className="grid @md:grid-cols-1 grid-cols-2 gap-x-6 @md:gap-y-4 @md:text-right">
          <Figure
            label="Net issuance, 30 days"
            value={formatSignedShare(summary30d.annualizedRate)}
            unit="/ yr"
            className="@md:[&>div]:justify-end"
          />
          {range !== '30d' && (
            <Figure
              label={`Net issuance, ${rangeLabel(range, days)}`}
              value={formatSignedShare(summary.annualizedRate)}
              unit="/ yr"
              className="@md:[&>div]:justify-end"
            />
          )}
        </div>
      </div>
      <SupplyChart days={windowDays} />
    </Tile>
  )
}

function SupplyChart({ days }: { days: EthSupplyDay[] }) {
  const [ref, { width, height }] = useChartSize(MIN_HEIGHT, 600)
  const [hover, setHover] = useState<number | null>(null)

  const g = useMemo(() => {
    const first = days[0]
    const last = days.at(-1)
    if (!first || !last) return undefined
    let lo = first
    let hi = first
    for (const p of days) {
      if (p.totalSupply < lo.totalSupply) lo = p
      if (p.totalSupply > hi.totalSupply) hi = p
    }
    const pad = (hi.totalSupply - lo.totalSupply) * 0.14 || 1000
    const x = scaleLinear()
      .domain([first.timestamp, last.timestamp])
      .range([PAD.left, width - PAD.right])
    const y = scaleLinear()
      .domain([lo.totalSupply - pad, hi.totalSupply + pad])
      .range([height - PAD.bottom, PAD.top])
      .nice(4)
    const path = line<EthSupplyDay>()
      .x((p) => x(p.timestamp))
      .y((p) => y(p.totalSupply))(days)
    const ticks = y.ticks(4)
    const step = (ticks[1] ?? 1e6) - (ticks[0] ?? 0)
    return {
      x,
      y,
      path,
      lo,
      hi,
      ticks,
      tickDecimals: Math.max(1, Math.ceil(-Math.log10(step / 1e6))),
      xTicks: timeTicks(first.timestamp, last.timestamp, width < 480 ? 3 : 6),
    }
  }, [days, width, height])

  if (!g) return null
  const { x, y } = g
  const first = days[0]
  const lastPoint = days.at(-1)
  const hovered = hover !== null ? days[hover] : undefined
  const upgrades = placeLabels(
    UPGRADES.filter(
      (m) =>
        m.timestamp >= (first?.timestamp ?? 0) &&
        m.timestamp <= (lastPoint?.timestamp ?? 0),
    ),
    (m) => x(m.timestamp),
    width - PAD.right,
    6,
  )

  return (
    <div className="flex flex-1 flex-col gap-3">
      <div
        ref={ref}
        className="relative flex-1"
        style={{ minHeight: MIN_HEIGHT }}
      >
        <svg
          width={width}
          height={height}
          role="img"
          aria-label="Total supply over the selected range"
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
          {g.ticks.map((t) => (
            <g key={t}>
              <line
                x1={PAD.left}
                x2={width - PAD.right}
                y1={y(t)}
                y2={y(t)}
                stroke="var(--chart-grid)"
                strokeOpacity={0.5}
              />
              <text
                x={PAD.left - 8}
                y={y(t)}
                dy="0.32em"
                textAnchor="end"
                className={TYPE.axis}
              >
                {(t / 1e6).toFixed(g.tickDecimals)}M
              </text>
            </g>
          ))}
          {g.xTicks.map((t) => (
            <text
              key={t.timestamp}
              x={x(t.timestamp)}
              y={height - 6}
              textAnchor={
                x(t.timestamp) > width - 30
                  ? 'end'
                  : x(t.timestamp) < PAD.left + 20
                    ? 'start'
                    : 'middle'
              }
              className={TYPE.axis}
            >
              {t.label}
            </text>
          ))}
          {upgrades.map((m) => (
            <g key={m.name}>
              <line
                x1={m.x}
                x2={m.x}
                y1={PAD.top - 14}
                y2={height - PAD.bottom}
                stroke="var(--secondary)"
                strokeOpacity={0.35}
                strokeDasharray="2 3"
              />
              {m.showLabel && (
                <text
                  x={m.x + 5}
                  y={PAD.top - 14}
                  dy="0.75em"
                  className={cn(TYPE.axis, 'font-medium')}
                >
                  {m.name}
                </text>
              )}
            </g>
          ))}
          {g.path && (
            <>
              <path
                d={g.path}
                fill="none"
                stroke={COLORS.issuance}
                strokeOpacity={0.16}
                strokeWidth={8}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              <path
                d={g.path}
                fill="none"
                stroke={COLORS.issuance}
                strokeWidth={2}
                strokeLinejoin="round"
              />
            </>
          )}
          {[g.hi, g.lo].map((p, i) =>
            p !== lastPoint ? (
              <ExtremeLabel
                key={i}
                x={x(p.timestamp)}
                y={y(p.totalSupply)}
                below={i === 1}
                width={width}
                text={`${i === 0 ? 'High' : 'Low'} ${formatEthShort(p.totalSupply)} · ${formatMonthYear(p.timestamp)}`}
              />
            ) : null,
          )}
          {lastPoint && (
            <g>
              <circle
                cx={x(lastPoint.timestamp)}
                cy={y(lastPoint.totalSupply)}
                r={9}
                fill={COLORS.issuance}
                className="economics-ping"
                style={{
                  transformOrigin: `${x(lastPoint.timestamp)}px ${y(lastPoint.totalSupply)}px`,
                }}
              />
              <circle
                cx={x(lastPoint.timestamp)}
                cy={y(lastPoint.totalSupply)}
                r={4.5}
                fill={COLORS.issuance}
                stroke="var(--surface-primary)"
                strokeWidth={2}
              />
            </g>
          )}
          {hovered && (
            <g pointerEvents="none">
              <line
                x1={x(hovered.timestamp)}
                x2={x(hovered.timestamp)}
                y1={PAD.top}
                y2={height - PAD.bottom}
                stroke="var(--secondary)"
              />
              <circle
                cx={x(hovered.timestamp)}
                cy={y(hovered.totalSupply)}
                r={4}
                fill={COLORS.issuance}
                stroke="var(--surface-primary)"
                strokeWidth={2}
              />
            </g>
          )}
        </svg>
        {hovered && (
          <HoverTip
            x={x(hovered.timestamp)}
            y={y(hovered.totalSupply)}
            width={width}
          >
            <TipTitle>{formatTimestamp(hovered.timestamp)}</TipTitle>
            <TipRow
              color={COLORS.issuance}
              line
              label="Total supply"
              value={`${formatEth(hovered.totalSupply)} ETH`}
            />
            <TipRow
              label="Net that day"
              value={`${formatSignedEth(hovered.issuance - hovered.burn)} ETH`}
            />
          </HoverTip>
        )}
      </div>
      <Legend>
        <Key color={COLORS.issuance} line label="Total supply" />
        <Key color="var(--secondary)" line dashed label="Network upgrade" />
      </Legend>
    </div>
  )
}

function ExtremeLabel({
  x,
  y,
  below,
  width,
  text,
}: {
  x: number
  y: number
  below: boolean
  width: number
  text: string
}) {
  const anchor = x < PAD.left + 80 ? 'start' : x > width - 90 ? 'end' : 'middle'
  return (
    <g pointerEvents="none">
      <circle
        cx={x}
        cy={y}
        r={3}
        fill="var(--surface-primary)"
        stroke="var(--primary)"
        strokeWidth={1.5}
      />
      <text
        x={x}
        y={below ? y + 16 : y - 10}
        textAnchor={anchor}
        className="fill-primary font-medium text-[11px] tabular-nums"
        paintOrder="stroke"
        stroke="var(--surface-primary)"
        strokeWidth={3}
      >
        {text}
      </text>
    </g>
  )
}
