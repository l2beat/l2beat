'use client'
import type { Milestone } from '@l2beat/config'
import { assertUnreachable } from '@l2beat/shared-pure'
import { capitalize } from 'lodash'
import { useMemo } from 'react'
import type { TooltipProps } from 'recharts'
import { Area, AreaChart } from 'recharts'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  type ChartMeta,
  ChartTooltip,
  useChart,
} from '~/components/core/chart/chart'
import { ChartDataIndicator } from '~/components/core/chart/chart-data-indicator'
import {
  PinkFillGradientDef,
  PinkStrokeGradientDef,
} from '~/components/core/chart/defs/pink-gradient-def'
import { getCommonChartComponents } from '~/components/core/chart/utils/get-common-chart-components'
import { RadioGroup, RadioGroupItem } from '~/components/core/radio-group'
import { Skeleton } from '~/components/core/skeleton'
import { tooltipContentVariants } from '~/components/core/tooltip/tooltip'
import { TokenCombobox } from '~/components/token-combobox'
import { useIsClient } from '~/hooks/use-is-client'
import type {
  ProjectToken,
  ProjectTokens,
} from '~/server/features/scaling/tvs/tokens/get-tokens-for-project'
import type { TvsChartRange } from '~/server/features/scaling/tvs/utils/range'
import { api } from '~/trpc/react'
import { cn } from '~/utils/cn'
import { formatTimestamp } from '~/utils/dates'
import { formatCurrency } from '~/utils/number-format/format-currency'
import { ChartControlsWrapper } from '../../core/chart/chart-controls-wrapper'
import { ProjectChartTimeRange } from '../../core/chart/chart-time-range'
import { getChartRange } from '../../core/chart/utils/get-chart-range-from-columns'
import type { ChartUnit } from '../types'
import { TvsChartTimeRangeControls } from './tvs-chart-time-range-controls'

interface Props {
  projectId: string
  isBridge: boolean
  milestones: Milestone[]
  timeRange: TvsChartRange
  setTimeRange: (timeRange: TvsChartRange) => void
  tokens: ProjectTokens
  token: ProjectToken
  setToken: (token: ProjectToken | undefined) => void
  unit: ChartUnit
  setUnit: (unit: ChartUnit) => void
  showStackedChartLegend?: boolean
}

export function ProjectTokenChart({
  projectId,
  isBridge,
  milestones,
  timeRange,
  setTimeRange,
  tokens,
  token,
  setToken,
  unit,
  setUnit,
  showStackedChartLegend,
}: Props) {
  const properUnit = unit === 'usd' ? 'usd' : token.symbol

  const { data, isLoading } = api.tvs.tokenChart.useQuery({
    token: {
      chain: token.chain,
      address: token.address,
      projectId,
    },
    range: timeRange,
  })

  const chartMeta = {
    value: {
      label: token.name,
      color: sourceToColor(token.source),
      legendLabel: capitalize(token.source),
      indicatorType: {
        shape: 'square',
      },
    },
  } satisfies ChartMeta

  const chartData = useMemo(() => {
    return data?.map(([timestamp, amount, usdValue]) => ({
      timestamp,
      value: unit === 'usd' ? usdValue : amount,
    }))
  }, [data, unit])

  const chartRange = useMemo(() => getChartRange(chartData), [chartData])

  return (
    <section>
      <ChartControlsWrapper>
        <ProjectChartTimeRange range={chartRange} />
        <TvsChartTimeRangeControls
          projectSection
          timeRange={timeRange}
          setTimeRange={setTimeRange}
        />
      </ChartControlsWrapper>
      <ChartContainer
        className="mb-2 mt-4"
        meta={chartMeta}
        data={chartData}
        isLoading={isLoading}
        milestones={milestones}
      >
        <AreaChart data={chartData} margin={{ top: 20 }}>
          {isBridge && (
            <defs>
              <PinkFillGradientDef id="fill" />
              <PinkStrokeGradientDef id="stroke" />
            </defs>
          )}
          {!isBridge && <ChartLegend content={<ChartLegendContent />} />}
          <Area
            dataKey="value"
            fill={isBridge ? 'url(#fill)' : chartMeta.value.color}
            fillOpacity={1}
            stroke={isBridge ? 'url(#stroke)' : 'none'}
            strokeWidth={2}
            isAnimationActive={false}
          />
          {getCommonChartComponents({
            data: chartData,
            isLoading,
            yAxis: {
              tick: {
                width: 150,
              },
              tickFormatter: (value: number) =>
                formatCurrency(value, unit === 'usd' ? 'usd' : token.symbol),
            },
          })}
          <ChartTooltip content={<CustomTooltip unit={properUnit} />} />
        </AreaChart>
      </ChartContainer>
      <div className={cn(!showStackedChartLegend && 'mt-4')}>
        <TokenChartUnitControls
          isBridge={isBridge}
          unit={unit}
          setUnit={setUnit}
          tokens={tokens}
          token={token}
          setToken={setToken}
        />
      </div>
    </section>
  )
}

function CustomTooltip({
  active,
  payload,
  label,
  unit,
}: TooltipProps<number, string> & { unit: string }) {
  const { meta } = useChart()
  if (!active || !payload || typeof label !== 'number') return null
  return (
    <div className={tooltipContentVariants()}>
      <div className="flex min-w-28 flex-col gap-1">
        <div>{formatTimestamp(label, { longMonthName: true })}</div>
        <div>
          {payload.map((entry) => {
            if (entry.value === undefined) return null
            const config = meta[entry.name!]!
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
                  <span className="w-20 leading-none sm:w-fit">
                    {config.label}
                  </span>
                </span>
                <span className="whitespace-nowrap font-medium">
                  {formatCurrency(entry.value, unit)}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

interface ControlsProps {
  isBridge: boolean
  unit: ChartUnit
  setUnit: (value: ChartUnit) => void
  tokens: ProjectTokens
  token: ProjectToken
  setToken: (token: ProjectToken | undefined) => void
}

function TokenChartUnitControls({
  isBridge,
  unit,
  setUnit,
  tokens,
  token,
  setToken,
}: ControlsProps) {
  const isClient = useIsClient()

  return (
    <div className="flex flex-wrap items-center gap-2">
      {isClient ? (
        <RadioGroup name="tokenChartUnit" value={unit} onValueChange={setUnit}>
          <RadioGroupItem value="usd">USD</RadioGroupItem>
          <RadioGroupItem value="eth">{token.symbol}</RadioGroupItem>
        </RadioGroup>
      ) : (
        <Skeleton className="h-8 w-[104.82px]" />
      )}
      <TokenCombobox
        tokens={tokens}
        value={token}
        setValue={setToken}
        isBridge={isBridge}
      />
    </div>
  )
}

function sourceToColor(source: ProjectToken['source']) {
  switch (source) {
    case 'native':
      return 'hsl(var(--chart-tvs-native))'
    case 'canonical':
      return 'hsl(var(--chart-tvs-canonical))'
    case 'external':
      return 'hsl(var(--chart-tvs-external))'
    default:
      assertUnreachable(source)
  }
}
