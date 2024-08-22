import { z } from 'zod'
import { getTvlChartData } from '~/server/features/scaling/tvl/utils/get-tvl-chart-data'
import { TvlChartRange } from '~/server/features/scaling/tvl/utils/range'
import { procedure, router } from '../../trpc'

export const summaryRouter = router({
  chart: procedure
    .input(
      z
        .object({
          range: TvlChartRange,
        })
        .and(
          z.union([
            z.object({ type: z.enum(['bridges']) }),
            z.object({
              type: z.literal('projects'),
              projectIds: z.array(z.string()),
            }),
          ]),
        ),
    )
    .query(async ({ input }) => {
      return getTvlChartData({
        excludeAssociatedTokens: false,
        ...input,
      })
    }),
})
