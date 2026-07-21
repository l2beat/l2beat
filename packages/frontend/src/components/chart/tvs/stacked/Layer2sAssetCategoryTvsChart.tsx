import type { Milestone } from '@l2beat/config'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useLayer2sTvsDataKeys } from '~/pages/layer2s/tvs/components/Layer2sTvsDataKeysContext'
import type { TvsProjectFilter } from '~/server/features/layer2s/tvs/utils/projectFilterUtils'
import { useTRPC } from '~/trpc/React'
import type { ChartRange } from '~/utils/range/range'
import type { ChartUnit } from '../../types'
import { AssetCategoryTvsChart } from './AssetCategoryTvsChart'

interface Props {
  filter: TvsProjectFilter
  milestones: Milestone[]
  range: ChartRange
  unit: ChartUnit
  excludeAssociatedTokens: boolean
  excludeRwaRestrictedTokens: boolean
}

export function Layer2sAssetCategoryTvsChart({
  filter,
  milestones,
  range,
  unit,
  excludeAssociatedTokens,
  excludeRwaRestrictedTokens,
}: Props) {
  const trpc = useTRPC()
  const { assetCategoryDataKeys, assetCategoryToggleDataKey } =
    useLayer2sTvsDataKeys()

  const { data, isLoading } = useQuery(
    trpc.tvs.detailedChart.queryOptions({
      range,
      excludeAssociatedTokens,
      filter,
      excludeRwaRestrictedTokens,
    }),
  )

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
            rwaPublic:
              rwaPublic !== null && divider !== null && divider !== 0
                ? rwaPublic / divider
                : null,
            rwaRestricted:
              rwaRestricted !== null && divider !== null && divider !== 0
                ? rwaRestricted / divider
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
      excludeRwaRestrictedTokens={excludeRwaRestrictedTokens}
    />
  )
}
