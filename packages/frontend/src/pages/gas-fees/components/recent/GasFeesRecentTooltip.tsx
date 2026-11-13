import { UnixTime } from '@l2beat/shared-pure'
import { useEffect } from 'react'
import type { GasFeesRecent } from '~/server/features/gas-fees/getGasFeesRecent'
import type { GasFeesUnit } from '~/server/features/gas-fees/types'
import { cn } from '~/utils/cn'
import { formatRange } from '~/utils/dates'
import { FeeSplitBar } from '../FeeSplitBar'
import { formatFee, formatGasPrice, formatTimes } from '../metrics'
import type { GasFeesChain } from '../types'
import type { RecentHover } from './GasFeesRecentStrip'
import {
  getRatio,
  getSeries,
  isAbove,
  isBelow,
  isNotable,
  LEGEND_GRADIENT,
} from './recentScale'

const WIDTH = 300

/** Follows the hovered square; hides on scroll, as the square moves away */
export function GasFeesRecentTooltip({
  hover,
  setHover,
  chains,
  data,
  unit,
}: {
  hover: RecentHover | undefined
  setHover: (hover: RecentHover | undefined) => void
  chains: GasFeesChain[]
  data: GasFeesRecent | undefined
  unit: GasFeesUnit
}) {
  useEffect(() => {
    if (!hover) return
    const hide = () => setHover(undefined)
    window.addEventListener('scroll', hide, { capture: true, passive: true })
    return () => window.removeEventListener('scroll', hide, { capture: true })
  }, [hover, setHover])

  const recent = data?.chains.find((c) => c.id === hover?.chainId)
  const chain = chains.find((c) => c.id === hover?.chainId)
  if (!hover || !recent || !chain || !data) return null

  const series = getSeries(recent, unit)
  const ratio = getRatio(series, hover.hour)
  const timestamp = data.hours[hover.hour] ?? 0
  const base = recent.gas.baseFee[hover.hour] ?? 0
  const priority = recent.gas.priorityFee?.[hover.hour]
  const format = (value: number) =>
    unit === 'usd' ? formatFee(value) : formatGasPrice(value, recent.gasUnit)
  const center = hover.rect.left + hover.rect.width / 2
  const left = Math.min(
    Math.max(center, WIDTH / 2 + 8),
    window.innerWidth - WIDTH / 2 - 8,
  )

  return (
    <div
      role="tooltip"
      className="pointer-events-none fixed z-50 flex flex-col gap-2 rounded-lg border border-divider bg-surface-primary p-3 text-xs shadow-popover"
      style={{
        width: WIDTH,
        left,
        top: hover.rect.top - 6,
        transform: 'translate(-50%, -100%)',
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 whitespace-nowrap font-bold">
          <img
            src={chain.iconUrl}
            alt=""
            width={16}
            height={16}
            className="size-4 rounded-full"
          />
          {chain.shortName ?? chain.name}
        </span>
        <span className="whitespace-nowrap text-2xs text-secondary tabular-nums">
          {formatRange(timestamp, timestamp + UnixTime.HOUR)}
        </span>
      </div>
      <div className="flex items-baseline justify-between gap-2 tabular-nums">
        <span className="font-bold text-base">
          {format(series.values[hover.hour] ?? 0)}
        </span>
        <span
          className={cn(
            'font-medium',
            isNotable(ratio) && 'font-bold',
            isAbove(ratio) && 'text-chart-orange',
            isBelow(ratio) && 'text-chart-sky',
            !isAbove(ratio) && !isBelow(ratio) && 'text-secondary',
          )}
        >
          {formatTimes(ratio)} usual
        </span>
      </div>
      <span className="-mt-1.5 text-2xs text-secondary">
        Usual {format(series.usual)}
      </span>
      {priority !== undefined && (
        <div className="flex flex-col gap-1 border-divider border-t pt-2">
          <FeeSplitBar
            parts={[
              { key: 'base', value: base },
              { key: 'priority', value: priority },
            ]}
          />
          <div className="flex justify-between text-2xs tabular-nums">
            <span>
              <span className="text-secondary">Base </span>
              {formatGasPrice(base, recent.gasUnit)}
            </span>
            <span>
              <span className="text-secondary">Priority </span>
              {formatGasPrice(priority, recent.gasUnit)}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export function GasFeesRecentLegend({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'flex items-center gap-1.5 text-2xs text-secondary',
        className,
      )}
    >
      ½×
      <span
        className="h-2 w-24 rounded-xs"
        style={{ background: LEGEND_GRADIENT }}
      />
      4× usual
    </span>
  )
}
