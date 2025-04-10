import { cn } from '~/utils/cn'
import { formatNumberWithCommas } from '~/utils/number-format/format-number'

interface Props {
  usdValue: number
}

export function TokenCanonicalValueCell({ usdValue }: Props) {
  return (
    <div className={cn('text-xs font-bold')}>
      ${formatNumberWithCommas(Number(usdValue))}
    </div>
  )
}
