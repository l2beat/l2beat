import type { Milestone } from '@l2beat/config'
import { useMemo } from 'react'
import { useScalingTvsDataKeys } from '~/pages/scaling/tvs/components/ScalingTvsDataKeysContext'
import type { TvsProjectFilter } from '~/server/features/scaling/tvs/utils/projectFilterUtils'
import type { TvsChartRange } from '~/server/features/scaling/tvs/utils/range'
import { api } from '~/trpc/React'
import type { ChartUnit } from '../../types'
import { AssetCategoryTvsChart } from './AssetCategoryTvsChart'

interface Props {
  filter: TvsProjectFilter
  milestones: Milestone[]
  range: TvsChartRange
  unit: ChartUnit
  excludeAssociatedTokens: boolean
}

export function ScalingAssetCategoryTvsChart({
  filter,
  milestones,
  range,
  unit,
  excludeAssociatedTokens,
}: Props) {
  const { assetCategoryDataKeys, assetCategoryToggleDataKey } =
    useScalingTvsDataKeys()

  const { data, isLoading } = api.tvs.detailedChart.useQuery({
    range,
    excludeAssociatedTokens,
    filter,
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
      syncedUntil={data?.syncedUntil}
      dataKeys={assetCategoryDataKeys}
      toggleDataKey={assetCategoryToggleDataKey}
    />
  )
}
