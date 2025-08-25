import type { DaBridgeSummaryEntry } from '~/server/features/data-availability/summary/getDaSummaryEntries'
import { formatDollarValueNumber } from '~/utils/number-format/formatDollarValueNumber'

export function BridgeValueSecuredCell({
  bridge,
}: {
  bridge: DaBridgeSummaryEntry
}) {
  return (
    <span className="font-medium text-sm">
      {formatDollarValueNumber(bridge.tvs.latest)}
    </span>
  )
}
