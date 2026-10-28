import type { Milestone } from '@l2beat/config'
import {
  assert,
  formatActivityCount,
  formatInteger,
  UnixTime,
} from '@l2beat/shared-pure'
import { scaleSymlog } from 'd3-scale'
import { useMemo } from 'react'
import { ChartContainer } from '~/components/core/chart/ChartContainer'
import type { ChartMeta } from '~/components/core/chart/ChartContext'
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
import {
  ChartTooltipWrapper,
  TimeSeriesChart,
} from '~/components/core/chart/TimeSeriesChart'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import {
  type ActivityMetric,
  useActivityMetricContext,
} from '~/pages/layer2s/activity/components/ActivityMetricContext'
import type { RecategorisedActivityChartData } from '~/server/features/layer2s/activity/getRecategorisedActivityChart'
import { countPerSecond } from '~/server/features/layer2s/activity/utils/countPerSecond'
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

const SERIES_GRADIENT_ID = {
  rollups: 'rollups',
  validiumsAndOptimiums: 'validiums-and-optimiums',
  others: 'others',
  ethereum: 'ethereum',
} as const

type SeriesKey = keyof typeof SERIES_GRADIENT_ID

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
      legend
      interactiveLegend={{
        dataKeys,
        onItemClick,
        disableOnboarding: true,
      }}
      milestones={milestones}
    >
      <TimeSeriesChart
        data={chartData}
        ariaLabel="Activity"
        margin={{ top: 20, right: 1 }}
        series={(
          ['rollups', 'validiumsAndOptimiums', 'others', 'ethereum'] as const
        ).map((key) => ({
          key,
          stroke: `url(#${SERIES_GRADIENT_ID[key]}-stroke)`,
          fill: `url(#${SERIES_GRADIENT_ID[key]}-fill)`,
          hidden: !dataKeys.includes(key),
        }))}
        yAxis={{
          scale: scale === 'symlog' ? scaleSymlog : undefined,
          domain: dataKeys.length === 1 ? 'auto' : undefined,
          unit: metric === 'uops' ? ' UOPS' : ' TPS',
        }}
        syncedUntil={data?.syncedUntil}
        defs={
          <>
            <PinkFillGradientDef id="rollups-fill" />
            <PinkStrokeGradientDef id="rollups-stroke" />
            <CyanFillGradientDef id="validiums-and-optimiums-fill" />
            <CyanStrokeGradientDef id="validiums-and-optimiums-stroke" />
            <YellowFillGradientDef id="others-fill" />
            <YellowStrokeGradientDef id="others-stroke" />
            <EthereumFillGradientDef id="ethereum-fill" />
            <EthereumStrokeGradientDef id="ethereum-stroke" />
          </>
        }
        renderTooltip={(row, keys) => (
          <CustomTooltip
            row={row}
            visibleKeys={keys}
            syncedUntil={data?.syncedUntil}
            metric={metric}
            chartMeta={chartMeta}
          />
        )}
      />
    </ChartContainer>
  )
}

function CustomTooltip({
  row,
  visibleKeys,
  syncedUntil,
  metric,
  chartMeta,
}: {
  row: { timestamp: number } & Record<SeriesKey, number | null>
  visibleKeys: SeriesKey[]
  syncedUntil: number | undefined
  metric: ActivityMetric
  chartMeta: ChartMeta
}) {
  const label = row.timestamp
  const payload = visibleKeys.map((name) => ({ name, value: row[name] }))

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
                  {entry.value !== null
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
            if (entry.value === null) return null
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
