import { UnixTime } from '@l2beat/shared-pure'
import { useMemo } from 'react'
import type { TooltipProps } from 'recharts'
import { AreaChart } from 'recharts'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipWrapper,
  useChart,
} from '~/components/core/chart/Chart'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import { EthereumFillGradientDef } from '~/components/core/chart/defs/EthereumGradientDef'
import { FuchsiaFillGradientDef } from '~/components/core/chart/defs/FuchsiaGradientDef'
import { LimeFillGradientDef } from '~/components/core/chart/defs/LimeGradientDef'
import { NoDataPatternDef } from '~/components/core/chart/defs/NoDataPatternDef'
import { SkyFillGradientDef } from '~/components/core/chart/defs/SkyGradientDef'
import { useChartDataKeys } from '~/components/core/chart/hooks/useChartDataKeys'
import { getCommonChartComponents } from '~/components/core/chart/utils/getCommonChartComponents'
import { getStrokeOverFillAreaComponents } from '~/components/core/chart/utils/getStrokeOverFillAreaComponents'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import type { DaThroughputDataPoint } from '~/server/features/data-availability/throughput/getDaThroughputChart'
import type { DaThroughputResolution } from '~/server/features/data-availability/throughput/utils/range'
import { formatRange } from '~/utils/dates'
import { getDaDataParams } from './getDaDataParams'
import { getDaChartMeta } from './meta'

interface Props {
  data: DaThroughputDataPoint[] | undefined
  isLoading: boolean
  includeScalingOnly: boolean
  syncStatus?: Record<string, number>
  resolution: DaThroughputResolution
}

export function DaAbsoluteThroughputChart({
  data,
  isLoading,
  includeScalingOnly,
  syncStatus,
  resolution,
}: Props) {
  const chartMeta = useMemo(() => getDaChartMeta({ shape: 'line' }), [])
  const { dataKeys, toggleDataKey } = useChartDataKeys(chartMeta)
  const max = useMemo(() => {
    return data
      ? Math.max(
          ...data.map(([_, ...rest]) =>
            Math.max(...rest.filter((x) => x !== null)),
          ),
        )
      : undefined
  }, [data])
  const { denominator, unit } = getDaDataParams(max)
  const chartData = useMemo(() => {
    return data?.map(([timestamp, ethereum, celestia, avail, eigenda]) => {
      const ethereumValue = ethereum !== null ? ethereum / denominator : null
      const celestiaValue = celestia !== null ? celestia / denominator : null
      const availValue = avail !== null ? avail / denominator : null
      const eigendaValue = eigenda !== null ? eigenda / denominator : null

      return {
        timestamp,
        ethereum:
          syncStatus?.ethereum && syncStatus.ethereum >= timestamp
            ? ethereumValue
            : null,
        ethereumEstimated:
          syncStatus?.ethereum && syncStatus.ethereum <= timestamp
            ? ethereumValue
            : null,
        celestia:
          syncStatus?.celestia && syncStatus.celestia >= timestamp
            ? celestiaValue
            : null,
        celestiaEstimated:
          syncStatus?.celestia && syncStatus.celestia <= timestamp
            ? celestiaValue
            : null,
        avail:
          syncStatus?.avail && syncStatus.avail >= timestamp
            ? availValue
            : null,
        availEstimated:
          syncStatus?.avail && syncStatus.avail <= timestamp
            ? availValue
            : null,
        eigenda:
          syncStatus?.eigenda && syncStatus.eigenda >= timestamp
            ? eigendaValue
            : null,
        eigendaEstimated:
          syncStatus?.eigenda && syncStatus.eigenda <= timestamp
            ? eigendaValue
            : null,
      }
    })
  }, [data, denominator, syncStatus])

  const syncedUntil = useMemo(
    () => Math.max(...Object.values(syncStatus ?? {})),
    [syncStatus],
  )

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
      <AreaChart accessibilityLayer data={chartData} margin={{ top: 20 }}>
        <defs>
          <EthereumFillGradientDef id="ethereum-fill" />
          <FuchsiaFillGradientDef id="celestia-fill" />
          <LimeFillGradientDef id="eigenda-fill" />
          <SkyFillGradientDef id="avail-fill" />
          <NoDataPatternDef />
        </defs>
        <ChartLegend content={<ChartLegendContent />} />
        {getStrokeOverFillAreaComponents({
          data: Object.keys(chartMeta).flatMap((key) => {
            const actualKey = key as keyof typeof chartMeta
            const estimatedKey = `${actualKey}Estimated`
            return [
              {
                dataKey: actualKey,
                stroke: chartMeta[actualKey].color,
                fill: `url(#${actualKey}-fill)`,
                hide: !dataKeys.includes(actualKey),
              },
              {
                dataKey: estimatedKey,
                stroke: chartMeta[actualKey].color,
                strokeDasharray: '3 3',
                fill: 'none',
                hide: !dataKeys.includes(actualKey),
              },
            ]
          }),
        })}

        {getCommonChartComponents({
          data: chartData,
          isLoading,
          yAxis: {
            domain: dataKeys.length === 1 ? ['auto', 'auto'] : undefined,
            unit: ` ${unit}`,
            tickCount: 3,
          },
          syncedUntil,
        })}
        <ChartTooltip
          filterNull={false}
          content={
            <CustomTooltip
              unit={unit}
              includeScalingOnly={includeScalingOnly}
              syncStatus={syncStatus}
              resolution={resolution}
            />
          }
        />
      </AreaChart>
    </ChartContainer>
  )
}

function CustomTooltip({
  active,
  payload,
  label,
  unit,
  includeScalingOnly,
  syncStatus,
  resolution,
}: TooltipProps<number, string> & {
  unit: string
  includeScalingOnly: boolean
  syncStatus?: Record<string, number>
  resolution: DaThroughputResolution
}) {
  const { meta: config } = useChart()
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
          if (entry.type === 'none' || entry.hide) return null
          const configEntry = entry.name ? config[entry.name] : undefined
          if (!configEntry) return null

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
                  ? `${isEstimated ? 'est. ' : ''} ${value.toFixed(2)} ${unit}`
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
