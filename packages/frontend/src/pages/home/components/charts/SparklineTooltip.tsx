import { UnixTime } from '@l2beat/shared-pure'
import type { CustomChartTooltipProps } from '~/components/core/chart/Chart'
import { ChartTooltipWrapper, useChart } from '~/components/core/chart/Chart'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { WEEK_DAYS } from '~/server/features/home/homeSeries'
import { formatRange, formatTimestamp } from '~/utils/dates'
import type { SparklinePoint } from './sparklineScale'

export function SparklineTooltip({
  payload,
  label,
  formatValue,
  partLabels,
  weeklyAverage,
}: CustomChartTooltipProps & {
  formatValue: (value: number) => string
  partLabels: string[] | undefined
  weeklyAverage: boolean | undefined
}) {
  const { meta } = useChart()
  if (!payload || typeof label !== 'number') return null
  const entry = payload[0]
  const config = entry?.name !== undefined ? meta[entry.name] : undefined
  if (!entry || !config) return null
  const point = entry.payload as SparklinePoint | undefined
  const rows = [
    {
      id: 'value',
      label: weeklyAverage ? `${config.label}, daily average` : config.label,
      value: entry.value,
      indicator: true,
    },
    ...(partLabels ?? []).map((partLabel, index) => ({
      id: partLabel,
      label: partLabel,
      value: point?.parts[index],
      indicator: false,
    })),
  ]
  return (
    <ChartTooltipWrapper>
      <div className="flex w-50 flex-col gap-2 sm:w-60">
        <div className="mb-1 whitespace-nowrap font-medium text-label-value-14 text-secondary">
          {weeklyAverage
            ? formatRange(label, label + (WEEK_DAYS - 1) * UnixTime.DAY)
            : formatTimestamp(label)}
        </div>
        {rows.map((row, index) => (
          <div key={row.id}>
            {index === 1 && <HorizontalSeparator className="mb-2" />}
            <div className="flex w-full items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                {row.indicator && (
                  <ChartDataIndicator
                    backgroundColor={config.color}
                    type={config.indicatorType}
                  />
                )}
                <span className="font-medium text-label-value-14">
                  {row.label}
                </span>
              </div>
              <span className="whitespace-nowrap font-medium text-label-value-15 tabular-nums">
                {typeof row.value === 'number'
                  ? formatValue(row.value)
                  : 'No data'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </ChartTooltipWrapper>
  )
}
