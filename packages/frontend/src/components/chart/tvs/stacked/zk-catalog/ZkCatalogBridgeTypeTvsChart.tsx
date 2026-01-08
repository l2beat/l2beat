import type { Milestone } from '@l2beat/config'
import type { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { useMemo } from 'react'
import { useTvsChartControlsContext } from '~/components/chart/tvs/TvsChartControlsContext'
import type { ChartProject } from '~/components/core/chart/Chart'
import { useChartDataKeys } from '~/components/core/chart/hooks/useChartDataKeys'
import { useScalingRwaRestrictedTokensContext } from '~/pages/scaling/components/ScalingRwaRestrictedTokensContext'
import { api } from '~/trpc/React'
import {
  BridgeTypeTvsChart,
  bridgeTypeTvsChartMeta,
} from '../BridgeTypeTvsChart'

interface ZkCatalogBridgeTypeTvsChartProps {
  project: ChartProject
  milestones: Milestone[]
  projectsForTvs: {
    projectId: ProjectId
    sinceTimestamp: UnixTime
    untilTimestamp?: UnixTime
  }[]
}

export function ZkCatalogBridgeTypeTvsChart({
  project,
  milestones,
  projectsForTvs,
}: ZkCatalogBridgeTypeTvsChartProps) {
  const { range, unit } = useTvsChartControlsContext()
  const { excludeRwaRestrictedTokens } = useScalingRwaRestrictedTokensContext()
  const { dataKeys, toggleDataKey } = useChartDataKeys(bridgeTypeTvsChartMeta)

  const { data, isLoading } = api.tvs.detailedChartWithProjectsRanges.useQuery({
    projects: projectsForTvs,
    range,
    excludeAssociatedTokens: false,
    excludeRwaRestrictedTokens,
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
