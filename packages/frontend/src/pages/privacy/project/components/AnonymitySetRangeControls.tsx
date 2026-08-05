import { ChartRangeControls } from '~/components/core/chart/ChartRangeControls'
import type { ChartRange } from '~/utils/range/range'

interface Props {
  range: ChartRange
  setRange: (value: ChartRange) => void
  /** The snapshot's `asOf`, in seconds - the last day the data covers. */
  anchor: number
}

export function AnonymitySetRangeControls({ range, setRange, anchor }: Props) {
  return (
    <ChartRangeControls
      name="anonymitySet"
      value={range}
      setValue={setRange}
      anchor={anchor}
      options={[
        { value: '30d', label: '30D' },
        { value: '90d', label: '90D' },
        { value: '180d', label: '180D' },
        { value: '1y', label: '1Y' },
        { value: 'max', label: 'MAX' },
      ]}
    />
  )
}
