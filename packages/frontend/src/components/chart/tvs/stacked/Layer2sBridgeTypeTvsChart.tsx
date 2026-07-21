import type { Milestone } from '@l2beat/config'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useLayer2sTvsDataKeys } from '~/pages/layer2s/tvs/components/Layer2sTvsDataKeysContext'
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

export function Layer2sBridgeTypeTvsChart({
  milestones,
  unit,
  filter,
  range,
  excludeAssociatedTokens,
  excludeRwaRestrictedTokens,
}: Props) {
  const trpc = useTRPC()
  const { tokenBridgeTypeDataKeys, tokenBridgeTypeToggleDataKey } =
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
