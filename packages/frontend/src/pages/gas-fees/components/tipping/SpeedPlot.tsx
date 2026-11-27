import { useRef, useState } from 'react'
import { useResizeObserver } from '~/hooks/useResizeObserver'
import {
  type PriceOfSpeed,
  type SpeedDot,
  type SpeedPoint,
  valueOnLine,
} from '~/server/features/gas-fees/tipping/toPriceOfSpeed'
import { TIP_BANDS } from '~/server/features/gas-fees/tipping/toTipPayers'
import { DOT_SEPARATOR } from '~/utils/dotSeparator'
import {
  formatCount,
  formatGwei,
  formatSeconds,
  formatUsd,
} from '../../utils/format'
import { TIP_BAND_STYLE } from './tipBands'

const HEIGHT = 280
const MARGIN = { top: 28, right: 16, bottom: 44, left: 36 }
const ROUND_TIP_COLORS = TIP_BANDS.map((b) => TIP_BAND_STYLE[b].color)
/** "Our estimated fast tip" in the mark's type, px */
const FAST_LABEL_WIDTH = 140

/**
 * Seconds until you can be 99% sure you're in, against what the tip adds to
 * an ERC-20 transfer: a dot per tip level and a line through them that never rises
 */
export function SpeedPlot({ speed }: { speed: PriceOfSpeed }) {
  const ref = useRef<HTMLDivElement>(null)
  const { width = 0 } = useResizeObserver({ ref })
  const [hovered, setHovered] = useState<SpeedDot>()
  const { line, roundTips, fastTip, dots } = speed

  const plotWidth = Math.max(0, width - MARGIN.left - MARGIN.right)
  const plotHeight = HEIGHT - MARGIN.top - MARGIN.bottom
  const maxUsd =
    Math.max(
      ...dots.map((d) => d.usd),
      ...roundTips.map((t) => t.usd),
      fastTip?.usd ?? 0,
    ) * 1.04
  const yMax = niceCeil(
    Math.max(
      10,
      ...line.map((p) => p.seconds),
      ...roundTips.map((t) => t.seconds),
      fastTip?.seconds ?? 0,
    ) * 1.25,
  )
  const x = (usd: number) =>
    MARGIN.left + (maxUsd > 0 ? (usd / maxUsd) * plotWidth : 0)
  const y = (seconds: number) =>
    MARGIN.top + plotHeight - (seconds / yMax) * plotHeight
  const bottom = MARGIN.top + plotHeight
  const fastX = fastTip && x(fastTip.usd)

  // The name goes under the line where it runs: the line never rises, so that is at the name's end
  const fastLabelY =
    fastTip?.seconds === undefined || fastX === undefined
      ? 0
      : plotWidth === 0 || line.length === 0
        ? y(fastTip.seconds) + 28
        : Math.max(
            y(fastTip.seconds) + 28,
            y(
              valueOnLine(
                line,
                ((fastX + FAST_LABEL_WIDTH - MARGIN.left) / plotWidth) * maxUsd,
              ),
            ) + 16,
          )

  const [cheap, dear] = splitLine(line, fastTip?.usd)
  const onPointer = (event: React.PointerEvent<SVGSVGElement>) => {
    const px = event.clientX - event.currentTarget.getBoundingClientRect().left
    // Every dot is read, including those above the plot
    let nearest: SpeedDot | undefined
    for (const dot of dots) {
      if (!nearest || Math.abs(x(dot.usd) - px) < Math.abs(x(nearest.usd) - px))
        nearest = dot
    }
    setHovered(nearest)
  }

  return (
    <div ref={ref} className="relative w-full" style={{ height: HEIGHT }}>
      <span className="absolute top-0 left-0 text-2xs text-secondary">
        {hovered ? describeDot(hovered) : '99% sure you’re in within'}
      </span>
      {width > 0 && maxUsd > 0 && (
        <svg
          width={width}
          height={HEIGHT}
          className="touch-pan-y touch-pinch-zoom select-none"
          onPointerMove={onPointer}
          onPointerLeave={() => setHovered(undefined)}
          role="img"
          aria-label="Seconds until 99% sure of inclusion, by what the tip adds to an ERC-20 transfer"
        >
          {fastX !== undefined && (
            <g>
              <rect
                x={fastX}
                y={MARGIN.top}
                width={Math.max(0, MARGIN.left + plotWidth - fastX)}
                height={plotHeight}
                className="fill-brand/8"
              />
              <text
                x={fastX + 8}
                y={MARGIN.top + 16}
                className="fill-brand-deep font-semibold text-2xs uppercase tracking-wider"
              >
                Above our estimated fast tip
              </text>
            </g>
          )}
          {gridSeconds(yMax).map((s) => (
            <g key={s}>
              <line
                x1={MARGIN.left}
                x2={MARGIN.left + plotWidth}
                y1={y(s)}
                y2={y(s)}
                className="stroke-divider"
              />
              <text
                x={MARGIN.left - 6}
                y={y(s) + 4}
                textAnchor="end"
                className="fill-secondary text-2xs"
              >
                {formatSeconds(s)}
              </text>
            </g>
          ))}
          {TIP_BANDS.map((band) => {
            const { fromGwei, toGwei, color } = TIP_BAND_STYLE[band]
            const from = x(Math.min(fromGwei * speed.usdPerGwei, maxUsd))
            const to = x(Math.min(toGwei * speed.usdPerGwei, maxUsd))
            return (
              <rect
                key={band}
                x={from}
                y={bottom - 4}
                width={Math.max(0, to - from)}
                height={4}
                fill={color}
              />
            )
          })}
          {dots.map((dot) =>
            dot.seconds === undefined || dot.seconds > yMax ? null : (
              <circle
                key={dot.fromGwei}
                cx={x(dot.usd)}
                cy={y(dot.seconds)}
                r={hovered === dot ? 4 : 2.5}
                className="fill-secondary/60"
              />
            ),
          )}
          <path
            d={toPath(cheap, x, y)}
            fill="none"
            strokeWidth={1.75}
            className="stroke-primary"
          />
          <path
            d={toPath(dear, x, y)}
            fill="none"
            strokeWidth={3}
            className="stroke-brand"
          />
          {roundTips.map((tip, i) => {
            const anchor =
              i === 0 ? 'start' : i === roundTips.length - 1 ? 'end' : 'middle'
            const labelX =
              x(tip.usd) + (anchor === 'start' ? -8 : anchor === 'end' ? 8 : 0)
            return (
              <g key={tip.gwei}>
                <circle
                  cx={x(tip.usd)}
                  cy={y(tip.seconds)}
                  r={7}
                  fill={ROUND_TIP_COLORS[i]}
                  className="stroke-2 stroke-surface-primary"
                />
                <text
                  x={labelX}
                  y={y(tip.seconds) - 26}
                  textAnchor={anchor}
                  className="fill-primary font-bold text-xs"
                >
                  {formatGwei(tip.gwei)} gwei
                </text>
                <text
                  x={labelX}
                  y={y(tip.seconds) - 12}
                  textAnchor={anchor}
                  className="fill-secondary text-2xs"
                >
                  {formatUsd(tip.usd)} · {formatSeconds(tip.seconds)}
                </text>
              </g>
            )
          })}
          {fastTip?.seconds !== undefined && fastX !== undefined && (
            <g>
              <circle
                cx={fastX}
                cy={y(fastTip.seconds)}
                r={8}
                className="fill-primary stroke-2 stroke-surface-primary"
              />
              <text
                x={fastX - 8}
                y={fastLabelY}
                className="fill-primary font-bold text-xs"
              >
                Our estimated fast tip
              </text>
              <text
                x={fastX - 8}
                y={fastLabelY + 14}
                className="fill-secondary text-2xs"
              >
                {formatUsd(fastTip.usd)} · {formatSeconds(fastTip.seconds)}
              </text>
            </g>
          )}
          {usdTicks(maxUsd).map((usd) => (
            <text
              key={usd}
              x={x(usd)}
              y={bottom + 16}
              textAnchor={usd === 0 ? 'start' : 'middle'}
              className="fill-secondary text-2xs"
            >
              {formatUsd(usd)}
            </text>
          ))}
          <text
            x={MARGIN.left + plotWidth / 2}
            y={HEIGHT - 6}
            textAnchor="middle"
            className="fill-secondary text-2xs"
          >
            What the tip adds to an ERC-20 transfer
          </text>
        </svg>
      )}
    </div>
  )
}

