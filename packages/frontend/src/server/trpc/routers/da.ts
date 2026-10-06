import {
  getLiveBlobsFeed,
  LiveBlobsParams,
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

  pastDayUsage: procedure
    .input(DaPastDayUsageParams)
    .query(async ({ input }) => getDaPastDayUsage(input)),

  // null rather than undefined, which React Query takes for a missing answer
  liveBlobs: procedure
    .input(LiveBlobsParams)
    .query(
      async ({ input }) =>
        (await getLiveBlobsFeed().latestAfter(input)) ?? null,
    ),
})
