import { type Milestone } from '@l2beat/config'
import { TokenCombobox } from '~/app/_components/token-combobox'
import {
  type ProjectToken,
  type ProjectTokens,
} from '~/server/features/scaling/tvl/tokens/get-top-tokens-for-project'
import { type TvlChartRange } from '~/server/features/scaling/tvl/utils/range'
import { api } from '~/trpc/react'
import { Chart } from '../../core/chart'
import { ChartProvider } from '../../core/chart-provider'
import { type ChartScale, type ChartUnit } from '../../types'
import { TvlChartTimeRangeControls } from '../tvl-chart-time-range-controls'
import { TvlChartUnitAndScaleControls } from '../tvl-chart-unit-and-scale-controls'
import { TokenChartHover } from './token-chart-hover'
import { useTokenChartRenderParams } from './use-token-chart-render-params'

interface Props {
  projectId: string
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
      data,
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
        <TokenChartHover {...data} token={token} />
      )}
    >
      <section className="flex flex-col gap-4">
        <TvlChartTimeRangeControls
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          range={chartRange}
        />

        <Chart />
        <TvlChartUnitAndScaleControls
          unit={unit}
          scale={scale}
          setUnit={setUnit}
          setScale={setScale}
          disabled
        />
        <TokenCombobox tokens={tokens} value={token} setValue={setToken} />
      </section>
    </ChartProvider>
  )
}
