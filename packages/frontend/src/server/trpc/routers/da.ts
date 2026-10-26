import { TRPCError } from '@trpc/server'
import { env } from '~/env'
import {
  getLiveBlobsFeed,
  LiveBlobsParams,
  PastBlobsParams,
} from '~/server/features/data-availability/live-blobs/LiveBlobsFeed'
import {
  DaPastDayUsageParams,
  getDaPastDayUsage,
} from '~/server/features/data-availability/throughput/getDaPastDayUsage'
import {
  DataPostedChartWithProjectsRangesDataParams,
  getDetailedDataPostedChartWithProjectsRanges,
} from '~/server/features/data-availability/throughput/getDetailedDataPostedChartWithProjectsRanges'
import {
  getL2ProjectDaThroughputChart,
  L2ProjectDaThroughputChartParams,
} from '~/server/features/data-availability/throughput/getL2ProjectDaThroughtputChart'
import {
  getProjectDaThroughputChartData,
  ProjectDaThroughputChartDataParams,
} from '~/server/features/data-availability/throughput/getProjectDaThroughputChartData'
import { getProjectDaThroughputCharts } from '~/server/features/data-availability/throughput/getProjectDaThroughputCharts'
import { procedure, router } from '../trpc'

/** For the blobs page alone, so with the page off nobody keeps the live feed reading */
const blobsPageProcedure = procedure.use(({ next }) => {
  if (!env.CLIENT_SIDE_BLOBS_PAGE) throw new TRPCError({ code: 'NOT_FOUND' })
  return next()
})

export const daRouter = router({
  detailedChartWithProjectsRanges: procedure
    .input(DataPostedChartWithProjectsRangesDataParams)
    .query(async ({ input }) =>
      getDetailedDataPostedChartWithProjectsRanges(input),
    ),
  projectChart: procedure
    .input(ProjectDaThroughputChartDataParams)
    .query(async ({ input }) => getProjectDaThroughputChartData(input)),
  projectCharts: procedure
    .input(ProjectDaThroughputChartDataParams)
    .query(async ({ input }) => getProjectDaThroughputCharts(input)),

  l2ProjectChart: procedure
    .input(L2ProjectDaThroughputChartParams)
    .query(async ({ input }) => getL2ProjectDaThroughputChart(input)),

  pastDayUsage: blobsPageProcedure
    .input(DaPastDayUsageParams)
    .query(async ({ input }) => getDaPastDayUsage(input)),

  // null rather than undefined, which React Query takes for a missing answer
  liveBlobs: blobsPageProcedure
    .input(LiveBlobsParams)
    .query(
      async ({ input }) =>
        (await getLiveBlobsFeed().latestAfter(input)) ?? null,
    ),

  pastBlobs: blobsPageProcedure
    .input(PastBlobsParams)
    .query(({ input }) => getLiveBlobsFeed().past(input)),
})
