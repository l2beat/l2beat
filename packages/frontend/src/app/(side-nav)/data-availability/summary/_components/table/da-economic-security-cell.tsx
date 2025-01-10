import { assertUnreachable } from '@l2beat/shared-pure'
import { type DaSummaryEntry } from '~/server/features/data-availability/summary/get-da-summary-entries'
import { formatTvlTableNumber } from '~/utils/number-format/format-tvl-number'

export function DaEconomicSecurityCell({
  value,
}: { value: DaSummaryEntry['economicSecurity'] }) {
  if (!value) return formatTvlTableNumber(0)

  switch (value.status) {
    case 'Synced':
      return formatTvlTableNumber(value.economicSecurity)
    case 'StakeNotSynced':
      return 'Stake not synced'
    case 'CurrentPriceNotSynced':
      return 'Current price not synced'
    default:
      assertUnreachable(value)
  }
}
