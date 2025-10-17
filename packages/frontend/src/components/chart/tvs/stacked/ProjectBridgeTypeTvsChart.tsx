import type { Milestone } from '@l2beat/config'
import { useMemo } from 'react'
import { useTvsChartControlsContext } from '~/components/chart/tvs/TvsChartControlsContext'
import type { ChartProject } from '~/components/core/chart/Chart'
import { useChartDataKeys } from '~/components/core/chart/hooks/useChartDataKeys'
import { useScalingRwaRestrictedTokensContext } from '~/pages/scaling/components/ScalingRwaRestrictedTokensContext'
import { api } from '~/trpc/React'
import {
  BridgeTypeTvsChart,
  bridgeTypeTvsChartMeta,
} from '../stacked/BridgeTypeTvsChart'

interface ProjectBridgeTypeTvsChartProps {
  project: ChartProject
  milestones: Milestone[]
}

export function ProjectBridgeTypeTvsChart({
  project,
  milestones,
}: ProjectBridgeTypeTvsChartProps) {
  const { range, unit } = useTvsChartControlsContext()
  const { includeRwaRestrictedTokens } = useScalingRwaRestrictedTokensContext()
  const { dataKeys, toggleDataKey } = useChartDataKeys(bridgeTypeTvsChartMeta)

  const { data, isLoading } = api.tvs.detailedChart.useQuery({
    filter: { type: 'projects', projectIds: [project.id] },
    range,
    excludeAssociatedTokens: false,
    includeRwaRestrictedTokens,
  })

  const chartData = useMemo(
    () =>
      data?.chart.map(([timestamp, ethPrice, native, canonical, external]) => {
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

  return (
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
      project={project}
    />
  )
}
