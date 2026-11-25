import { scaleLinear } from 'd3-scale'
import { line } from 'd3-shape'
import { useMemo, useState } from 'react'
import { formatRange, formatTimestamp } from '~/utils/dates'
import { COLORS, nearestIndex, timeTicks } from './chart'
import type { FlowRow } from './economics'
import { formatEth, formatSignedEth } from './format'
import {
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
const MIN_HEIGHT = 260
const PAD = { top: 6, bottom: 24, left: 46 }

/**
 * Issuance stands above the zero line and the burn hangs below it, one
 * column per day (week beyond 120 days), with the net as a line through
 * them.
 */
export function FlowsTile({
  rows,
  rangeLabel,
}: {
  rows: FlowRow[]
  rangeLabel: string
}) {
  const [ref, { width, height, svg }] = useChartSize(MIN_HEIGHT, 600)
  const [hover, setHover] = useState<number | null>(null)
  const weekly = (rows[1]?.days ?? 1) > 1

  const g = useMemo(() => {
    const maxUp = Math.max(...rows.map((r) => r.issuance), 1)
    const maxDown = Math.max(...rows.map((r) => r.burn), 1)
    const y = scaleLinear()
      .domain([-maxDown * 1.04, maxUp * 1.04])
      .range([height - PAD.bottom, PAD.top])
    const step = (width - PAD.left) / Math.max(rows.length, 1)
    const xOf = (i: number) => PAD.left + i * step
    const net = line<FlowRow>()
      .x((_, i) => xOf(i) + step / 2)
      .y((r) => y(r.net))
    return { y, step, xOf, netPath: net(rows), ticks: y.ticks(5) }
  }, [rows, width, height])

  const { y, step, xOf } = g
  const barWidth = Math.max(step - (step > 3 ? 1 : 0), 0.6)
  const hovered = hover !== null ? rows[hover] : undefined
  const ticks = timeTicks(
    rows[0]?.timestamp ?? 0,
    rows.at(-1)?.until ?? 0,
    width < 480 ? 3 : 6,
  ).map((t) => ({
    ...t,
    index: nearestIndex(rows, t.timestamp, (r) => r.timestamp),
  }))

  return (
    <Tile area="flows" label="Issuance and burn">
      <TileTitle
        meta={`ETH per day${weekly ? ', weekly average' : ''}, ${rangeLabel}`}
      >
        Issuance and burn
      </TileTitle>
      <div className="flex flex-1 flex-col gap-3">
        <div
          ref={ref}
          className="relative flex-1"
          style={{ minHeight: MIN_HEIGHT }}
        >
          <svg
            {...svg}
            role="img"
            aria-label="Issuance and burn per day, with the net"
            className="absolute inset-0 block touch-pan-y"
            onPointerMove={(e) => {
              const box = e.currentTarget.getBoundingClientRect()
              const i = Math.floor((e.clientX - box.left - PAD.left) / step)
              setHover(i < 0 ? null : Math.min(rows.length - 1, i))
            }}
            onPointerLeave={() => setHover(null)}
          >
            {g.ticks.map((t) => (
              <g key={t}>
                <line
                  x1={PAD.left}
                  x2={width}
                  y1={y(t)}
                  y2={y(t)}
                  stroke={t === 0 ? 'var(--secondary)' : 'var(--chart-grid)'}
                  strokeOpacity={t === 0 ? 0.6 : 0.5}
                />
                <text
                  x={PAD.left - 8}
                  y={y(t)}
                  dy="0.32em"
                  textAnchor="end"
                  className={TYPE.axis}
                >
                  {formatTick(t)}
                </text>
              </g>
            ))}
            {rows.map((r, i) => {
              const x = xOf(i)
              const dim = hover !== null && hover !== i
              return (
                <g key={r.timestamp} opacity={dim ? 0.45 : 1}>
                  <rect
                    x={x}
                    y={y(r.issuance)}
                    width={barWidth}
                    height={Math.max(0, y(0) - y(r.issuance) - 1)}
                    fill={COLORS.issuance}
                  />
                  <rect
                    x={x}
                    y={y(0) + 1}
                    width={barWidth}
                    height={Math.max(0, y(-r.burn) - y(0) - 1)}
                    fill={COLORS.burn}
                  />
                </g>
              )
            })}
            {g.netPath && (
              <>
                <path
                  d={g.netPath}
                  fill="none"
                  stroke="var(--surface-primary)"
                  strokeWidth={4}
                  strokeLinejoin="round"
                />
                <path
                  d={g.netPath}
                  fill="none"
                  stroke={COLORS.net}
                  strokeWidth={1.5}
                  strokeLinejoin="round"
                />
              </>
            )}
            {ticks.map(({ index, timestamp, label }) => (
              <text
                key={timestamp}
                x={xOf(index) + step / 2}
                y={height - 6}
                textAnchor={
                  xOf(index) > width - 30
                    ? 'end'
                    : xOf(index) < PAD.left + 20
                      ? 'start'
                      : 'middle'
                }
                className={TYPE.axis}
              >
                {label}
              </text>
            ))}
            {hovered && (
              <circle
                cx={xOf(hover ?? 0) + step / 2}
                cy={y(hovered.net)}
                r={4}
                fill={COLORS.net}
                stroke="var(--surface-primary)"
                strokeWidth={2}
                pointerEvents="none"
              />
            )}
          </svg>
          {hovered && (
            <HoverTip
              x={xOf(hover ?? 0) + step / 2}
              y={(y(0) + height - PAD.bottom) / 2}
              width={width}
            >
              <TipTitle>
                {hovered.days > 1
                  ? formatRange(hovered.timestamp, hovered.until)
                  : formatTimestamp(hovered.timestamp)}
              </TipTitle>
              <TipRow
                color={COLORS.issuance}
                label="Issued"
                value={formatEth(hovered.issuance)}
              />
              <TipRow
                color={COLORS.burn}
                label="Burned"
                value={formatEth(hovered.burn)}
              />
              <TipRow
                color={COLORS.net}
                line
                label="Net"
                value={formatSignedEth(hovered.net)}
              />
              {hovered.days > 1 && (
                <div className="mt-1 text-label-value-12 text-secondary">
                  ETH per day, {hovered.days}-day average
                </div>
              )}
            </HoverTip>
          )}
        </div>
        <Legend>
          <Key color={COLORS.issuance} label="Issued" />
          <Key color={COLORS.burn} label="Burned" />
          <Key color={COLORS.net} line label="Net" />
        </Legend>
      </div>
    </Tile>
  )
}

/** −10K · −8K · 0 · 2K, or plain under a thousand. */
function formatTick(value: number): string {
  if (value === 0) return '0'
  const sign = value < 0 ? '−' : ''
  const abs = Math.abs(value)
  return abs >= 1000
    ? `${sign}${Number((abs / 1000).toFixed(1))}K`
    : `${sign}${abs}`
}
