import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import type { TvsProjectFilter } from '~/server/features/layer2s/tvs/utils/projectFilterUtils'
import { CHANGE_CATEGORIES } from '~/server/features/utils/changeEventConstants'
import { useTRPC } from '~/trpc/React'
import { type ChartRange, rangeToResolution } from '~/utils/range/range'
import {
  CHANGE_PINS_TOP_MARGIN,
  ChangePins,
  getVisibleChangeEvents,
} from '../../change-pins/ChangePins'
import { TVS_CHANGE_FORMAT } from '../../change-pins/formats'
import type { ChartUnit } from '../../types'
import { l2CategoryTvsChartMeta } from '../L2SummaryTvsChart'

/**
 * Change pins for the stacked TVS charts, which split the same total by
 * bridge type or asset category. The changes are still found per L2
 * category, so the pins take the categories' colours.
 */
export function useL2TvsChangePins({
  range,
  unit,
  filter,
  excludeRwaRestrictedTokens,
  chartData,
}: {
  range: ChartRange
  unit: ChartUnit
  filter: TvsProjectFilter
  excludeRwaRestrictedTokens: boolean
  chartData: { timestamp: number }[] | undefined
}) {
  const trpc = useTRPC()
  // Changes are found in whole days and in dollars.
  const enabled = unit === 'usd' && rangeToResolution(range) === 'day'
  const { data } = useQuery({
    ...trpc.tvs.changeEvents.queryOptions({
      range,
      filter,
      excludeRwaRestrictedTokens,
    }),
    enabled,
  })
  const events = useMemo(
    () => getVisibleChangeEvents(data, 'usd', [...CHANGE_CATEGORIES]),
    [data],
  )

  return {
    marginTop: enabled ? CHANGE_PINS_TOP_MARGIN : undefined,
    pins: enabled && data && (
      <ChangePins
        events={events}
        projects={data.projects}
        chartData={chartData}
        chartMeta={l2CategoryTvsChartMeta}
        format={TVS_CHANGE_FORMAT}
      />
    ),
  }
}
