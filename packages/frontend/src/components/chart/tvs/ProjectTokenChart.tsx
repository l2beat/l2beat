import type { Milestone } from '@l2beat/config'
import { useMemo } from 'react'
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
import { ProjectChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import { Skeleton } from '~/components/core/Skeleton'
import { TvsBreakdownButton } from '~/components/projects/sections/scaling-tvs/ScalingTvsSection'
import { TokenCombobox } from '~/components/TokenCombobox'
import { useIsClient } from '~/hooks/useIsClient'
import type { ProjectToken } from '~/server/features/scaling/tvs/tokens/getTokensForProject'
import type { TvsChartRange } from '~/server/features/scaling/tvs/utils/range'
import { api } from '~/trpc/React'
import { cn } from '~/utils/cn'
import { getChartRange } from '../../core/chart/utils/getChartRangeFromColumns'
import type { ChartUnit } from '../types'
import { TokenChart } from './TokenChart'
import { TvsChartTimeRangeControls } from './TvsChartTimeRangeControls'

interface Props {
  projectId: string
  isBridge: boolean
  milestones: Milestone[]
  timeRange: TvsChartRange
  setTimeRange: (timeRange: TvsChartRange) => void
  tokens: ProjectToken[]
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
  const { data, isLoading } = api.tvs.tokenChart.useQuery({
    token: {
      tokenId: token.id,
      projectId,
    },
    range: timeRange,
  })

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
      <TokenChart
        data={chartData}
        isLoading={isLoading}
        milestones={milestones}
        isBridge={isBridge}
        token={token}
        unit={unit}
        syncedUntil={data?.syncedUntil}
        className="mt-4 mb-3"
      />
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

interface ControlsProps {
  isBridge: boolean
  unit: ChartUnit
  setUnit: (value: ChartUnit) => void
  tokens: ProjectToken[]
  token: ProjectToken
  setToken: (token: ProjectToken | undefined) => void
}

function TokenChartUnitControls({
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
      <TokenCombobox tokens={tokens} value={token} setValue={setToken} />
    </div>
  )
}
