import type { ChartRange } from '~/utils/range/range'
import { ChartRangeControls } from '../../core/chart/ChartRangeControls'

interface Props {
  range: ChartRange
  setRange: (value: ChartRange) => void
}

export function TvsChartRangeControls({ range, setRange }: Props) {
  return (
    <ChartRangeControls
      name="tvs"
      value={range}
      setValue={setRange}
      options={[
        { value: '7d', label: '7D' },
        { value: '30d', label: '30D' },
        { value: '90d', label: '90D' },
        { value: '180d', label: '180D' },
        { value: '1y', label: '1Y' },
        { value: 'max', label: 'MAX' },
      ]}
    />
  )
}
