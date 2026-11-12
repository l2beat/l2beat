import { useState } from 'react'
import { cn } from '~/utils/cn'
import { formatFee } from '../../metrics'
import mock from '../../pageMock.json'
import { SPEED_MARKS } from './SpeedCurve'
import { BANDS, OURS } from './shared'

/**
 * The price of speed plot of B2's spins (B2D–B2F): one frame (grid, curve,
 * dots, hover readout) on a linear $ or a log gwei axis, which each spin
 * layers its own annotations behind and in front of
 */

const CURVE = mock.speedCurve
export const DOTS = CURVE.dots
export type Dot = (typeof DOTS)[number]
export const MARKS = SPEED_MARKS
export const OURS_MARK = MARKS.find((mark) => mark.ours)
export const TOP_MARK = MARKS[MARKS.length - 1]

/** What a gwei of tip costs on an ERC-20 transfer, read off the dots */
export const USD_PER_GWEI = (() => {
  const ratios = DOTS.map((dot) => dot.usd / dot.tip).sort((a, b) => a - b)
  return ratios[Math.floor(ratios.length / 2)] ?? 0.105
})()
export const toGwei = (usd: number) => usd / USD_PER_GWEI
export const toUsd = (gwei: number) => gwei * USD_PER_GWEI

export const bandOf = (gwei: number) =>
  BANDS.find((band) => gwei < band.max) ?? BANDS[2]

export interface Axis {
  kind: 'usd' | 'gwei'
  /** Where a cost in dollars sits, in percent of the width */
  x: (usd: number) => number
  ticks: { usd: number; label: React.ReactNode }[]
  title: string
}

const USD_MAX =
  Math.max(...DOTS.map((dot) => dot.usd), ...MARKS.map((mark) => mark.usd)) *
  1.04

export const USD_AXIS: Axis = {
  kind: 'usd',
  x: (usd) => (usd / USD_MAX) * 100,
  ticks: [0, 0.05, 0.1, 0.15, 0.2].map((usd) => ({
    usd,
    label: usd === 0 ? '$0' : `$${usd.toFixed(2)}`,
  })),
  title: 'Cost of an ERC-20 transfer',
}

/** From just under the smallest dot to 2.5 gwei, where ordinary tips end */
export const GWEI_LO = 0.008
export const GWEI_HI = 2.5
const LOG_LO = Math.log10(GWEI_LO)
const LOG_HI = Math.log10(GWEI_HI)

export const GWEI_AXIS: Axis = {
  kind: 'gwei',
  x: (usd) => ((Math.log10(toGwei(usd)) - LOG_LO) / (LOG_HI - LOG_LO)) * 100,
  ticks: [0.01, 0.1, 1, 2.5].map((gwei, i) => ({
    usd: toUsd(gwei),
    label: (
      <span className="flex flex-col items-center leading-tight">
        <span className="font-semibold text-primary">
          {gwei}
          {/* On a phone only the first tick names its unit */}
          <span className={i > 0 ? 'max-md:hidden' : undefined}> gwei</span>
        </span>
        <span>{formatFee(toUsd(gwei))}</span>
      </span>
    ),
  })),
  title: 'Tip, log scale · cost of an ERC-20 transfer',
}

/** Where each tip band starts and ends on an axis, in percent */
export function bandSpans(axis: Axis) {
  return BANDS.map((band, i) => {
    const lo = i === 0 ? 0 : (BANDS[i - 1]?.max ?? 0)
    const from = i === 0 ? 0 : axis.x(toUsd(lo))
    const to =
      i === BANDS.length - 1 ? 100 : Math.min(100, axis.x(toUsd(band.max)))
    return { ...band, from, to }
  })
}

export interface YScale {
  min: number
  max: number
  ticks: number[]
}
const Y_DEFAULT: YScale = { min: 15, max: 55, ticks: [20, 30, 40, 50] }

export const yOf = (seconds: number, scale: YScale = Y_DEFAULT) =>
  (1 - (seconds - scale.min) / (scale.max - scale.min)) * 100

const rangeEdge = (gwei: number) =>
  gwei < 0.1 ? `${Number(gwei.toPrecision(2))}` : gwei.toFixed(2)
const compact = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumSignificantDigits: 3,
})

