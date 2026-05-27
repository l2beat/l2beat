import { UnixTime } from '@l2beat/shared-pure'
import { Skeleton } from '~/components/core/Skeleton'
import { cn } from '~/utils/cn'
import { formatCurrency } from '~/utils/number-format/formatCurrency'

interface FlowsParticleLegendProps {
  totalVolume: number
  dollarsPerParticle?: number
  isLoading?: boolean
  layout?: 'stacked' | 'inline'
  className?: string
}

export function FlowsParticleLegend({
  totalVolume,
  dollarsPerParticle,
  isLoading = false,
  layout = 'stacked',
  className,
}: FlowsParticleLegendProps) {
  const avgValuePerSecond = totalVolume / UnixTime.DAY

  const avgLine = (
    <>
      Avg value per second ≈{' '}
      <span className="font-bold text-brand">
        {formatCurrency(avgValuePerSecond, 'usd')}
      </span>
    </>
  )

  const particleLine = dollarsPerParticle ? (
    <>
      <span className="size-1.5 rounded-full bg-brand" />1 particle ≈{' '}
      <span className="font-bold text-brand">
        {formatCurrency(dollarsPerParticle, 'usd', { decimals: 0 })}
      </span>
    </>
  ) : null

  if (layout === 'inline') {
    return (
      <div
        className={cn(
          'flex flex-wrap items-center gap-x-2 gap-y-1 font-medium text-label-value-11 text-secondary md:text-label-value-12',
          className,
        )}
      >
        <span>{avgLine}</span>
        {particleLine && (
          <>
            <span className="text-tertiary">|</span>
            <span className="inline-flex items-center gap-1">
              {particleLine}
            </span>
          </>
        )}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'space-y-1 text-center font-medium text-label-value-14 text-secondary',
        className,
      )}
    >
      {isLoading ? (
        <Skeleton className="mx-auto h-5 w-40" />
      ) : (
        <>
          {particleLine && (
            <div className="flex items-center justify-center gap-1">
              {particleLine}
            </div>
          )}
          <div>{avgLine}</div>
        </>
      )}
    </div>
  )
}
