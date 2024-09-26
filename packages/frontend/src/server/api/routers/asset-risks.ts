import { z } from 'zod'
import { getTokensOfAddress } from '~/server/features/asset-risk/get-tokens-of-address'
import { procedure, router } from '../trpc'

export const assetRisksRouter = router({
  tokens: procedure
    .input(
      z.object({
        address: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
      }),
    )
    .query(async ({ input }) => {
      return await getTokensOfAddress(input.address)
    }),
})
