import { formatDollarValueNumber } from '@l2beat/shared-pure'
import type { DaBridgeSummaryEntry } from '~/server/features/data-availability/summary/getDaSummaryEntries'

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
