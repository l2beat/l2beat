import { UnixTime } from '@l2beat/shared-pure'
import { useRef } from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import { useResizeObserver } from '~/hooks/useResizeObserver'
import type { GasFeesRecent } from '~/server/features/gas-fees/getGasFeesRecent'
import { cn } from '~/utils/cn'
import { formatRange } from '~/utils/dates'
import { formatFee, formatTimes } from '../metrics'
import type { GasFeesChain } from '../types'
import {
  formatGwei,
  formatHour,
  getBarColor,
  getBiggestMove,
  getRatio,
  isNotable,
} from './recentScale'

interface Props {
  chain: GasFeesChain | undefined
  data: GasFeesRecent | undefined
  pinned: boolean
  hour: number | undefined
  onHoverHour: (hour: number | undefined) => void
  onTogglePin: () => void
}

const MARGIN = { top: 8, right: 4, bottom: 18, left: 48 }

export function GasFeesRecentFocus({
  chain,
  data,
  pinned,
  hour,
  onHoverHour,
  onTogglePin,
}: Props) {
  const series = data?.chains.find((c) => c.id === chain?.id)
  if (!chain || !series || !data) {
    return <Skeleton className="h-full min-h-[200px] w-full" />
  }
  const isEthereum = chain.id === 'ethereum'
  const lastIndex = series.avgFee.length - 1
  const shown = hour ?? lastIndex
  const ratio = getRatio(series, shown)
  const move = getBiggestMove(series)
  const timestamp = data.hours[shown] ?? 0

  return (
    <div className="flex h-full flex-col gap-1">
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 font-bold text-base">
          <img
            src={chain.iconUrl}
            alt=""
            width={18}
            height={18}
            className="size-[18px] rounded-full"
          />
          {chain.name}
          {pinned && <span className="size-1.5 rounded-full bg-brand" />}
        </span>
        <span className="whitespace-nowrap text-secondary text-xs tabular-nums">
          Peak{' '}
          <span
            className={cn(isNotable(move.ratio) && 'font-bold text-primary')}
          >
            {move.ratio >= 1 ? '▲' : '▼'} {formatTimes(move.ratio)}
          </span>{' '}
          · {formatHour(data.hours[move.hour] ?? 0)}
        </span>
      </div>
      {/* The readout follows the hovered hour, and shows the latest one at rest */}
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 text-xs tabular-nums">
        <span className="text-secondary">
          {hour === undefined
            ? 'Now'
            : formatRange(timestamp, timestamp + UnixTime.HOUR)}
        </span>
        <span className="flex items-baseline gap-2">
          {isEthereum && (
            <span className="text-secondary">
              {formatGwei(data.ethereum.baseFeeGwei[shown] ?? 0)} +{' '}
              {formatGwei(data.ethereum.priorityFeeGwei[shown] ?? 0)} gwei
            </span>
          )}
          <span className="font-bold text-primary">
            {formatFee(series.avgFee[shown] ?? 0)}
          </span>
          <span
            className={cn(
              isNotable(ratio) ? 'font-bold text-primary' : 'text-secondary',
            )}
          >
            {formatTimes(ratio)}
          </span>
        </span>
      </div>
      <Key isEthereum={isEthereum} usual={series.usual} />
      <Bars
        series={series}
        ethereum={isEthereum ? data.ethereum : undefined}
        hours={data.hours}
        hour={hour}
        onHoverHour={onHoverHour}
        onClick={onTogglePin}
      />
    </div>
  )
}

function Key({ isEthereum, usual }: { isEthereum: boolean; usual: number }) {
  return (
    <div className="flex items-center gap-1.5 text-2xs text-secondary">
      {isEthereum ? (
        <>
          <span className="size-2 rounded-xs bg-chart-stacked-blue" />
          Base fee
          <span className="ml-2 size-2 rounded-xs bg-chart-stacked-pink" />
          Tip
        </>
      ) : (
        <>
          <span className="size-2 rounded-xs bg-chart-orange" />
          Above usual
          <span className="ml-2 size-2 rounded-xs bg-chart-sky" />
          Below usual
        </>
      )}
      <span className="mb-px ml-2 w-3.5 border-primary/70 border-t-[1.5px] border-dashed" />
      Usual {formatFee(usual)}
    </div>
  )
}