function describeDot(dot: SpeedDot) {
  const wait =
    dot.seconds === undefined ? 'over 30 min' : formatSeconds(dot.seconds)
  return [
    `${formatGwei(dot.fromGwei)}–${formatGwei(dot.toGwei)} gwei`,
    `${formatCount(dot.txCount)} txs`,
    formatUsd(dot.usd),
    wait,
  ].join(DOT_SEPARATOR)
}

/** The line up to our fast tip, and from it on */
function splitLine(
  line: SpeedPoint[],
  at: number | undefined,
): [SpeedPoint[], SpeedPoint[]] {
  if (at === undefined) return [line, []]
  const joint = { usd: at, seconds: valueOnLine(line, at) }
  return [
    [...line.filter((p) => p.usd < at), joint],
    [joint, ...line.filter((p) => p.usd > at)],
  ]
}

function toPath(
  points: SpeedPoint[],
  x: (usd: number) => number,
  y: (s: number) => number,
) {
  return points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${x(p.usd)},${y(p.seconds)}`)
    .join('')
}

function niceCeil(value: number) {
  return Math.ceil(value / 10) * 10
}

function gridSeconds(yMax: number) {
  const step = yMax > 60 ? 20 : 10
  return Array.from(
    { length: Math.floor(yMax / step) },
    (_, i) => (i + 1) * step,
  )
}

function usdTicks(max: number) {
  const rough = max / 5
  const power = 10 ** Math.floor(Math.log10(rough))
  const step =
    [1, 2, 5, 10].map((m) => m * power).find((s) => s >= rough) ?? rough
  return Array.from({ length: Math.floor(max / step) + 1 }, (_, i) =>
    Number((i * step).toPrecision(6)),
  )
}
