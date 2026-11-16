import { ChartRangeControls } from '~/components/core/chart/ChartRangeControls'
import type { ChartRange } from '~/utils/range/range'

interface Props {
  range: ChartRange
  setRange: (range: ChartRange) => void
}

export function LivenessChartRangeControls({ range, setRange }: Props) {
  return (
    <ChartRangeControls
      name="liveness"
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