function Bars({
  series,
  ethereum,
  hours,
  hour,
  onHoverHour,
  onClick,
}: {
  series: GasFeesRecent['chains'][number]
  ethereum: GasFeesRecent['ethereum'] | undefined
  hours: number[]
  hour: number | undefined
  onHoverHour: (hour: number | undefined) => void
  onClick: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { width = 0, height = 0 } = useResizeObserver({ ref })
  const plotWidth = Math.max(0, width - MARGIN.left - MARGIN.right)
  const slot = plotWidth / series.avgFee.length
  const barWidth = Math.max(2, slot - 3)
  const max = Math.max(...series.avgFee, series.usual) * 1.12
  const ticks = getTicks(max)
  const top = Math.max(max, ticks.at(-1) ?? max)
  const y = (v: number) =>
    height - MARGIN.bottom - (v / top) * (height - MARGIN.top - MARGIN.bottom)
  const x = (i: number) => MARGIN.left + i * slot

  return (
    <div ref={ref} className="relative min-h-[140px] flex-1">
      {width > 0 && height > 0 && (
        <svg
          width={width}
          height={height}
          className="absolute inset-0 cursor-pointer overflow-visible"
          onMouseMove={(e) => {
            const left = e.currentTarget.getBoundingClientRect().left
            const i = Math.floor((e.clientX - left - MARGIN.left) / slot)
            onHoverHour(Math.max(0, Math.min(hours.length - 1, i)))
          }}
          onMouseLeave={() => onHoverHour(undefined)}
          onClick={onClick}
        >
          {ticks.map((v) => (
            <g key={v}>
              <line
                x1={MARGIN.left}
                x2={width - MARGIN.right}
                y1={y(v)}
                y2={y(v)}
                className="stroke-divider"
              />
              <text
                x={MARGIN.left - 8}
                y={y(v) + 4}
                textAnchor="end"
                className="fill-secondary text-[11px] tabular-nums"
              >
                {v === 0 ? '$0' : formatFee(v)}
              </text>
            </g>
          ))}
          {series.avgFee.map((fee, i) => {
            const bx = x(i) + (slot - barWidth) / 2
            const opacity = hour !== undefined && i !== hour ? 0.45 : 1
            if (ethereum) {
              const base = ethereum.baseFeeGwei[i] ?? 0
              const tip = ethereum.priorityFeeGwei[i] ?? 0
              const baseTop = y((fee * base) / (base + tip))
              return (
                <g key={i} opacity={opacity}>
                  <rect
                    x={bx}
                    y={baseTop}
                    width={barWidth}
                    height={y(0) - baseTop}
                    className="fill-chart-stacked-blue"
                  />
                  <path
                    d={roundTop(bx, y(fee), barWidth, baseTop - y(fee))}
                    className="fill-chart-stacked-pink"
                  />
                </g>
              )
            }
            return (
              <path
                key={i}
                d={roundTop(bx, y(fee), barWidth, y(0) - y(fee))}
                fill={getBarColor(fee / series.usual)}
                opacity={opacity}
              />
            )
          })}
          <line
            x1={MARGIN.left}
            x2={width - MARGIN.right}
            y1={y(series.usual)}
            y2={y(series.usual)}
            strokeDasharray="4 3"
            strokeWidth={1.25}
            className="stroke-primary/70"
          />
          {hours.map((timestamp, i) => {
            const labelled =
              i === hour ||
              (new Date(timestamp * 1000).getUTCHours() % 6 === 0 &&
                (hour === undefined || Math.abs(i - hour) > 2))
            if (!labelled) return null
            return (
              <text
                key={timestamp}
                x={x(i) + slot / 2}
                y={height - 4}
                textAnchor="middle"
                className={cn(
                  'text-[11px] tabular-nums',
                  i === hour ? 'fill-primary font-medium' : 'fill-secondary',
                )}
              >
                {formatHour(timestamp)}
              </text>
            )
          })}
        </svg>
      )}
    </div>
  )
}

/** About three round gridlines from zero */
function getTicks(max: number) {
  const step0 = max / 3
  const magnitude = 10 ** Math.floor(Math.log10(step0))
  const step =
    [1, 2, 2.5, 5, 10].map((m) => m * magnitude).find((s) => max / s <= 3) ??
    10 * magnitude
  const ticks: number[] = []
  for (let v = 0; v <= max + step * 1e-9; v += step) {
    ticks.push(Number(v.toPrecision(12)))
  }
  return ticks
}

/** A bar with rounded top corners, square at the baseline */
function roundTop(x: number, y: number, w: number, h: number) {
  if (h <= 0) return ''
  const r = Math.min(2.5, w / 2, h)
  return `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z`
}
