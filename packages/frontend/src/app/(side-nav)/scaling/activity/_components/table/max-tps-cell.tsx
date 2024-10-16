import { NumberCell } from '~/components/table/cells/number-cell'
import {
  TwoRowCell,
  TwoRowCellFirstRow,
  TwoRowCellSecondRow,
} from '~/components/table/cells/two-row-cell'
import { formatTimestamp } from '~/utils/dates'
import { formatTps } from '~/utils/number-format/format-tps'

interface Props {
  maxTps: number
  timestamp: number
}

export function MaxTpsCell({ maxTps, timestamp }: Props) {
  return (
    <TwoRowCell>
      <TwoRowCellFirstRow className="text-right">
        <NumberCell>{formatTps(maxTps)}</NumberCell>
      </TwoRowCellFirstRow>
      <TwoRowCellSecondRow className="text-right">
        on {formatTimestamp(timestamp)}
      </TwoRowCellSecondRow>
    </TwoRowCell>
  )
}
