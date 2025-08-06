import { UnixTime } from '@l2beat/shared-pure'
import round from 'lodash/round'
import { useMemo } from 'react'
import type { TooltipProps } from 'recharts'
import { Bar, BarChart } from 'recharts'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipWrapper,
  useChart,
} from '~/components/core/chart/Chart'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import { useChartDataKeys } from '~/components/core/chart/hooks/useChartDataKeys'
import { getCommonChartComponents } from '~/components/core/chart/utils/getCommonChartComponents'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import type { DaThroughputDataPoint } from '~/server/features/data-availability/throughput/getDaThroughputChart'
import type { DaThroughputResolution } from '~/server/features/data-availability/throughput/utils/range'
import { formatRange } from '~/utils/dates'
import { getDaChartMeta } from './meta'

interface Props {
  data: DaThroughputDataPoint[] | undefined
  isLoading: boolean
  includeScalingOnly: boolean
  syncStatus?: Record<string, number>
  resolution: DaThroughputResolution
}
export function DaPercentageThroughputChart({
  data,
  isLoading,
  includeScalingOnly,
  syncStatus,
  resolution,
}: Props) {
  const chartMeta = getDaChartMeta({ shape: 'square' })
  const { dataKeys, toggleDataKey } = useChartDataKeys(chartMeta)
  const chartData = useMemo(() => {
    return data?.map(([timestamp, ethereum, celestia, avail, eigenda]) => {
      const toSum = [
        dataKeys.includes('ethereum') ? ethereum : 0,
        dataKeys.includes('celestia') ? celestia : 0,
        dataKeys.includes('avail') ? avail : 0,
        dataKeys.includes('eigenda') ? eigenda : 0,
      ].filter((e) => e !== null)

      const total = toSum.reduce((acc, curr) => acc + curr, 0)
      if (total === 0) {
        return {
          timestamp: timestamp,
          ethereum: ethereum !== null ? 0 : null,
          celestia: celestia !== null ? 0 : null,
          avail: avail !== null ? 0 : null,
          eigenda: eigenda !== null ? 0 : null,
        }
      }
      return {
        timestamp: timestamp,
        ethereum: ethereum !== null ? round((ethereum / total) * 100, 2) : null,
        celestia: celestia !== null ? round((celestia / total) * 100, 2) : null,
        avail: avail !== null ? round((avail / total) * 100, 2) : null,
        eigenda: eigenda !== null ? round((eigenda / total) * 100, 2) : null,
      }
    })
  }, [data, dataKeys])

  const syncedUntil = Math.max(...Object.values(syncStatus ?? {}))

  return (
    <ChartContainer
      data={chartData}
      meta={chartMeta}
      isLoading={isLoading}
      interactiveLegend={{
        dataKeys,
        onItemClick: toggleDataKey,
      }}
    >
      <BarChart
        accessibilityLayer
        data={chartData}
        margin={{ top: 20 }}
        barCategoryGap={0}
      >
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          dataKey="ethereum"
          stackId="a"
          fill={chartMeta.ethereum.color}
          isAnimationActive={false}
          hide={!dataKeys.includes('ethereum')}
        />
        <Bar
          dataKey="avail"
          stackId="a"
          fill={chartMeta.avail.color}
          isAnimationActive={false}
          hide={!dataKeys.includes('avail')}
        />
        <Bar
          dataKey="celestia"
          stackId="a"
          fill={chartMeta.celestia.color}
          isAnimationActive={false}
          hide={!dataKeys.includes('celestia')}
        />
        <Bar
          dataKey="eigenda"
          stackId="a"
          fill={chartMeta.eigenda.color}
          isAnimationActive={false}
          hide={!dataKeys.includes('eigenda')}
        />
        {getCommonChartComponents({
          data: chartData,
          isLoading,
          yAxis: {
            unit: '%',
            // To avoid showing 100.000001% we specify domain manually
            domain: [0, 100],
            // And allow data overflow to avoid Y Axis labels being off
            allowDataOverflow: true,
          },
          chartType: 'bar',
          syncedUntil,
        })}
        <ChartTooltip
          filterNull={false}
          content={
            <CustomTooltip
              includeScalingOnly={includeScalingOnly}
              syncStatus={syncStatus}
              resolution={resolution}
            />
          }
        />
      </BarChart>
    </ChartContainer>
  )
}

function CustomTooltip({
  active,
  payload,
  label,
  includeScalingOnly,
  syncStatus,
  resolution,
}: TooltipProps<number, string> & {
  includeScalingOnly: boolean
  syncStatus?: Record<string, number>
  resolution: DaThroughputResolution
}) {
  const { meta } = useChart()
  if (!active || !payload || typeof label !== 'number') return null

  const isCurrentDay = label >= UnixTime.toStartOf(UnixTime.now(), 'day')

  return (
    <ChartTooltipWrapper>
      <div className="font-medium text-label-value-14 text-secondary">
        {formatRange(
          label,
          label +
            (resolution === 'daily'
              ? UnixTime.DAY
              : resolution === 'sixHourly'
                ? UnixTime.HOUR * 6
                : UnixTime.HOUR),
        )}
      </div>
      <HorizontalSeparator className="my-1" />
      <div className="flex flex-col gap-2">
        {payload.map((entry, index) => {
          const configEntry = entry.name ? meta[entry.name] : undefined
          if (!configEntry || entry.hide) return null

          const projectSyncStatus = entry.name
            ? syncStatus?.[entry.name]
            : undefined

          const isEstimated = projectSyncStatus && projectSyncStatus < label

          return (
            <div
              key={index}
              className="flex items-center justify-between gap-x-6"
            >
              <div className="flex items-center gap-1">
                <ChartDataIndicator
                  backgroundColor={configEntry.color}
                  type={configEntry.indicatorType}
                />
                <span className="font-medium text-label-value-14">
                  {configEntry.label}
                </span>
              </div>
              <span className="font-medium text-label-value-15 text-primary tabular-nums">
                {entry.value !== null && entry.value !== undefined
                  ? `${isEstimated ? 'est. ' : ''} ${entry.value?.toFixed(2)}%`
                  : 'No data'}
              </span>
            </div>
          )
        })}
      </div>
      {includeScalingOnly && isCurrentDay && (
        <div className="mt-2 max-w-[230px] font-medium text-label-value-13 text-secondary leading-[130%]">
          Scaling project usage data for EigenDA is only available for the past
          day.
        </div>
      )}
    </ChartTooltipWrapper>
  )
}
