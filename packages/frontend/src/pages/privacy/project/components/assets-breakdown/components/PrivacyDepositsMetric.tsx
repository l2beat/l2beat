import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'

export function PrivacyDepositsMetric({
  deposits,
  depositedValueUsd,
}: {
  deposits: number
  depositedValueUsd: number
}) {
  return (
    <div className="text-right">
      <div className="font-bold">{formatInteger(deposits)}</div>
      <div className="text-[10px] text-secondary leading-none md:text-[11px]">
        {formatCurrency(depositedValueUsd, 'usd')}
      </div>
    </div>
  )
}