/** The curve as an SVG layer, all of it or the part between two costs */
export function CurveLine({
  axis,
  y = Y_DEFAULT,
  from = Number.NEGATIVE_INFINITY,
  to = Number.POSITIVE_INFINITY,
  color = OURS,
  width = 2,
  area,
}: {
  axis: Axis
  y?: YScale
  from?: number
  to?: number
  color?: string
  width?: number
  /** Fills under the line, down to the plot's floor */
  area?: string
}) {
  const points = clip(CURVE.line, from, to).map(
    (p) => [axis.x(p.usd), yOf(p.seconds, y)] as const,
  )
  const first = points[0]
  const last = points[points.length - 1]
  if (!first || !last) return null
  const line = points.map(([x, y]) => `${x},${y}`).join(' ')
  return (
    <svg
      className="pointer-events-none absolute inset-0 size-full overflow-visible"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
    >
      {area && (
        <polygon
          points={`${first[0]},100 ${line} ${last[0]},100`}
          fill={area}
          stroke="none"
        />
      )}
      <polyline
        points={line}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

/** The line's points between two costs, cut exactly at both ends */
function clip(
  line: { usd: number; seconds: number }[],
  from: number,
  to: number,
) {
  const at = (usd: number) => {
    const i = line.findIndex((p) => p.usd >= usd)
    const b = line[i]
    const a = line[i - 1]
    if (!b) return undefined
    if (!a || b.usd === usd) return { usd, seconds: b.seconds }
    const t = (usd - a.usd) / (b.usd - a.usd)
    return { usd, seconds: a.seconds + (b.seconds - a.seconds) * t }
  }
  const inside = line.filter((p) => p.usd > from && p.usd < to)
  const start = Number.isFinite(from) ? at(from) : undefined
  const end = Number.isFinite(to) ? at(to) : undefined
  return [...(start ? [start] : []), ...inside, ...(end ? [end] : [])]
}

export function SpeedPlot({
  axis,
  y = Y_DEFAULT,
  className,
  back,
  front,
  dot,
  line = true,
  readout = true,
  axisTitle = true,
  gutter = 'pl-8',
}: {
  axis: Axis
  y?: YScale
  /** Height of the plot */
  className?: string
  /** Layers under the grid, like shaded ranges */
  back?: React.ReactNode
  /** Layers over the dots, like marks and callouts */
  front?: React.ReactNode
  /** Size in pixels and colour of each dot; small and grey by default */
  dot?: (dot: Dot) => { size: number; color: string }
  line?: boolean
  readout?: boolean
  axisTitle?: boolean
  gutter?: string
}) {
  const [hovered, setHovered] = useState<number>()
  const point = hovered === undefined ? undefined : DOTS[hovered]

  const onMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect()
    const pct = ((event.clientX - box.left) / box.width) * 100
    let nearest = 0
    let best = Number.POSITIVE_INFINITY
    DOTS.forEach((candidate, i) => {
      const distance = Math.abs(axis.x(candidate.usd) - pct)
      if (distance < best) {
        best = distance
        nearest = i
      }
    })
    setHovered(nearest)
  }

  return (
    <div className="flex flex-col gap-2">
      {readout && (
        <div className="flex flex-wrap justify-between gap-x-4 text-2xs text-secondary tabular-nums">
          <span>99% sure you’re in within</span>
          <span className={cn(!point && 'invisible')}>
            {point
              ? `${rangeEdge(point.from)}–${rangeEdge(point.to)} gwei · ${compact.format(point.n)} txs · ${formatFee(point.usd)} · ${point.seconds}s`
              : '0.000–0.000 gwei · 000K txs · $0.000 · 00s'}
          </span>
        </div>
      )}
      <div className={cn(gutter, axis.kind === 'gwei' ? 'pb-9' : 'pb-5')}>
        <div
          className={cn('relative h-72 touch-none', className)}
          onPointerMove={onMove}
          onPointerLeave={() => setHovered(undefined)}
          role="img"
          aria-label="Seconds until you can be 99% sure you're in, against the cost of an ERC-20 transfer: it falls quickly up to our fast tip, then barely moves"
        >
          {back}
          {y.ticks.map((value) => (
            <div
              key={value}
              className="absolute inset-x-0 border-divider border-t"
              style={{ top: `${yOf(value, y)}%` }}
            >
              <span className="-translate-y-1/2 absolute right-full mr-2 text-2xs text-secondary tabular-nums">
                {value}s
              </span>
            </div>
          ))}
          <div className="absolute inset-x-0 bottom-0 border-divider border-t" />
          {axis.ticks.map((tick) => (
            <span
              key={tick.usd}
              className={cn(
                'absolute top-full mt-1.5 whitespace-nowrap text-2xs text-secondary tabular-nums',
                tick.usd === 0
                  ? ''
                  : axis.x(tick.usd) > 97
                    ? '-translate-x-full'
                    : '-translate-x-1/2',
              )}
              style={{ left: `${axis.x(tick.usd)}%` }}
            >
              {tick.label}
            </span>
          ))}
          {line && <CurveLine axis={axis} y={y} />}
          {DOTS.map((d) => {
            const style = dot?.(d) ?? {
              size: 6,
              color: 'color-mix(in oklab, var(--secondary) 45%, transparent)',
            }
            return (
              <span
                key={d.usd}
                className="-translate-x-1/2 -translate-y-1/2 pointer-events-none absolute rounded-full"
                style={{
                  left: `${axis.x(d.usd)}%`,
                  top: `${yOf(d.seconds, y)}%`,
                  width: style.size,
                  height: style.size,
                  background: d === point ? 'var(--primary)' : style.color,
                }}
              />
            )
          })}
          {point && (
            <div
              className="pointer-events-none absolute inset-y-0 border-secondary border-l border-dashed"
              style={{ left: `${axis.x(point.usd)}%` }}
            />
          )}
          {front}
        </div>
      </div>
      {axisTitle && (
        <span className="text-center text-2xs text-secondary">
          {axis.title}
        </span>
      )}
    </div>
  )
}

/** Places a child at a cost and a number of seconds on the plot */
export function At({
  axis,
  y = Y_DEFAULT,
  usd,
  seconds,
  children,
  className,
}: {
  axis: Axis
  y?: YScale
  usd: number
  seconds: number
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn('pointer-events-none absolute', className)}
      style={{ left: `${axis.x(usd)}%`, top: `${yOf(seconds, y)}%` }}
    >
      {children}
    </div>
  )
}
