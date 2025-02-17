import {
  DaThroughputChartParams,
  getDaThroughputChart,
} from '~/server/features/data-availability/throughput/get-da-throughput-chart'
import { procedure, router } from '../trpc'

export const daRouter = router({
  chart: procedure.input(DaThroughputChartParams).query(async ({ input }) => {
    return getDaThroughputChart(input)
  }),
})
