import { z } from 'zod'
import { getScalingSummaryData } from '~/server/features/tvl/get-scaling-summary-data'
import { TvlChartRange } from '~/server/features/tvl/range-utils'
import { procedure, router } from '../trpc'

export const scalingRouter = router({
  summary: procedure
    .input(
      z
        .object({
          range: TvlChartRange,
        })
        .and(
          z.union([
            z.object({ type: z.enum(['all', 'layer2', 'layer3', 'bridge']) }),
            z.object({
              type: z.literal('projects'),
              projectIds: z.array(z.string()),
            }),
          ]),
        ),
    )
    .query(async ({ input }) => {
      return getScalingSummaryData(input)
    }),
})
