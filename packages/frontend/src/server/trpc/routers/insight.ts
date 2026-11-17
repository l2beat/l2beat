import { v } from '@l2beat/validate'
import { TRPCError } from '@trpc/server'
import { env } from '~/env'
import { getInsightReport } from '~/server/features/insight/getInsightReport'
import { parseHolderInput } from '~/server/features/insight/parseHolderInput'
import { procedure, router } from '../trpc'

export const insightRouter = router({
  report: procedure
    .input(v.object({ addressOrName: v.string() }))
    .query(({ input }) => {
      // The route is gated too, but the API would otherwise expose the
      // RPC behind a flag that is off.
      if (!env.CLIENT_SIDE_INSIGHT_PAGE) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }
      const holder = parseHolderInput(input.addressOrName)
      if (!holder) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid address or ENS name',
        })
      }
      return getInsightReport(holder)
    }),
})
