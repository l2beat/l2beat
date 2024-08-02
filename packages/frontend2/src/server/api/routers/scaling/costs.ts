import { z } from 'zod'
import { getCostsChart } from '~/server/features/costs/get-costs-chart'
import { CostsTimeRange } from '~/server/features/costs/utils/range'
import { getScalingCostsEntries } from '~/server/features/scaling/get-scaling-costs-entries'
import { procedure, router } from '../../trpc'

export const costsRouter = router({
  chart: procedure
    .input(
      z.object({
        range: CostsTimeRange,
      }),
    )
    .query(async ({ input }) => {
      return getCostsChart(input.range)
    }),
  entries: procedure
    .input(
      z.object({
        range: CostsTimeRange,
      }),
    )
    .query(async ({ input }) => {
      return getScalingCostsEntries(input.range)
    }),
})
