import type { Milestone } from '@l2beat/config'
import type { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { useMemo } from 'react'
import { useTvsChartControlsContext } from '~/components/chart/tvs/TvsChartControlsContext'
import type { ChartProject } from '~/components/core/chart/Chart'
import { useChartDataKeys } from '~/components/core/chart/hooks/useChartDataKeys'
import { useScalingRwaRestrictedTokensContext } from '~/pages/scaling/components/ScalingRwaRestrictedTokensContext'
import { api } from '~/trpc/React'
import {
  AssetCategoryTvsChart,
  assetCategoryTvsChartMeta,
} from '../AssetCategoryTvsChart'

interface ZkCatalogAssetCategoryTvsChartProps {
  project: ChartProject
  milestones: Milestone[]
  projectsForTvs: {
    projectId: ProjectId
    sinceTimestamp: UnixTime
    untilTimestamp?: UnixTime
  }[]
}

export function ZkCatalogAssetCategoryTvsChart({
  project,
  milestones,
  projectsForTvs,
}: ZkCatalogAssetCategoryTvsChartProps) {
  const { range, unit } = useTvsChartControlsContext()
  const { includeRwaRestrictedTokens } = useScalingRwaRestrictedTokensContext()
  const { dataKeys, toggleDataKey } = useChartDataKeys(
    assetCategoryTvsChartMeta,
  )

  const { data, isLoading } = api.tvs.detailedChartWithProjectsRanges.useQuery({
    projects: projectsForTvs,
    range,
    excludeAssociatedTokens: false,
    includeRwaRestrictedTokens,
  })

  const chartData = useMemo(
    () =>
      data?.chart.map(
        ([
          timestamp,
          ethPrice,
          _,
          __,
          ___,
          ether,
          stablecoin,
          btc,
          other,
          rwaRestricted,
          rwaPublic,
        ]) => {
          const divider = unit === 'usd' ? 1 : ethPrice
          return {
            timestamp,
            ether:
              ether !== null && divider !== null && divider !== 0
                ? ether / divider
                : null,
            stablecoin:
              stablecoin !== null && divider !== null && divider !== 0
                ? stablecoin / divider
                : null,
            btc:
              btc !== null && divider !== null && divider !== 0
                ? btc / divider
                : null,
            other:
              other !== null && divider !== null && divider !== 0
                ? other / divider
                : null,
            rwaRestricted:
              rwaRestricted !== null && divider !== null && divider !== 0
                ? rwaRestricted / divider
                : null,
            rwaPublic:
              rwaPublic !== null && divider !== null && divider !== 0
                ? rwaPublic / divider
                : null,
          }
        },
      ),
    [data, unit],
  )

  return (
    <AssetCategoryTvsChart
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
      includeRwaRestrictedTokens={includeRwaRestrictedTokens}
    />
  )
}
