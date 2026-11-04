import type { GasFeesRecentSeries } from '~/server/features/gas-fees/getGasFeesRecent'
import { cn } from '~/utils/cn'
import { getCellColor, getRatio } from './recentScale'

export interface RecentHover {
  chainId: string
  hour: number
  rect: DOMRect
}

/** A chain's last 24 hours, one square per hour */
export function GasFeesRecentStrip({
  chainId,
  series,
  hover,
  onHover,
  className,
}: {
  chainId: string
  series: GasFeesRecentSeries
  hover: RecentHover | undefined
  onHover: (hover: RecentHover | undefined) => void
  className?: string
}) {
  return (
    <div
      className={cn('grid grid-cols-24 gap-px', className)}
      onMouseLeave={() => onHover(undefined)}
    >
      {series.values.map((_, hour) => (
        <span
          key={hour}
          className={cn(
            'aspect-square rounded-[2px]',
            hover?.chainId === chainId &&
              hover.hour === hour &&
              '-outline-offset-1 relative z-10 outline-2 outline-primary',
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
