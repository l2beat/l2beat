import { useMemo } from 'react'
import { AreaChart } from 'recharts'
import type {
  ChartMeta,
  ChartProject,
  CustomChartTooltipProps,
} from '~/components/core/chart/Chart'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipWrapper,
  useChart,
} from '~/components/core/chart/Chart'
import { ChartCommonComponents } from '~/components/core/chart/ChartCommonComponents'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import { CustomFillGradientDef } from '~/components/core/chart/defs/CustomGradientDef'
import { useChartDataKeys } from '~/components/core/chart/hooks/useChartDataKeys'
import { ChartStrokeOverFillAreaComponents } from '~/components/core/chart/utils/getStrokeOverFillAreaComponents'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { formatRange } from '~/utils/dates'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'

interface PrivacyFlowChartDataPoint {
  timestamp: number
  depositsCount: number
  withdrawalsCount: number
  depositsValueUsd: number
  withdrawalsValueUsd: number
}

interface Props {
  data: PrivacyFlowChartDataPoint[] | undefined
  syncedUntil: number | undefined
  isLoading: boolean
  metric: 'count' | 'value'
  project: ChartProject
}

export function PrivacyFlowChart({
  data,
  syncedUntil,
  isLoading,
  metric,
  project,
}: Props) {
  const chartMeta = useMemo(
    () =>
      ({
        deposits: {
          label: 'Deposits',
          color: 'var(--chart-emerald)',
          indicatorType: { shape: 'line' },
        },
        withdrawals: {
          label: 'Withdrawals',
          color: 'var(--chart-pink)',
          indicatorType: { shape: 'line' },
        },
      }) satisfies ChartMeta,
    [],
  )

  const chartData = useMemo(
    () =>
      data?.map((point) => ({
        timestamp: point.timestamp,
        deposits:
          metric === 'count' ? point.depositsCount : point.depositsValueUsd,
        withdrawals:
          metric === 'count'
            ? point.withdrawalsCount
            : point.withdrawalsValueUsd,
      })),
    [data, metric],
  )

  const { dataKeys, toggleDataKey } = useChartDataKeys(chartMeta)

  return (
    <ChartContainer
      data={chartData}
      meta={chartMeta}
      isLoading={isLoading}
      project={project}
      interactiveLegend={{
        dataKeys,
        onItemClick: toggleDataKey,
      }}
    >
      <AreaChart responsive data={chartData} margin={{ top: 20 }}>
        <defs>
          <CustomFillGradientDef
            id={`privacy-${metric}-deposits-fill`}
            colors={{
              primary: 'var(--chart-emerald)',
              secondary: 'var(--chart-emerald)',
            }}
          />
          <CustomFillGradientDef
            id={`privacy-${metric}-withdrawals-fill`}
            colors={{
              primary: 'var(--chart-pink)',
              secondary: 'var(--chart-pink)',
            }}
          />
        </defs>
        <ChartLegend content={<ChartLegendContent />} />
        <ChartStrokeOverFillAreaComponents
          data={[
            {
              dataKey: 'deposits',
              stroke: 'var(--chart-emerald)',
              fill: `url(#privacy-${metric}-deposits-fill)`,
              hide: !dataKeys.includes('deposits'),
            },
            {
              dataKey: 'withdrawals',
              stroke: 'var(--chart-pink)',
              fill: `url(#privacy-${metric}-withdrawals-fill)`,
              hide: !dataKeys.includes('withdrawals'),
            },
          ]}
        />
        <ChartTooltip
          filterNull={false}
          content={<PrivacyFlowChartTooltip metric={metric} />}
        />
        <ChartCommonComponents
          data={chartData}
          isLoading={isLoading}
          yAxis={{
            tickCount: 4,
            tickFormatter: (value) =>
              metric === 'count'
                ? formatInteger(Number(value))
                : formatCurrency(Number(value), 'usd'),
          }}
          syncedUntil={syncedUntil}
        />
      </AreaChart>
    </ChartContainer>
  )
}

function PrivacyFlowChartTooltip({
  payload,
  label,
  metric,
}: CustomChartTooltipProps & {
  metric: 'count' | 'value'
}) {
  const { meta } = useChart()
  if (!payload || typeof label !== 'number') return null

  return (
    <ChartTooltipWrapper>
      <div className="font-medium text-label-value-14 text-secondary">
        {formatRange(label, label + 1 * 24 * 60 * 60)}
      </div>
      <HorizontalSeparator className="my-2" />
      <div className="flex flex-col gap-2">
        {payload.map((entry) => {
          if (entry.name === undefined || entry.hide || entry.type === 'none') {
            return null
          }

          const config = meta[entry.name]
          if (!config) return null

          return (
            <div
              key={entry.name}
              className="flex items-center justify-between gap-x-6"
            >
              <div className="flex items-center gap-1">
                <ChartDataIndicator
                  type={config.indicatorType}
                  backgroundColor={config.color}
                />
                <span className="font-medium text-label-value-14">
                  {config.label}
                </span>
              </div>
              <span className="font-medium text-label-value-15 text-primary tabular-nums">
                {metric === 'count'
                  ? formatInteger(Number(entry.value ?? 0))
                  : formatCurrency(Number(entry.value ?? 0), 'usd')}
              </span>
            </div>
          )
        })}
      </div>
    </ChartTooltipWrapper>
  )
}
