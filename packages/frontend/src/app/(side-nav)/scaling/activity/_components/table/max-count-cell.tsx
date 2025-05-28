import { formatActivityCount } from 'rewrite/src/utils/number-format/format-activity-count'
import { NumberCell } from '~/components/table/cells/number-cell'
import { TwoRowCell } from '~/compone~/utils/number-format/format-activity-count
import { formatTimestamp } from '~/utils/dates'

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
