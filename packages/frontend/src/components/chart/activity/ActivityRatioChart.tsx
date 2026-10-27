import { assert, formatActivityCount, UnixTime } from '@l2beat/shared-pure'
import round from 'lodash/round'
import { type ChartMeta, useChart } from '~/components/core/chart/ChartContext'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import { EmeraldFillGradientDef } from '~/components/core/chart/defs/EmeraldGradientDef'
import { TsChartContainer } from '~/components/core/chart/tanstack/TsChartContainer'
import {
  TsChartTooltipWrapper,
  TsTimeSeriesChart,
} from '~/components/core/chart/tanstack/TsTimeSeriesChart'
import { formatRange } from '~/utils/dates'

interface ActivityRatioChartDataPoint {
  timestamp: number
  ratio: number | null
}

interface Props {
  data: ActivityRatioChartDataPoint[] | undefined
  syncedUntil: number | undefined
  isLoading: boolean
}

export function ActivityRatioChart({ data, isLoading, syncedUntil }: Props) {
  const chartMeta = {
    ratio: {
      label: 'UOPS/TPS Ratio',
      color: 'var(--chart-emerald)',
      indicatorType: {
        shape: 'line',
      },
    },
  } satisfies ChartMeta
  return (
    <TsChartContainer
      data={data}
      meta={chartMeta}
      isLoading={isLoading}
      milestones={undefined}
      size="small"
      legend
    >
      <TsTimeSeriesChart
        data={data}
        ariaLabel="UOPS/TPS ratio"
        margin={{ top: 20 }}
        series={[
          {
            key: 'ratio',
            stroke: chartMeta.ratio.color,
            fill: 'url(#fillRatio)',
          },
        ]}
        yAxis={{
          format: (value) => `${round(value, 2)}x`,
          domain: (_, dataMax) => [1, dataMax + (dataMax - 1) * 0.1],
        }}
        syncedUntil={syncedUntil}
        defs={<EmeraldFillGradientDef id="fillRatio" />}
        renderTooltip={(row) => <ActivityCustomTooltip row={row} />}
      />
    </TsChartContainer>
  )
}

function ActivityCustomTooltip({ row }: { row: ActivityRatioChartDataPoint }) {
  const { meta } = useChart()
  const timestamp = row.timestamp
  const payload = [{ name: 'ratio', value: row.ratio }]

  return (
    <TsChartTooltipWrapper>
      <div className="flex w-40 flex-col sm:w-60">
        <div className="mb-3 whitespace-nowrap font-medium text-label-value-14 text-secondary">
          {formatRange(timestamp, timestamp + UnixTime.DAY)}
        </div>
        <div className="flex flex-col gap-2">
          {payload.map((entry) => {
            const config = meta[entry.name]
            assert(config, 'No config')

            return (
              <div
                key={entry.name}
                className="flex w-full items-center justify-between gap-2"
              >
                <div className="flex items-center gap-1">
                  <ChartDataIndicator
                    backgroundColor={config.color}
                    type={config.indicatorType}
                  />
                  <span className="w-20 font-medium text-label-value-14 sm:w-fit">
                    {config.label}
                  </span>
                </div>
                <span className="whitespace-nowrap font-medium text-label-value-15 tabular-nums">
                  {entry.value === null
                    ? 'No data'
                    : formatActivityCount(entry.value)}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </TsChartTooltipWrapper>
  )
}
