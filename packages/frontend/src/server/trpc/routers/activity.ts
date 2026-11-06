import { v as z } from '@l2beat/validate'
import { TRPCError } from '@trpc/server'
import { env } from '~/env'
import { getHeartbeat } from '~/server/features/heartbeat/getHeartbeat'
import {
  ActivityChartParams,
  getActivityChart,
} from '~/server/features/layer2s/activity/getActivityChart'
import { getActivityChartStats } from '~/server/features/layer2s/activity/getActivityChartStats'
import {
  ActivityChartWithProjectsRangesDataParams,
  getDetailedActivityChartWithProjectsRanges,
} from '~/server/features/layer2s/activity/getDetailedActivityChartWithProjectsRanges'
import {
  EthereumActivityChartParams,
  getEthereumActivityChart,
} from '~/server/features/layer2s/activity/getEthereumActivityChart'
import { getRecategorisedActivityChart } from '~/server/features/layer2s/activity/getRecategorisedActivityChart'
import { ActivityProjectFilter } from '~/server/features/layer2s/activity/utils/projectFilterUtils'
import { ChartRange } from '~/utils/range/range'
import { procedure, router } from '../trpc'

/** For the heartbeat page alone, so with the page off nobody reads the stored blocks */
const heartbeatPageProcedure = procedure.use(({ next }) => {
  if (!env.CLIENT_SIDE_HEARTBEAT_PAGE) {
    throw new TRPCError({ code: 'NOT_FOUND' })
  }
  return next()
})

export const activityRouter = router({
  chart: procedure
    .input(ActivityChartParams)
    .query(({ input }) => getActivityChart(input)),
  detailedChartWithProjectsRanges: procedure
    .input(ActivityChartWithProjectsRangesDataParams)
    .query(({ input }) => getDetailedActivityChartWithProjectsRanges(input)),
  ethereumChart: procedure
    .input(EthereumActivityChartParams)
    .query(({ input }) => getEthereumActivityChart(input)),
  recategorisedChart: procedure
    .input(
      z.object({
        range: ChartRange,
        filter: ActivityProjectFilter,
        hourly: z.boolean().optional(),
      }),
    )
    .query(({ input }) =>
      getRecategorisedActivityChart(input.filter, input.range, input.hourly),
    ),
  chartStats: procedure
    .input(
      z.object({
        filter: ActivityProjectFilter,
      }),
    )
    .query(({ input }) => getActivityChartStats(input.filter)),
  heartbeat: heartbeatPageProcedure.query(() => getHeartbeat()),
})
