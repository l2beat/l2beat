import { v as z } from '@l2beat/validate'
import { TRPCError } from '@trpc/server'
import { env } from '~/env'
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
import {
  getProjectLiveStatus,
  getProjectLiveWindow,
  ProjectLiveStatusParams,
  ProjectLiveWindowParams,
} from '~/server/features/layer2s/activity/live/getProjectLiveActivity'
import { ActivityProjectFilter } from '~/server/features/layer2s/activity/utils/projectFilterUtils'
import {
  withLiveActivity,
  withLiveEthereumActivity,
} from '~/server/features/layer2s/activity/withLiveActivity'
import { ChartRange } from '~/utils/range/range'
import { procedure, router } from '../trpc'

/** With live activity off, nobody reads the stored blocks */
const liveActivityProcedure = procedure.use(({ next }) => {
  if (!env.CLIENT_SIDE_LIVE_ACTIVITY) {
    throw new TRPCError({ code: 'NOT_FOUND' })
  }
  return next()
})

export const activityRouter = router({
  chart: procedure
    .input(ActivityChartParams)
    .query(async ({ input }) =>
      withLiveActivity(await getActivityChart(input), input),
    ),
  detailedChartWithProjectsRanges: procedure
    .input(ActivityChartWithProjectsRangesDataParams)
    .query(({ input }) => getDetailedActivityChartWithProjectsRanges(input)),
  ethereumChart: procedure
    .input(EthereumActivityChartParams)
    .query(async ({ input }) =>
      withLiveEthereumActivity(await getEthereumActivityChart(input), input),
    ),
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
  liveStatus: liveActivityProcedure
    .input(ProjectLiveStatusParams)
    .query(({ input }) => getProjectLiveStatus(input.projectId)),
  liveWindow: liveActivityProcedure
    .input(ProjectLiveWindowParams)
    .query(({ input }) => getProjectLiveWindow(input)),
})
