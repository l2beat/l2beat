import { formatCurrency, formatInteger } from '@l2beat/shared-pure'
import { TwoRowCell } from '~/components/table/cells/TwoRowCell'

export function PrivacyDepositsMetric({
  deposits,
  depositedValueUsd,
}: {
  deposits: number
  depositedValueUsd: number
}) {
  return (
    <TwoRowCell className="text-right">
      <TwoRowCell.First>{formatInteger(deposits)}</TwoRowCell.First>
      <TwoRowCell.Second>
        {formatCurrency(depositedValueUsd, 'usd')}
      </TwoRowCell.Second>
    </TwoRowCell>
  )
}
