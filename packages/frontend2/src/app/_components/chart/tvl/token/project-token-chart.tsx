import { type Milestone } from '@l2beat/config'
import { RadioGroup, RadioGroupItem } from '~/app/_components/radio-group'
import { Skeleton } from '~/app/_components/skeleton'
import { TokenCombobox } from '~/app/_components/token-combobox'
import { useIsClient } from '~/hooks/use-is-client'
import {
  type ProjectToken,
  type ProjectTokens,
} from '~/server/features/scaling/tvl/tokens/get-tokens-for-project'
import { type TvlChartRange } from '~/server/features/scaling/tvl/utils/range'
import { api } from '~/trpc/react'
import { Chart } from '../../core/chart'
import { ChartProvider } from '../../core/chart-provider'
import { type ChartScale, type ChartUnit } from '../../types'
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
  scale: ChartScale
  setScale: (scale: ChartScale) => void
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
  scale,
  setScale,
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
      useLogScale={scale === 'log'}
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
        <TokenChartUnitAndScaleControls
          isBridge={isBridge}
          unit={unit}
          scale={scale}
          setUnit={setUnit}
          setScale={setScale}
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
  scale: ChartScale
  setUnit: (value: ChartUnit) => void
  setScale: (value: ChartScale) => void
  tokens: ProjectTokens
  token: ProjectToken
  setToken: (token: ProjectToken | undefined) => void
}

export function TokenChartUnitAndScaleControls({
  isBridge,
  unit,
  scale,
  setUnit,
  setScale,
  tokens,
  token,
  setToken,
}: ControlsProps) {
  const isClient = useIsClient()

  if (!isClient) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-[104.82px]" />
            <TokenCombobox
              tokens={tokens}
              value={token}
              setValue={setToken}
              className="max-lg:hidden"
              isBridge={isBridge}
            />
          </div>
          <Skeleton className="h-8 w-[98.63px]" />
        </div>
        <TokenCombobox
          tokens={tokens}
          value={token}
          setValue={setToken}
          isBridge={isBridge}
          className="lg:hidden"
        />
      </div>
    )
  }
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <RadioGroup value={unit} onValueChange={setUnit}>
            <RadioGroupItem value="usd">USD</RadioGroupItem>
            <RadioGroupItem value="eth">{token.symbol}</RadioGroupItem>
          </RadioGroup>
          <TokenCombobox
            tokens={tokens}
            value={token}
            setValue={setToken}
            className="max-lg:hidden"
            isBridge={isBridge}
          />
        </div>
        <RadioGroup value={scale} onValueChange={setScale}>
          <RadioGroupItem value="log">LOG</RadioGroupItem>
          <RadioGroupItem value="lin">LIN</RadioGroupItem>
        </RadioGroup>
      </div>
      <TokenCombobox
        tokens={tokens}
        value={token}
        setValue={setToken}
        className="lg:hidden"
        isBridge={isBridge}
      />
    </div>
  )
}
