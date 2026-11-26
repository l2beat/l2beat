import { useQuery } from '@tanstack/react-query'
import type { TvsProjectFilter } from '~/server/features/layer2s/tvs/utils/projectFilterUtils'
import { CHANGE_CATEGORIES } from '~/server/features/utils/changeEventConstants'
import { useTRPC } from '~/trpc/React'
import { type ChartRange, rangeToResolution } from '~/utils/range/range'
import {
  CHANGE_PINS_TOP_MARGIN,
  ChangePins,
  useChangeEvents,
  usePlotHeightScale,
} from '../../change-pins/ChangePins'
import { TVS_CHANGE_FORMAT } from '../../change-pins/formats'
import type { ChartUnit } from '../../types'
import { l2CategoryTvsChartMeta } from '../L2SummaryTvsChart'

/**
 * Change pins for the stacked TVS charts, which split the same total by
 * bridge type or asset category. The changes are still found per L2
 * category, so the pins take the categories' colours. A change is measured
 * on the top of the stack, which is the category's total only while every
 * band is shown, so hiding one hides the pins.
 */
export function useL2TvsChangePins({
  range,
  unit,
  filter,
  excludeRwaRestrictedTokens,
  chartData,
  allBandsShown,
}: {
  range: ChartRange
  unit: ChartUnit
  filter: TvsProjectFilter
  excludeRwaRestrictedTokens: boolean
  chartData: { timestamp: number }[] | undefined
  allBandsShown: boolean
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
  const { toPlotHeight, onYScale } = usePlotHeightScale()
  const events = useChangeEvents(data, {
    metric: 'usd',
    dataKeys: CHANGE_CATEGORIES,
    format: TVS_CHANGE_FORMAT,
    toPlotHeight,
  })

  return {
    marginTop: enabled ? CHANGE_PINS_TOP_MARGIN : undefined,
    onYScale,
    pins: enabled && data && allBandsShown && (
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
