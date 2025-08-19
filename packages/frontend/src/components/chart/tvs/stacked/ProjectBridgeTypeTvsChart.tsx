import type { Milestone } from '@l2beat/config'
import { useMemo } from 'react'
import { TvsChartUnitControls } from '~/components/chart/tvs/TvsChartUnitControls'
import { useChartDataKeys } from '~/components/core/chart/hooks/useChartDataKeys'
import { TvsBreakdownButton } from '~/components/projects/sections/ScalingTvsSection'
import { TokenCombobox } from '~/components/TokenCombobox'
import type { ProjectToken } from '~/server/features/scaling/tvs/tokens/getTokensForProject'
import type { TvsChartRange } from '~/server/features/scaling/tvs/utils/range'
import { api } from '~/trpc/React'
import { ChartControlsWrapper } from '../../../core/chart/ChartControlsWrapper'
import { ProjectChartTimeRange } from '../../../core/chart/ChartTimeRange'
import { getChartRange } from '../../../core/chart/utils/getChartRangeFromColumns'
import type { ChartUnit } from '../../types'
import {
  BridgeTypeTvsChart,
  bridgeTypeTvsChartMeta,
} from '../stacked/BridgeTypeTvsChart'
import { TvsChartTimeRangeControls } from '../TvsChartTimeRangeControls'

interface ProjectBridgeTypeTvsChartProps {
  projectId: string
  milestones: Milestone[]
  timeRange: TvsChartRange
  setTimeRange: (timeRange: TvsChartRange) => void
  tokens: ProjectToken[] | undefined
  token: ProjectToken | undefined
  setToken: (token: ProjectToken | undefined) => void
  unit: ChartUnit
  setUnit: (unit: ChartUnit) => void
  tvsBreakdownUrl: string | undefined
}

export function ProjectBridgeTypeTvsChart({
  projectId,
  milestones,
  timeRange,
  setTimeRange,
  tokens,
  token,
  setToken,
  unit,
  setUnit,
  tvsBreakdownUrl,
}: ProjectBridgeTypeTvsChartProps) {
  const { dataKeys, toggleDataKey } = useChartDataKeys(bridgeTypeTvsChartMeta)

  const { data, isLoading } = api.tvs.chart.useQuery({
    filter: { type: 'projects', projectIds: [projectId] },
    range: { type: timeRange },
    excludeAssociatedTokens: false,
  })

  const chartData = useMemo(
    () =>
      data?.chart.map(([timestamp, native, canonical, external, ethPrice]) => {
        const divider = unit === 'usd' ? 1 : ethPrice
        return {
          timestamp,
          native:
            native !== null && divider !== null && divider !== 0
              ? native / divider
              : null,
          canonical:
            canonical !== null && divider !== null && divider !== 0
              ? canonical / divider
              : null,
          external:
            external !== null && divider !== null && divider !== 0
              ? external / divider
              : null,
        }
      }),
    [data, unit],
  )
  const chartRange = useMemo(() => getChartRange(chartData), [chartData])

  return (
    <div className="flex flex-col">
      <ChartControlsWrapper>
        <ProjectChartTimeRange range={chartRange} />
        <TvsChartTimeRangeControls
          projectSection
          timeRange={timeRange}
          setTimeRange={setTimeRange}
        />
      </ChartControlsWrapper>
      <BridgeTypeTvsChart
        data={chartData}
        milestones={milestones}
        unit={unit}
        isLoading={isLoading}
        tickCount={4}
        className="mt-4 mb-3"
        syncedUntil={data?.syncedUntil}
        dataKeys={dataKeys}
        toggleDataKey={toggleDataKey}
      />
      <div className="flex flex-wrap items-center justify-between gap-1">
        <TvsChartUnitControls unit={unit} setUnit={setUnit}>
          {tokens && (
            <TokenCombobox tokens={tokens} value={token} setValue={setToken} />
          )}
        </TvsChartUnitControls>
        {tvsBreakdownUrl && (
          <div className="hidden md:inline-block">
            <TvsBreakdownButton tvsBreakdownUrl={tvsBreakdownUrl} />
          </div>
        )}
      </div>
    </div>
  )
}
