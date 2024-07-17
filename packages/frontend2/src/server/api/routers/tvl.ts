import { z } from 'zod'
import { procedure, router } from '../trpc'
import { getTvlChart } from '~/server/features/tvl/get-tvl-chart'
import { TvlChartRange } from '~/server/features/tvl/range-utils'

export const tvlRouter = router({
  chart: procedure
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
      // TODO: Remove before merging
      await new Promise((resolve) => setTimeout(resolve, 3000))
      return getTvlChart(input)
    }),
})
