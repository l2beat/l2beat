import { formatCurrency, formatInteger } from '@l2beat/shared-pure'

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
      <div className="font-medium text-[10px] text-secondary leading-none md:text-[11px]">
        {formatCurrency(depositedValueUsd, 'usd')}
      </div>
    </div>
  )
}
