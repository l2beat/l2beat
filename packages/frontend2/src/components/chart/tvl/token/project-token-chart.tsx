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
import { Chart } from '../../core/chart'
import { ChartProvider } from '../../core/chart-provider'
import { type ChartUnit } from '../../types'
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
      range={chartRange}
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
      <section className="flex flex-col gap-4">
        <TvlChartTimeRangeControls
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          range={chartRange}
        />

        <Chart />
        <TokenChartUnitControls
          isBridge={isBridge}
          unit={unit}
          setUnit={setUnit}
          tokens={tokens}
          token={token}
          setToken={setToken}
        />
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

export function TokenChartUnitControls({
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
