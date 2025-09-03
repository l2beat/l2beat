import type { Milestone } from '@l2beat/config'
import { useMemo } from 'react'
import { useTvsChartControlsContext } from '~/components/chart/tvs/TvsChartControlsContext'
import type { ChartProject } from '~/components/core/chart/Chart'
import { useChartDataKeys } from '~/components/core/chart/hooks/useChartDataKeys'
import { api } from '~/trpc/React'
import {
  AssetCategoryTvsChart,
  assetCategoryTvsChartMeta,
} from './AssetCategoryTvsChart'

interface ProjectAssetCategoryTvsChartProps {
  project: ChartProject
  milestones: Milestone[]
}

export function ProjectAssetCategoryTvsChart({
  project,
  milestones,
}: ProjectAssetCategoryTvsChartProps) {
  const { range, unit } = useTvsChartControlsContext()

  const { dataKeys, toggleDataKey } = useChartDataKeys(
    assetCategoryTvsChartMeta,
  )

  const { data, isLoading } = api.tvs.detailedChart.useQuery({
    filter: { type: 'projects', projectIds: [project.id] },
    range,
    excludeAssociatedTokens: false,
  })

  const chartData = useMemo(
    () =>
      data?.chart.map(
        ([timestamp, ethPrice, _, __, ___, ether, stablecoin, btc, other]) => {
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
    />
  )
}
