import { cn } from '~/utils/cn'
import { formatNumberWithCommas } from '~/utils/number-format/format-number'

interface Props {
  isDescendant: boolean
  amount: number
}

export function TokenCanonicalAmountCell({ amount, isDescendant }: Props) {
  return (
    <div
      className={cn(
        'text-xs font-medium',
        isDescendant && 'text-primary text-opacity-80',
      )}
    >
      {formatNumberWithCommas(Number(amount))}
    </div>
  )
}
