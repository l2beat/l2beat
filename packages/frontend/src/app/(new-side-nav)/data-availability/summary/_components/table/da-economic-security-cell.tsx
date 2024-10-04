import { assertUnreachable } from '@l2beat/shared-pure'
import { EM_DASH } from '~/consts/characters'
import { type DaSummaryEntry } from '~/server/features/data-availability/summary/get-da-summary-entries'
import { formatCurrency } from '~/utils/format'

export function DaEconomicSecurityCell({
  value,
}: { value: DaSummaryEntry['economicSecurity'] }) {
  if (!value) return EM_DASH

  switch (value.status) {
    case 'Synced':
      return formatCurrency(value.economicSecurity, 'usd', {
        showLessThanMinimum: false,
      })
    case 'StakeNotSynced':
      return 'Stake not synced'
    case 'CurrentPriceNotSynced':
      return 'Current price not synced'
    default:
      assertUnreachable(value)
  }
}
