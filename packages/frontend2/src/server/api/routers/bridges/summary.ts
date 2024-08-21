import { z } from 'zod'
import { getTvlChartData } from '~/server/features/scaling/tvl/utils/get-tvl-chart-data'
import { TvlChartRange } from '~/server/features/scaling/tvl/utils/range'
import { procedure, router } from '../../trpc'

export const summaryRouter = router({
  chart: procedure
    .input(
      z.object({
        range: TvlChartRange,
      }),
    )
    .query(async ({ input }) => {
      return getTvlChartData({
        range: input.range,
        excludeAssociatedTokens: false,
        type: 'bridges',
      })
    }),
})
