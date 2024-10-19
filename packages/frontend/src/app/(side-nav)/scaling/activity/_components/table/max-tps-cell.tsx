import { NumberCell } from '~/components/table/cells/number-cell'
import { TwoRowCell } from '~/components/table/cells/two-row-cell'
import { formatTimestamp } from '~/utils/dates'
import { formatTps } from '~/utils/number-format/format-tps'

interface Props {
  maxTps: number
  timestamp: number
}

export function MaxTpsCell({ maxTps, timestamp }: Props) {
  return (
    <TwoRowCell>
      <TwoRowCell.First className="text-right">
        <NumberCell>{formatTps(maxTps)}</NumberCell>
      </TwoRowCell.First>
      <TwoRowCell.Second className="text-right">
        on {formatTimestamp(timestamp)}
      </TwoRowCell.Second>
    </TwoRowCell>
  )
}
