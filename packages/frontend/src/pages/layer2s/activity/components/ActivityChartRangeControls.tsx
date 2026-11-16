import { ChartRangeControls } from '~/components/core/chart/ChartRangeControls'
import type { ChartRange } from '~/utils/range/range'

interface Props {
  range: ChartRange
  setRange: (range: ChartRange) => void
  /**
   * Only charts that read hourly activity can show a day or a week, and
   * projects indexed per day have no hours
   */
  hourlyRanges?: 'enabled' | 'disabled'
}

export function ActivityChartRangeControls({
  range,
  setRange,
  hourlyRanges,
}: Props) {
  const hourlyDisabled = hourlyRanges === 'disabled'
  return (
    <ChartRangeControls
      name="activity"
      value={range}
      setValue={setRange}
      options={[
        ...(hourlyRanges
          ? (['1d', '7d'] as const).map((value) => ({
              value,
              label: value.toUpperCase(),
              disabled: hourlyDisabled,
              disabledReason: 'This project reports its activity per day only',
            }))
          : []),
        { value: '30d', label: '30D' },
        { value: '90d', label: '90D' },
        { value: '180d', label: '180D' },
        { value: '1y', label: '1Y' },
        { value: 'max', label: 'MAX' },
      ]}
    />
  )
}
