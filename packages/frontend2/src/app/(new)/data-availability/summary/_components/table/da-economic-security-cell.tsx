import { assertUnreachable } from '@l2beat/shared-pure'
import { EM_DASH } from '~/app/_components/nav/consts'
import { type DaSummaryEntry } from '~/server/features/data-availability/get-da-summary-entries'
import { formatNumber } from '~/utils/format-number'

export function DaEconomicSecurityCell({
  value,
}: { value: DaSummaryEntry['economicSecurity'] }) {
  if (!value) return EM_DASH

  switch (value.status) {
    case 'Synced':
      return `$${formatNumber(value.economicSecurity, 2)}`
    case 'StakeNotSynced':
      return 'Stake not synced'
    case 'CurrentPriceNotSynced':
      return 'Current price not synced'
    default:
      assertUnreachable(value)
  }
}
