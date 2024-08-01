import { z } from 'zod'
import { procedure, router } from '../trpc'
import { getCostsChart } from '~/server/features/costs/get-costs-chart'
import { CostsTimeRange } from '~/server/features/costs/range'

export const scalingRouter = router({
  costs: procedure
    .input(
      z.object({
        range: CostsTimeRange,
      }),
    )
    .query(async ({ input }) => {
      return getCostsChart(input.range, 'usd')
    }),
})
