import { NumberCell } from '~/components/table/cells/number-cell'
import { TwoRowCell } from '~/components/table/cells/two-row-cell'
import { formatTimestamp } from '~/utils/dates'
import { formatUops } from '~/utils/number-format/format-tps'

interface Props {
  maxUops: number
  timestamp: number
}

export function MaxUopsCell({ maxUops, timestamp }: Props) {
  return (
    <TwoRowCell>
      <TwoRowCell.First className="text-right">
        <NumberCell>{formatUops(maxUops)}</NumberCell>
      </TwoRowCell.First>
      <TwoRowCell.Second className="text-right">
        on {formatTimestamp(timestamp)}
      </TwoRowCell.Second>
    </TwoRowCell>
  )
}
