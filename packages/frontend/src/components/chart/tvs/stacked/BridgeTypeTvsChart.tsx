import type { Milestone } from '@l2beat/config'
import type { TooltipProps } from 'recharts'
import { Area, AreaChart } from 'recharts'
import type { ChartMeta, ChartProject } from '~/components/core/chart/Chart'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipWrapper,
} from '~/components/core/chart/Chart'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import { getCommonChartComponents } from '~/components/core/chart/utils/getCommonChartComponents'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { formatPercent } from '~/utils/calculatePercentageChange'
import { formatTimestamp } from '~/utils/dates'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import type { ChartUnit } from '../../types'

interface BridgeTypeChartDataPoint {
  timestamp: number
  native: number | null
  canonical: number | null
  external: number | null
}

interface Props {
  data: BridgeTypeChartDataPoint[] | undefined
  syncedUntil: number | undefined
  milestones: Milestone[]
  unit: ChartUnit
  isLoading: boolean
  dataKeys: (keyof typeof bridgeTypeTvsChartMeta)[]
  toggleDataKey: (dataKey: string) => void
  tickCount?: number
  className?: string
  project?: ChartProject
}

export const bridgeTypeTvsChartMeta = {
  canonical: {
    label: 'Canonically bridged',
    color: 'var(--chart-stacked-purple)',
    indicatorType: { shape: 'square' },
  },
  native: {
    label: 'Natively minted',
    color: 'var(--chart-stacked-pink)',
    indicatorType: { shape: 'square' },
  },
  external: {
    label: 'Externally bridged',
    color: 'var(--chart-stacked-yellow)',
    indicatorType: { shape: 'square' },
  },
} satisfies ChartMeta

export function BridgeTypeTvsChart({
  data,
  syncedUntil,
  milestones,
  unit,
  isLoading,
  className,
  tickCount,
  dataKeys,
  toggleDataKey,
  project,
}: Props) {
  // If only one data key is selected we want to change the domain
  // Having it from 0 to MAX does make sense for stacked chart (better comparison)
  // But for single data source it should not start from 0
  return (
    <ChartContainer
      data={data}
      meta={bridgeTypeTvsChartMeta}
      isLoading={isLoading}
      milestones={milestones}
      interactiveLegend={{
        dataKeys,
        onItemClick: toggleDataKey,
      }}
      className={className}
      project={project}
    >
      <AreaChart data={data} margin={{ top: 20 }}>
        <ChartLegend content={<ChartLegendContent />} />
        <Area
          dataKey="external"
          hide={!dataKeys.includes('external')}
          fill={bridgeTypeTvsChartMeta.external.color}
          fillOpacity={1}
          strokeWidth={0}
          stackId={dataKeys.length === 1 ? undefined : 'a'}
          isAnimationActive={false}
          activeDot={
            !dataKeys.includes('canonical') && !dataKeys.includes('native')
          }
        />
        <Area
          dataKey="native"
          hide={!dataKeys.includes('native')}
          fill={bridgeTypeTvsChartMeta.native.color}
          fillOpacity={1}
          strokeWidth={0}
          stackId={dataKeys.length === 1 ? undefined : 'a'}
          isAnimationActive={false}
          activeDot={!dataKeys.includes('canonical')}
        />
        <Area
          dataKey="canonical"
          hide={!dataKeys.includes('canonical')}
          fill={bridgeTypeTvsChartMeta.canonical.color}
          fillOpacity={1}
          strokeWidth={0}
          stackId={dataKeys.length === 1 ? undefined : 'a'}
          isAnimationActive={false}
        />
        {getCommonChartComponents({
          data,
          isLoading,
          yAxis: {
            domain: dataKeys.length === 1 ? ['auto', 'auto'] : undefined,
            tickFormatter: (value: number) => formatCurrency(value, unit),
            tickCount,
          },
          syncedUntil,
        })}
        <ChartTooltip
          content={<CustomTooltip unit={unit} />}
          filterNull={false}
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
}: TooltipProps<number, string> & { unit: ChartUnit }) {
  if (!active || !payload || typeof label !== 'number') return null

  const total = payload.reduce<number | null>((acc, curr) => {
    if (curr.value === null || curr.value === undefined || curr.hide) {
      return acc
    }
    if (acc === null) {
      return curr?.value ?? null
    }
    return acc + curr.value
  }, null)
  const actualPayload = [...payload].reverse().filter((entry) => !entry.hide)

  return (
    <ChartTooltipWrapper>
      <div className="flex w-46 flex-col sm:w-66!">
        <div className="font-medium text-label-value-14 text-secondary">
          {formatTimestamp(label, { longMonthName: true, mode: 'datetime' })}
        </div>
        {actualPayload.length > 1 && (
          <>
            <div className="mt-3 flex w-full items-center justify-between gap-2 text-heading-16">
              <span className="[@media(min-width:600px)]:hidden">Total</span>
              <span className="hidden [@media(min-width:600px)]:inline">
                Total value secured
              </span>
              <span className="text-primary">
                {total !== null ? formatCurrency(total, unit) : 'No data'}
              </span>
            </div>
            <HorizontalSeparator className="mt-1.5" />
          </>
        )}
        <div className="mt-2 flex flex-col gap-2">
          {actualPayload.map((entry) => {
            if (entry.type === 'none') return null
            const config =
              bridgeTypeTvsChartMeta[
                entry.name as keyof typeof bridgeTypeTvsChartMeta
              ]
            return (
              <div
                key={entry.name}
                className="flex items-center justify-between gap-x-1"
              >
                <span className="flex items-center gap-1">
                  <ChartDataIndicator
                    backgroundColor={config.color}
                    type={config.indicatorType}
                  />
                  <span className="w-20 font-medium text-label-value-14 sm:w-fit">
                    {config.label}
                  </span>
                </span>
                <div className="flex items-end justify-end gap-1 max-sm:flex-col sm:items-center">
                  <span className="whitespace-nowrap font-medium text-label-value-15">
                    {entry.value !== null && entry.value !== undefined
                      ? formatCurrency(entry.value, unit)
                      : 'No data'}
                  </span>
                  {entry.value !== null &&
                    entry.value !== undefined &&
                    total !== null && (
                      <span className="font-medium text-label-value-13 text-secondary sm:text-label-value-15">
                        ({formatPercent(entry.value / total)})
                      </span>
                    )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </ChartTooltipWrapper>
  )
}
