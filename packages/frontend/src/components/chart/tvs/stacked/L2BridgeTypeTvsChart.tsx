import type { Milestone } from '@l2beat/config'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useL2TvsDataKeys } from '~/pages/layer2s/tvs/components/L2TvsDataKeysContext'
import type { TvsProjectFilter } from '~/server/features/layer2s/tvs/utils/projectFilterUtils'
import { useTRPC } from '~/trpc/React'
import type { ChartRange } from '~/utils/range/range'
import type { ChartUnit } from '../../types'
import { BridgeTypeTvsChart } from './BridgeTypeTvsChart'

interface Props {
  milestones: Milestone[]
  range: ChartRange
  unit: ChartUnit
  filter: TvsProjectFilter
  excludeAssociatedTokens: boolean
  excludeRwaRestrictedTokens: boolean
}

export function L2BridgeTypeTvsChart({
  milestones,
  unit,
  filter,
  range,
  excludeAssociatedTokens,
  excludeRwaRestrictedTokens,
}: Props) {
  const trpc = useTRPC()
  const { tokenBridgeTypeDataKeys, tokenBridgeTypeToggleDataKey } =
    useL2TvsDataKeys()

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
      syncedUntil={data?.syncedUntil}
      dataKeys={tokenBridgeTypeDataKeys}
      toggleDataKey={tokenBridgeTypeToggleDataKey}
    />
  )
}
