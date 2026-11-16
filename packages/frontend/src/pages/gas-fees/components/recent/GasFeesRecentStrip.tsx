import type { GasFeesRecentSeries } from '~/server/features/gas-fees/getGasFeesRecent'
import { cn } from '~/utils/cn'
import { getCellColor, getRatio } from './recentScale'

export interface RecentHover {
  chainId: string
  hour: number
  rect: DOMRect
}

/** A chain's last 24 hours as one dense heatmap row, an hour per cell */
export function GasFeesRecentStrip({
  chainId,
  series,
  hover,
  onHover,
}: {
  chainId: string
  series: GasFeesRecentSeries
  hover: RecentHover | undefined
  onHover: (hover: RecentHover | undefined) => void
}) {
  return (
    <div
      className="grid h-4 w-[120px] grid-cols-24 overflow-hidden rounded-[3px]"
      onMouseLeave={() => onHover(undefined)}
    >
      {series.values.map((_, hour) => (
        <span
          key={hour}
          className={cn(
            'h-full',
            hover?.chainId === chainId &&
              hover.hour === hour &&
              '-outline-offset-2 relative z-10 outline-2 outline-primary',
          )}
          style={{ backgroundColor: getCellColor(getRatio(series, hour)) }}
          onMouseEnter={(e) =>
            onHover({
              chainId,
              hour,
              rect: e.currentTarget.getBoundingClientRect(),
            })
          }
        />
      ))}
    </div>
  )
}
