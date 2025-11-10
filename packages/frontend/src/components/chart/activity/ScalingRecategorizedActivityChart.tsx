import type { Milestone } from '@l2beat/config'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { useMemo } from 'react'
import { AreaChart, type TooltipProps } from 'recharts'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  type ChartMeta,
  ChartTooltip,
  ChartTooltipWrapper,
} from '~/components/core/chart/Chart'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import {
  CyanFillGradientDef,
  CyanStrokeGradientDef,
} from '~/components/core/chart/defs/CyanGradientDef'
import {
  EthereumFillGradientDef,
  EthereumStrokeGradientDef,
} from '~/components/core/chart/defs/EthereumGradientDef'
import {
  PinkFillGradientDef,
  PinkStrokeGradientDef,
} from '~/components/core/chart/defs/PinkGradientDef'
import {
  YellowFillGradientDef,
  YellowStrokeGradientDef,
} from '~/components/core/chart/defs/YellowGradientDef'
import { getCommonChartComponents } from '~/components/core/chart/utils/getCommonChartComponents'
import { getStrokeOverFillAreaComponents } from '~/components/core/chart/utils/getStrokeOverFillAreaComponents'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import {
  type ActivityMetric,
  useActivityMetricContext,
} from '~/pages/scaling/activity/components/ActivityMetricContext'
import type { RecategorisedActivityChartData } from '~/server/features/scaling/activity/getRecategorisedActivityChart'
import { countPerSecond } from '~/server/features/scaling/activity/utils/countPerSecond'
import { formatRange } from '~/utils/dates'
import { formatActivityCount } from '~/utils/number-format/formatActivityCount'
import { formatInteger } from '~/utils/number-format/formatInteger'

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
}

export function ScalingRecategorizedActivityChart({
  data,
  isLoading,
  milestones,
  chartMeta,
  interactiveLegend: { dataKeys, onItemClick },
}: Props) {
  const { metric } = useActivityMetricContext()

  const chartData = useMemo(() => {
    const getDataPoint = (uops: number | null, tx: number | null) => {
      if (metric === 'uops') {
        return uops !== null ? countPerSecond(uops) : null
      }
      return tx !== null ? countPerSecond(tx) : null
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
  }, [data, metric])

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
      <AreaChart data={chartData} margin={{ top: 20 }}>
        <defs>
          <PinkFillGradientDef id="rollups-fill" />
          <PinkStrokeGradientDef id="rollups-stroke" />
          <CyanFillGradientDef id="validiums-and-optimiums-fill" />
          <CyanStrokeGradientDef id="validiums-and-optimiums-stroke" />
          <YellowFillGradientDef id="others-fill" />
          <YellowStrokeGradientDef id="others-stroke" />
          <EthereumFillGradientDef id="ethereum-fill" />
          <EthereumStrokeGradientDef id="ethereum-stroke" />
        </defs>
        <ChartLegend content={<ChartLegendContent />} />
        {getStrokeOverFillAreaComponents({
          data: [
            {
              dataKey: 'rollups',
              stroke: 'url(#rollups-stroke)',
              fill: 'url(#rollups-fill)',
              hide: !dataKeys.includes('rollups'),
            },
            {
              dataKey: 'validiumsAndOptimiums',
              stroke: 'url(#validiums-and-optimiums-stroke)',
              fill: 'url(#validiums-and-optimiums-fill)',
              hide: !dataKeys.includes('validiumsAndOptimiums'),
            },
            {
              dataKey: 'others',
              stroke: 'url(#others-stroke)',
              fill: 'url(#others-fill)',
              hide: !dataKeys.includes('others'),
            },
            {
              dataKey: 'ethereum',
              stroke: 'url(#ethereum-stroke)',
              fill: 'url(#ethereum-fill)',
              hide: !dataKeys.includes('ethereum'),
            },
          ],
        })}
        <ChartTooltip
          content={
            <CustomTooltip
              syncedUntil={data?.syncedUntil}
              metric={metric}
              chartMeta={chartMeta}
            />
          }
        />
        {getCommonChartComponents({
          data: chartData,
          isLoading,
          yAxis: {
            domain: dataKeys.length === 1 ? ['auto', 'auto'] : undefined,
            unit: metric === 'uops' ? ' UOPS' : ' TPS',
          },
          syncedUntil: data?.syncedUntil,
        })}
      </AreaChart>
    </ChartContainer>
  )
}

function CustomTooltip({
  active,
  payload,
  label,
  syncedUntil,
  metric,
  chartMeta,
}: TooltipProps<number, string> & {
  syncedUntil: number | undefined
  metric: ActivityMetric
  chartMeta: ChartMeta
}) {
  if (!active || !payload || typeof label !== 'number') return null

  return (
    <ChartTooltipWrapper>
      <div className="flex w-40 flex-col sm:w-60">
        <div className="mb-3 whitespace-nowrap font-medium text-label-value-14 text-secondary">
          {formatRange(label, label + UnixTime.DAY)}
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
                    : formatInteger(entry.value * UnixTime.DAY)}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </ChartTooltipWrapper>
  )
}
