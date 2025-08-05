import type { Milestone } from '@l2beat/config'
import { assert, assertUnreachable } from '@l2beat/shared-pure'
import { useMemo } from 'react'
import type { TooltipProps } from 'recharts'
import { Area, AreaChart } from 'recharts'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  type ChartMeta,
  ChartTooltip,
  ChartTooltipWrapper,
  useChart,
} from '~/components/core/chart/Chart'
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import { ProjectChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import {
  PinkFillGradientDef,
  PinkStrokeGradientDef,
} from '~/components/core/chart/defs/PinkGradientDef'
import { getCommonChartComponents } from '~/components/core/chart/utils/getCommonChartComponents'
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import { Skeleton } from '~/components/core/Skeleton'
import { TvsBreakdownButton } from '~/components/projects/sections/StackedTvsSection'
import { TokenCombobox } from '~/components/TokenCombobox'
import { useIsClient } from '~/hooks/useIsClient'
import type {
  ProjectToken,
  ProjectTokens,
} from '~/server/features/scaling/tvs/tokens/getTokensForProject'
import type { TvsChartRange } from '~/server/features/scaling/tvs/utils/range'
import { api } from '~/trpc/React'
import { cn } from '~/utils/cn'
import { formatTimestamp } from '~/utils/dates'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { getChartRange } from '../../core/chart/utils/getChartRangeFromColumns'
import type { ChartUnit } from '../types'
import { TvsChartTimeRangeControls } from './TvsChartTimeRangeControls'

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
  tvsBreakdownUrl?: string
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
  tvsBreakdownUrl,
}: Props) {
  const properUnit = unit === 'usd' ? 'usd' : token.symbol

  const { data, isLoading } = api.tvs.tokenChart.useQuery({
    token: {
      tokenId: token.id,
      projectId,
    },
    range: timeRange,
  })
  const chartMeta = {
    value: {
      label: token.name,
      color: sourceToColor(token.source),
      legendLabel: sourceToLabel(token.source),
      indicatorType: {
        shape: 'square',
      },
    },
  } satisfies ChartMeta

  const chartData = useMemo(() => {
    return data?.chart.map(([timestamp, amount, usdValue]) => ({
      timestamp,
      value: unit === 'usd' ? usdValue : amount,
    }))
  }, [data, unit])

  const chartRange = useMemo(() => getChartRange(chartData), [chartData])

  return (
    <div>
      <ChartControlsWrapper>
        <ProjectChartTimeRange range={chartRange} />
        <TvsChartTimeRangeControls
          projectSection
          timeRange={timeRange}
          setTimeRange={setTimeRange}
        />
      </ChartControlsWrapper>
      <ChartContainer
        className="mt-4 mb-2"
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
              tickFormatter: (value: number) =>
                formatCurrency(value, unit === 'usd' ? 'usd' : token.symbol),
              tickCount: 4,
            },
            syncedUntil: data?.syncedUntil,
          })}
          <ChartTooltip
            filterNull={false}
            content={<CustomTooltip unit={properUnit} />}
          />
        </AreaChart>
      </ChartContainer>
      <div
        className={cn(
          tvsBreakdownUrl &&
            'flex flex-wrap items-center justify-between gap-1',
          !showStackedChartLegend && 'mt-4',
        )}
      >
        <TokenChartUnitControls
          isBridge={isBridge}
          unit={unit}
          setUnit={setUnit}
          tokens={tokens}
          token={token}
          setToken={setToken}
        />
        {tvsBreakdownUrl && (
          <div className="hidden md:inline-block">
            <TvsBreakdownButton tvsBreakdownUrl={tvsBreakdownUrl} />
          </div>
        )}
      </div>
    </div>
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
    <ChartTooltipWrapper>
      <div className="flex min-w-28 flex-col gap-1">
        <div className="mb-1 font-medium text-label-value-14 text-secondary">
          {formatTimestamp(label, { longMonthName: true, mode: 'datetime' })}
        </div>
        <div className="flex flex-col gap-2">
          {payload.map((entry) => {
            if (entry.name === undefined) return null
            const config = meta[entry.name]
            assert(config, 'No config')

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
                <span className="whitespace-nowrap font-medium text-label-value-15">
                  {entry.value !== null && entry.value !== undefined
                    ? formatCurrency(entry.value, unit)
                    : 'No data'}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </ChartTooltipWrapper>
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
      return 'var(--chart-stacked-pink)'
    case 'canonical':
      return 'var(--chart-stacked-purple)'
    case 'external':
      return 'var(--chart-stacked-yellow)'
    default:
      assertUnreachable(source)
  }
}

function sourceToLabel(source: ProjectToken['source']) {
  switch (source) {
    case 'native':
      return 'Natively minted'
    case 'canonical':
      return 'Canonically bridged'
    case 'external':
      return 'Externally bridged'
    default:
      assertUnreachable(source)
  }
}
