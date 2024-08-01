import { z } from 'zod'
import { getCostsChart } from '~/server/features/costs/get-costs-chart'
import { CostsTimeRange } from '~/server/features/costs/utils/range'
import { procedure, router } from '../trpc'

export const scalingRouter = router({
  costs: procedure
    .input(
      z.object({
        range: CostsTimeRange,
      }),
    )
    .query(async ({ input }) => {
      return getCostsChart(input.range)
    }),
})
