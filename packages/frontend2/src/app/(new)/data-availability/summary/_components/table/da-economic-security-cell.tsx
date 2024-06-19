import { EM_DASH } from '~/app/_components/nav/consts'
import { type DaSummaryEntry } from '~/server/features/data-availability/get-da-summary-entries'
import { formatNumber } from '~/utils/format-number'

export function DaEconomicSecurityCell({
  value,
}: { value: DaSummaryEntry['economicSecurity'] }) {
  if (!value) return EM_DASH
  if (value.status === 'StakeNotSynced') return 'Stake not synced'
  if (value.status === 'CurrentPriceNotSynced')
    return 'Current price not synced'
  return `$${formatNumber(value.economicSecurity, 2)}`
}
