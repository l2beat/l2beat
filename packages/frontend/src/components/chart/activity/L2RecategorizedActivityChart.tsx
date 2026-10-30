import type { Milestone } from '@l2beat/config'
import {
  assert,
  formatActivityCount,
  formatInteger,
  UnixTime,
} from '@l2beat/shared-pure'
import { useMemo } from 'react'
import { AreaChart } from 'recharts'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  type ChartMeta,
  ChartTooltip,
  ChartTooltipWrapper,
  type CustomChartTooltipProps,
} from '~/components/core/chart/Chart'
import { ChartCommonComponents } from '~/components/core/chart/ChartCommonComponents'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import { ChartStrokeOverFillAreaComponents } from '~/components/core/chart/utils/getStrokeOverFillAreaComponents'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import {
  type ActivityMetric,
  useActivityMetricContext,
} from '~/pages/layer2s/activity/components/ActivityMetricContext'
import type { RecategorisedActivityChartData } from '~/server/features/layer2s/activity/getRecategorisedActivityChart'
import { formatRange } from '~/utils/dates'
import type { ChartScale } from '../types'

export const RECATEGORISED_ACTIVITY_CHART_META = {
  rollups: {
    label: 'Rollups',
    color: 'var(--chart-pink)',
    indicatorType: {
      shape: 'line',
    },
  },
  validiumsAndOptimiums: {
    label: 'Validiums & Optimiums',
    color: 'var(--chart-cyan)',
    indicatorType: {
      shape: 'line',
    },
  },
  others: {
    label: 'Others',
    color: 'var(--chart-yellow)',
    indicatorType: {
      shape: 'line',
    },
  },
  ethereum: {
    label: 'Ethereum',
    color: 'var(--chart-ethereum)',
    indicatorType: {
      shape: 'line',
    },
  },
} satisfies ChartMeta

interface Props {
  data: RecategorisedActivityChartData | undefined
  isLoading: boolean
  milestones: Milestone[]
  chartMeta: ChartMeta
  interactiveLegend: {
    dataKeys: string[]
    onItemClick: (dataKey: string) => void
  }
  scale?: ChartScale
}

export function L2RecategorizedActivityChart({
  data,
  isLoading,
  milestones,
  scale,
  chartMeta,
  interactiveLegend: { dataKeys, onItemClick },
}: Props) {
  const { metric } = useActivityMetricContext()

  const resolutionSeconds = UnixTime.periodToSeconds(data?.resolution ?? 'day')
  const chartData = useMemo(() => {
    const getDataPoint = (uops: number | null, tx: number | null) => {
      const count = metric === 'uops' ? uops : tx
      return count !== null ? count / resolutionSeconds : null
    }

    return data?.data.map(
      ([
        timestamp,
        rollupsUops,
        validiumsAndOptimiumsUops,
        othersUops,
        ethereumUops,
        rollupsTx,
        validiumsAndOptimiumsTx,
        othersTx,
        ethereumTx,
      ]) => {
        return {
          timestamp,
          rollups: getDataPoint(rollupsUops, rollupsTx),
          validiumsAndOptimiums: getDataPoint(
            validiumsAndOptimiumsUops,
            validiumsAndOptimiumsTx,
          ),
          others: getDataPoint(othersUops, othersTx),
          ethereum: getDataPoint(ethereumUops, ethereumTx),
        }
      },
    )
  }, [data, metric, resolutionSeconds])

  return (
    <ChartContainer
      meta={chartMeta}
      data={chartData}
      isLoading={isLoading}
      interactiveLegend={{
        dataKeys,
        onItemClick,
        disableOnboarding: true,
      }}
      milestones={milestones}
    >
      {/* Without right:1 the chart last point is not hoverable for some reason */}
      <AreaChart responsive data={chartData} margin={{ top: 20, right: 1 }}>
        <ChartLegend content={<ChartLegendContent />} />
        <ChartStrokeOverFillAreaComponents
          data={[
            {
              dataKey: 'rollups',
              stroke: RECATEGORISED_ACTIVITY_CHART_META.rollups.color,
              hide: !dataKeys.includes('rollups'),
            },
            {
              dataKey: 'validiumsAndOptimiums',
              stroke:
                RECATEGORISED_ACTIVITY_CHART_META.validiumsAndOptimiums.color,
              hide: !dataKeys.includes('validiumsAndOptimiums'),
            },
            {
              dataKey: 'others',
              stroke: RECATEGORISED_ACTIVITY_CHART_META.others.color,
              hide: !dataKeys.includes('others'),
            },
            {
              dataKey: 'ethereum',
              stroke: RECATEGORISED_ACTIVITY_CHART_META.ethereum.color,
              hide: !dataKeys.includes('ethereum'),
            },
          ]}
        />
        <ChartTooltip
          content={
            <CustomTooltip
              syncedUntil={data?.syncedUntil}
              resolutionSeconds={resolutionSeconds}
              metric={metric}
              chartMeta={chartMeta}
            />
          }
        />
        <ChartCommonComponents
          data={chartData}
          isLoading={isLoading}
          yAxis={{
            scale: scale === 'linear' ? 'auto' : scale,
            domain: dataKeys.length === 1 ? ['auto', 'auto'] : undefined,
            unit: metric === 'uops' ? ' UOPS' : ' TPS',
          }}
          syncedUntil={data?.syncedUntil}
        />
      </AreaChart>
    </ChartContainer>
  )
}

function CustomTooltip({
  payload,
  label,
  syncedUntil,
  resolutionSeconds,
  metric,
  chartMeta,
}: CustomChartTooltipProps & {
  syncedUntil: number | undefined
  resolutionSeconds: number
  metric: ActivityMetric
  chartMeta: ChartMeta
}) {
  if (!payload || typeof label !== 'number') return null

  return (
    <ChartTooltipWrapper>
      <div className="flex w-40 flex-col sm:w-60">
        <div className="mb-3 whitespace-nowrap font-medium text-label-value-14 text-secondary">
          {formatRange(label, label + resolutionSeconds)}
        </div>
        <span className="text-heading-16">Average {metric.toUpperCase()}</span>
        <HorizontalSeparator className="mt-1.5" />
        <div className="mt-2 flex flex-col gap-2">
          {payload.map((entry) => {
            if (entry.type === 'none') return null
            const config = chartMeta[entry.name as keyof typeof chartMeta]
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
                  {entry.value !== null && entry.value !== undefined
                    ? formatActivityCount(entry.value)
                    : 'No data'}
                </span>
              </div>
            )
          })}
        </div>

        <span className="mt-3 text-heading-16">
          {metric === 'uops' ? 'Operations' : 'Transactions'} count
        </span>
        <HorizontalSeparator className="mt-1.5" />
        <div className="mt-2 flex flex-col gap-2">
          {payload.map((entry) => {
            if (
              entry.value === undefined ||
              entry.value === null ||
              entry.type === 'none'
            )
              return null
            const config = chartMeta[entry.name as keyof typeof chartMeta]
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
                  {syncedUntil && syncedUntil < label
                    ? 'No data'
                    : formatInteger(entry.value * resolutionSeconds)}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </ChartTooltipWrapper>
  )
}
