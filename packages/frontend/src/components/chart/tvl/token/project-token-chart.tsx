'use client'
import { type Milestone } from '@l2beat/config'
import { RadioGroup, RadioGroupItem } from '~/components/core/radio-group'
import { Skeleton } from '~/components/core/skeleton'
import { TokenCombobox } from '~/components/token-combobox'
import { useIsClient } from '~/hooks/use-is-client'
import {
  type ProjectToken,
  type ProjectTokens,
} from '~/server/features/scaling/tvl/tokens/get-tokens-for-project'
import { type TvlChartRange } from '~/server/features/scaling/tvl/utils/range'
import { api } from '~/trpc/react'
import { cn } from '~/utils/cn'
import { Chart } from '../../core/chart'
import { ChartControlsWrapper } from '../../core/chart-controls-wrapper'
import { ChartProvider } from '../../core/chart-provider'
import { ProjectChartTimeRange } from '../../core/chart-time-range'
import { type ChartUnit } from '../../types'
import { StackedTvlChartLegend } from '../stacked/stacked-tvl-chart-legend'
import { TvlChartTimeRangeControls } from '../tvl-chart-time-range-controls'
import { TokenChartHover } from './token-chart-hover'
import { useTokenChartRenderParams } from './use-token-chart-render-params'

interface Props {
  projectId: string
  isBridge: boolean
  milestones: Milestone[]
  timeRange: TvlChartRange
  setTimeRange: (timeRange: TvlChartRange) => void
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
  const { data, isLoading } = api.tvl.tokenChart.useQuery({
    token: {
      chain: token.chain,
      address: token.address,
      projectId,
    },
    range: timeRange,
  })

  const { chartRange, columns, formatYAxisLabel, valuesStyle } =
    useTokenChartRenderParams({
      milestones,
      token,
      unit,
      data,
      isBridge,
    })

  return (
    <ChartProvider
      columns={columns}
      valuesStyle={valuesStyle}
      formatYAxisLabel={formatYAxisLabel}
      range={timeRange}
      isLoading={isLoading}
      renderHoverContents={(data) => (
        <TokenChartHover
          {...data}
          token={token}
          unit={unit}
          isBridge={isBridge}
        />
      )}
    >
      <section className="flex flex-col">
        <ChartControlsWrapper>
          <ProjectChartTimeRange range={chartRange} />
          <TvlChartTimeRangeControls
            projectSection
            timeRange={timeRange}
            setTimeRange={setTimeRange}
          />
        </ChartControlsWrapper>
        <Chart className="mt-4" />
        {showStackedChartLegend && <StackedTvlChartLegend className="my-2" />}
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
    </ChartProvider>
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
        <RadioGroup value={unit} onValueChange={setUnit}>
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
