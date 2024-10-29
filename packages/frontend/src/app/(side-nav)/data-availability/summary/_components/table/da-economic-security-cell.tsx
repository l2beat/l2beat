import { assertUnreachable } from '@l2beat/shared-pure'
import { type DaSummaryEntry } from '~/server/features/data-availability/summary/get-da-summary-entries'
import { formatCurrency } from '~/utils/number-format/format-currency'

export function DaEconomicSecurityCell({
  value,
}: { value: DaSummaryEntry['economicSecurity'] }) {
  if (!value) return formatCurrency(0, 'usd')

  switch (value.status) {
    case 'Synced':
      return formatCurrency(value.economicSecurity, 'usd')
    case 'StakeNotSynced':
      return 'Stake not synced'
    case 'CurrentPriceNotSynced':
      return 'Current price not synced'
    default:
      assertUnreachable(value)
  }
}
