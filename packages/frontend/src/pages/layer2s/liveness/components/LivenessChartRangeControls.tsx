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
        { value: '7d', label: '7d' },
        { value: '30d', label: '30d' },
        { value: '90d', label: '90d' },
        { value: '180d', label: '180d' },
        { value: '1y', label: '1y' },
        { value: 'max', label: 'Max' },
      ]}
    />
  )
}
