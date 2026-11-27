import { TRPCError } from '@trpc/server'
import { env } from '~/env'
import { getLiveChain } from '~/server/features/eth-supply/getLiveChain'
import { procedure, router } from '../trpc'

const ethSupplyProcedure = procedure.use(({ next }) => {
  if (!env.CLIENT_SIDE_ETH_ECONOMICS_ENABLED) {
    throw new TRPCError({ code: 'NOT_FOUND' })
  }
  return next()
})

export const ethSupplyRouter = router({
  liveChain: ethSupplyProcedure.query(async () => {
    const chain = await getLiveChain()
    if (!chain) throw new TRPCError({ code: 'NOT_FOUND' })
    return chain
  }),
})
