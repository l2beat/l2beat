import { BidirectionalArrowIcon } from '~/icons/BidirectionalArrow'
import { formatCurrency } from '~/utils/number-format/formatCurrency'

export function InteropTopPathValue({
  path,
}: {
  path: { chainA: string; chainB: string; volume: number }
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-label-value-16">
      <span className="capitalize">{path.chainA}</span>
      <BidirectionalArrowIcon className="size-4 fill-brand" />
      <span className="capitalize">{path.chainB}</span>
      <span className="text-secondary">
        {formatCurrency(path.volume, 'usd')}
      </span>
    </div>
  )
}
