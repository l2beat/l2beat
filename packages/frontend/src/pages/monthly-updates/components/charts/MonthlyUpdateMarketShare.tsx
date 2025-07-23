import { Skeleton } from '~/components/core/Skeleton'
import { formatPercent } from '~/utils/calculatePercentageChange'

export function MarketShare({
  marketShare,
}: {
  marketShare: number | undefined
}) {
  if (marketShare === undefined) {
    return <Skeleton className="my-[3px] ml-auto h-[14px] w-36" />
  }

  return (
    <div className="font-medium text-branding-primary text-xs">
      {formatPercent(marketShare)} scaling market share
    </div>
  )
}
