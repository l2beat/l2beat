import { z } from 'zod'
import { getTokensOfAddress } from '~/server/features/asset-risk/get-tokens-of-address'
import { procedure, router } from '../trpc'
import { getAddress } from 'viem'

export const assetRisksRouter = router({
  tokens: procedure
    .input(
      z.object({
        address: z.string().regex(/^0x[a-fA-F0-9]{40}$/).transform((arg) => getAddress(arg)),
      }),
    )
    .query(async ({ input }) => {
      return await getTokensOfAddress(input.address)
    }),
})
