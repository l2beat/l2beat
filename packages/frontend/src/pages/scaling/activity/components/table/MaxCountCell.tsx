import { NumberCell } from '~/components/table/cells/NumberCell'
import { TwoRowCell } from '~/components/table/cells/TwoRowCell'
import { formatTimestamp } from '~/utils/dates'
import { formatActivityCount } from '~/utils/number-format/formatActivityCount'

interface Props {
  maxCount: number
  timestamp: number
}

export function MaxCountCell({ maxCount, timestamp }: Props) {
  return (
    <TwoRowCell>
      <TwoRowCell.First className="text-right">
        <NumberCell>{formatActivityCount(maxCount)}</NumberCell>
      </TwoRowCell.First>
      <TwoRowCell.Second className="text-right">
        on {formatTimestamp(timestamp)}
      </TwoRowCell.Second>
    </TwoRowCell>
  )
}
