import { z } from 'zod'
import { procedure, router } from '../../trpc'
import { TvlChartRange } from '~/server/features/scaling/tvl/utils/range'
import { getScalingSummaryChartData } from '~/server/features/scaling/tvl/utils/get-scaling-summary-chart-data'

export const summaryRouter = router({
  chart: procedure
    .input(
      z
        .object({
          range: TvlChartRange,
          excludeAssociatedTokens: z.boolean(),
        })
        .and(
          z.union([
            z.object({ type: z.enum(['layer2']) }),
            z.object({
              type: z.literal('projects'),
              projectIds: z.array(z.string()),
            }),
          ]),
        ),
    )
    .query(async ({ input }) => {
      return getScalingSummaryChartData(input)
    }),
})
