import { Skeleton } from '~/components/core/Skeleton'
import type { GasFeesRecent } from '~/server/features/gas-fees/getGasFeesRecent'
import { cn } from '~/utils/cn'
import { formatFee, formatTimes } from '../metrics'
import type { GasFeesChain } from '../types'
import {
  formatGwei,
  formatHour,
  getBiggestMove,
  getCellColor,
  getRatio,
  isNotable,
  LEGEND_GRADIENT,
} from './recentScale'

interface Props {
  chains: GasFeesChain[]
  data: GasFeesRecent | undefined
  focusedChainId: string | undefined
  pinnedChainId: string | undefined
  hour: number | undefined
  onHover: (chainId: string | undefined, hour: number | undefined) => void
  onTogglePin: (chainId: string) => void
}

export function GasFeesRecentHeatmap({
  chains,
  data,
  focusedChainId,
  pinnedChainId,
  hour,
  onHover,
  onTogglePin,
}: Props) {
  const last = data ? data.hours.length - 1 : undefined
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-1">
        <h2 className="font-bold text-xl">Last 24 hours</h2>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-2xs text-secondary">
          {data && last !== undefined && (
            <span className="flex items-center gap-1 tabular-nums">
              Ethereum
              <span className="ml-1.5 size-2 rounded-xs bg-chart-stacked-blue" />
              Base fee
              <span className="font-medium text-primary">
                {formatGwei(data.ethereum.baseFeeGwei[last] ?? 0)}
              </span>
              <span className="ml-1.5 size-2 rounded-xs bg-chart-stacked-pink" />
              Tip
              <span className="font-medium text-primary">
                {formatGwei(data.ethereum.priorityFeeGwei[last] ?? 0)}
              </span>
              gwei
            </span>
          )}
          <span className="flex items-center gap-1.5">
            ½×
            <span
              className="h-2 w-24 rounded-xs"
              style={{ background: LEGEND_GRADIENT }}
            />
            4× usual
          </span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div
          className="grid min-w-[640px] grid-cols-[108px_minmax(0,1fr)_64px_44px_92px] items-center gap-x-2.5 gap-y-0.5 text-xs"
          onMouseLeave={() => onHover(undefined, undefined)}
        >
          <span />
          <div className="grid h-4 grid-cols-24 gap-px">
            {data?.hours.map((timestamp, i) => {
              const labelled =
                i === hour ||
                (new Date(timestamp * 1000).getUTCHours() % 4 === 0 &&
                  (hour === undefined || Math.abs(i - hour) > 1))
              return (
                <span
                  key={timestamp}
                  className={cn(
                    'whitespace-nowrap text-2xs tabular-nums',
                    i === hour ? 'font-medium text-primary' : 'text-secondary',
                  )}
                >
                  {labelled ? formatHour(timestamp) : ''}
                </span>
              )
            })}
          </div>
          <ColumnHeader>Now</ColumnHeader>
          <ColumnHeader>× now</ColumnHeader>
          <ColumnHeader>Peak</ColumnHeader>
          {!data
            ? chains.map((chain) => (
                <Skeleton key={chain.id} className="col-span-5 h-3.5" />
              ))
            : data.chains.map((series) => {
                const chain = chains.find((c) => c.id === series.id)
                if (!chain) return null
                const focused = series.id === focusedChainId
                const now = getRatio(series, series.avgFee.length - 1)
                const move = getBiggestMove(series)
                return (
                  <div
                    key={series.id}
                    className="contents cursor-pointer"
                    onClick={() => onTogglePin(series.id)}
                  >
                    <span
                      className={cn(
                        'flex h-3.5 min-w-0 items-center gap-1.5 font-medium',
                        focused ? 'text-primary' : 'text-secondary',
                      )}
                      onMouseEnter={() => onHover(series.id, undefined)}
                    >
                      <img
                        src={chain.iconUrl}
                        alt=""
                        width={14}
                        height={14}
                        className="size-3.5 rounded-full"
                      />
                      <span className="truncate">
                        {chain.shortName ?? chain.name}
                      </span>
                      {series.id === pinnedChainId && (
                        <span className="ml-auto size-1.5 shrink-0 rounded-full bg-brand" />
                      )}
                    </span>
                    <div
                      className={cn(
                        'grid grid-cols-24 gap-px rounded-[3px]',
                        focused && 'ring-1 ring-primary/35',
                      )}
                    >
                      {series.avgFee.map((_, i) => (
                        <span
                          key={i}
                          className={cn(
                            'aspect-square rounded-[2px]',
                            i === hour &&
                              (focused
                                ? '-outline-offset-1 relative z-10 outline-2 outline-primary'
                                : 'brightness-125'),
                          )}
                          style={{
                            backgroundColor: getCellColor(getRatio(series, i)),
                          }}
                          onMouseEnter={() => onHover(series.id, i)}
                        />
                      ))}
                    </div>
                    <span className="text-right font-medium tabular-nums">
                      {formatFee(series.avgFee.at(-1) ?? 0)}
                    </span>
                    <span
                      className={cn(
                        'text-right tabular-nums',
                        isNotable(now)
                          ? 'font-bold text-primary'
                          : focused
                            ? 'text-primary'
                            : 'text-secondary',
                      )}
                    >
                      {formatTimes(now)}
                    </span>
                    <span
                      className={cn(
                        'whitespace-nowrap text-right tabular-nums',
                        focused ? 'text-primary' : 'text-secondary',
                      )}
                    >
                      <span
                        className={cn(
                          isNotable(move.ratio) && 'font-bold text-primary',
                        )}
                      >
                        {move.ratio >= 1 ? '▲' : '▼'} {formatTimes(move.ratio)}
                      </span>
                      {' · '}
                      {formatHour(data.hours[move.hour] ?? 0)}
                    </span>
                  </div>
                )
              })}
        </div>
      </div>
    </div>
  )
}

function ColumnHeader({ children }: { children: string }) {
  return (
    <span className="whitespace-nowrap text-right font-medium text-2xs text-secondary uppercase tracking-wide">
      {children}
    </span>
  )
}
