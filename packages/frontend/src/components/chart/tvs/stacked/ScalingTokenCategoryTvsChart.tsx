import type { Milestone } from '@l2beat/config'
import { useMemo } from 'react'
import { useChartDataKeys } from '~/components/core/chart/hooks/useChartDataKeys'
import { useTableFilterContext } from '~/components/table/filters/TableFilterContext'
import type { ScalingTvsEntry } from '~/server/features/scaling/tvs/getScalingTvsEntries'
import type { TvsProjectFilter } from '~/server/features/scaling/tvs/utils/projectFilterUtils'
import type { TvsChartRange } from '~/server/features/scaling/tvs/utils/range'
import { api } from '~/trpc/React'
import type { ChartUnit } from '../../types'
import {
  TokenCategoryTvsChart,
  tokenCategoryTvsChartMeta,
} from './TokenCategoryTvsChart'

interface Props {
  tab: 'rollups' | 'validiumsAndOptimiums' | 'others'
  entries: ScalingTvsEntry[]
  milestones: Milestone[]
  range: TvsChartRange
  unit: ChartUnit
}

export function ScalingTokenCategoryTvsChart({
  tab,
  entries,
  milestones,
  range,
  unit,
}: Props) {
  const { dataKeys, toggleDataKey } = useChartDataKeys(
    tokenCategoryTvsChartMeta,
  )

  const { state: filters } = useTableFilterContext()

  const filter = useMemo<TvsProjectFilter>(() => {
    if (Object.keys(filters).length === 0) {
      return {
        type: tab,
      }
    }
    return {
      type: 'projects',
      projectIds: entries.map((project) => project.id),
    }
  }, [entries, filters, tab])

  const { data, isLoading } = api.tvs.detailedChart.useQuery({
    range,
    excludeAssociatedTokens: false,
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
    <TokenCategoryTvsChart
      className="mt-4 mb-3"
      data={chartData}
      milestones={milestones}
      unit={unit}
      isLoading={isLoading}
      syncedUntil={data?.syncedUntil}
      dataKeys={dataKeys}
      toggleDataKey={toggleDataKey}
    />
  )
}
