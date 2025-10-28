import { UnixTime } from '@l2beat/shared-pure'
import round from 'lodash/round'
import { useMemo } from 'react'
import type { TooltipProps } from 'recharts'
import { Area, Bar, ComposedChart } from 'recharts'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipWrapper,
  useChart,
} from '~/components/core/chart/Chart'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import { EstimatedBarPatternDef } from '~/components/core/chart/defs/EstimatedBarPatternDef'
import { useChartDataKeys } from '~/components/core/chart/hooks/useChartDataKeys'
import { getCommonChartComponents } from '~/components/core/chart/utils/getCommonChartComponents'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import type { DaThroughputDataPoint } from '~/server/features/data-availability/throughput/getDaThroughputChart'
import type {
  DaThroughputResolution,
  DaThroughputTimeRange,
} from '~/server/features/data-availability/throughput/utils/range'
import { formatRange } from '~/utils/dates'
import { getDaChartMeta } from './meta'

interface Props {
  data: DaThroughputDataPoint[] | undefined
  isLoading: boolean
  includeScalingOnly: boolean
  syncStatus?: Record<string, number>
  resolution: DaThroughputResolution
  range: DaThroughputTimeRange
}
export function DaPercentageThroughputChart({
  data,
  isLoading,
  includeScalingOnly,
  syncStatus,
  resolution,
  range,
}: Props) {
  const chartMeta = useMemo(() => getDaChartMeta({ shape: 'square' }), [])
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

      const isEthereumEstimated =
        syncStatus?.ethereum && syncStatus.ethereum < timestamp
      const isCelestiaEstimated =
        syncStatus?.celestia && syncStatus.celestia < timestamp
      const isAvailEstimated = syncStatus?.avail && syncStatus.avail < timestamp
      const isEigenEstimated =
        syncStatus?.eigenda && syncStatus.eigenda < timestamp

      const ethereumValue =
        ethereum !== null ? round((ethereum / total) * 100, 2) : null
      const celestiaValue =
        celestia !== null ? round((celestia / total) * 100, 2) : null
      const availValue = avail !== null ? round((avail / total) * 100, 2) : null
      const eigendaValue =
        eigenda !== null ? round((eigenda / total) * 100, 2) : null

      return {
        timestamp: timestamp,
        ethereum: !isEthereumEstimated ? ethereumValue : null,
        ethereumEstimated: isEthereumEstimated ? ethereumValue : null,
        celestia: !isCelestiaEstimated ? celestiaValue : null,
        celestiaEstimated: isCelestiaEstimated ? celestiaValue : null,
        avail: !isAvailEstimated ? availValue : null,
        availEstimated: isAvailEstimated ? availValue : null,
        eigenda: !isEigenEstimated ? eigendaValue : null,
        eigendaEstimated: isEigenEstimated ? eigendaValue : null,
      }
    })
  }, [data, dataKeys, syncStatus])

  const syncedUntil = Math.max(...Object.values(syncStatus ?? {}))

  const ChartElement = range === 'max' ? Area : Bar

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
      <ComposedChart
        accessibilityLayer
        data={chartData}
        margin={{ top: 20 }}
        barCategoryGap={0}
      >
        <ChartLegend content={<ChartLegendContent />} />
        {Object.keys(chartMeta).map((key) => {
          const actualKey = key as keyof typeof chartMeta
          const estimatedKey = `${actualKey}Estimated`
          return [
            <ChartElement
              key={actualKey}
              dataKey={actualKey}
              stackId="a"
              fill={chartMeta[actualKey].color}
              fillOpacity={1}
              isAnimationActive={false}
              hide={!dataKeys.includes(actualKey)}
              type="step"
            />,
            <ChartElement
              key={estimatedKey}
              dataKey={estimatedKey}
              stackId="a"
              fill={`url(#${estimatedKey}Fill)`}
              fillOpacity={1}
              isAnimationActive={false}
              hide={!dataKeys.includes(actualKey)}
              type="step"
            />,
          ]
        })}

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
        <defs>
          {Object.keys(chartMeta).map((key) => {
            const actualKey = key as keyof typeof chartMeta
            return (
              <EstimatedBarPatternDef
                key={actualKey}
                id={`${actualKey}EstimatedFill`}
                fill={chartMeta[actualKey].color}
              />
            )
          })}
        </defs>
      </ComposedChart>
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

          const estimatedPayload = payload.find(
            (p) => p.name === `${entry.name}Estimated`,
          )

          const value = entry.value ?? estimatedPayload?.value
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
                {value !== null && value !== undefined
                  ? `${isEstimated ? 'est. ' : ''} ${value.toFixed(2)}%`
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
