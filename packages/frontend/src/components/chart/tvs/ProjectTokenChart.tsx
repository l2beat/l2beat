import type { Milestone } from '@l2beat/config'
import { useMemo } from 'react'
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
import { ProjectChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import { TvsBreakdownButton } from '~/components/projects/sections/scaling-tvs/ScalingTvsSection'
import { TokenCombobox } from '~/components/TokenCombobox'
import type { ProjectToken } from '~/server/features/scaling/tvs/tokens/getTokensForProject'
import type { TvsChartRange } from '~/server/features/scaling/tvs/utils/range'
import { api } from '~/trpc/React'
import { cn } from '~/utils/cn'
import { getChartRange } from '../../core/chart/utils/getChartRangeFromColumns'
import { TokenChart } from './TokenChart'
import { TvsChartTimeRangeControls } from './TvsChartTimeRangeControls'

interface Props {
  projectId: string
  milestones: Milestone[]
  timeRange: TvsChartRange
  setTimeRange: (timeRange: TvsChartRange) => void
  tokens: ProjectToken[]
  token: ProjectToken
  setToken: (token: ProjectToken | undefined) => void
  showStackedChartLegend?: boolean
  tvsBreakdownUrl?: string
}

export function ProjectTokenChart({
  projectId,
  milestones,
  timeRange,
  setTimeRange,
  tokens,
  token,
  setToken,
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
    return data?.chart.map(([timestamp, usdValue]) => ({
      timestamp,
      value: usdValue,
    }))
  }, [data])

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
        token={token}
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
        <TokenCombobox tokens={tokens} value={token} setValue={setToken} />
        {tvsBreakdownUrl && (
          <div className="hidden md:inline-block">
            <TvsBreakdownButton tvsBreakdownUrl={tvsBreakdownUrl} />
          </div>
        )}
      </div>
    </div>
  )
}
