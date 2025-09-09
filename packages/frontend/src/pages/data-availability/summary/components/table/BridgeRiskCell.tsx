import { ProjectId } from '@l2beat/shared-pure'
import { GrissiniCell } from '~/components/rosette/grissini/GrissiniCell'
import type {
  DaBridgeSummaryEntry,
  DaSummaryEntry,
} from '~/server/features/data-availability/summary/getDaSummaryEntries'

export function BridgeRiskCell({
  layer,
  bridge,
}: {
  bridge: DaBridgeSummaryEntry
  layer: DaSummaryEntry
}) {
  return (
    <GrissiniCell
      values={bridge.risks}
      href={
        layer.id === ProjectId.ETHEREUM
          ? undefined
          : `/data-availability/risk?tab=${layer.tab}&highlight=${layer.slug}`
      }
      disabledOnMobile
    />
  )
}
