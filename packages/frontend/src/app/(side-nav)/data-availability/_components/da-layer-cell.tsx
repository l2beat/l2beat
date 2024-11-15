import { TwoRowCell } from '~/components/table/cells/two-row-cell'
import { type DaRiskEntry } from '~/server/features/data-availability/risks/get-da-risk-entries'
import {
  type DaSummaryEntry,
  type DaSummaryEthereumEntry,
} from '~/server/features/data-availability/summary/get-da-summary-entries'
import { kindToType } from '~/server/features/data-availability/utils/kind-to-layer-type'

export function DaLayerCell({
  entry,
}: { entry: DaRiskEntry | DaSummaryEntry | DaSummaryEthereumEntry }) {
  return (
    <TwoRowCell>
      <TwoRowCell.First className="font-bold leading-5">
        {entry.name}
      </TwoRowCell.First>
      <TwoRowCell.Second>{kindToType(entry.kind)}</TwoRowCell.Second>
    </TwoRowCell>
  )
}
