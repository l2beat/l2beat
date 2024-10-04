import { getAddress } from 'viem'
import { z } from 'zod'
import { refreshTokensOfAddress } from '~/server/features/asset-risks/refresh-tokens-of-address'
import { procedure, router } from '../trpc'
import { refreshBalancesOfAddress } from '~/server/features/asset-risks/refresh-balances-of-address'
import { db } from '~/server/database'
import { TRPCError } from '@trpc/server'
import { assert } from '@l2beat/shared-pure'

export const assetRisksRouter = router({
  refreshTokens: procedure
    .input(
      z.object({
        address: z
          .string()
          .regex(/^0x[a-fA-F0-9]{40}$/)
          .transform((arg) => getAddress(arg)),
      }),
    )
    .mutation(async ({ input }) => {
      return await refreshTokensOfAddress(input.address)
    }),

  refreshBalances: procedure
    .input(
      z.object({
        address: z
          .string()
          .regex(/^0x[a-fA-F0-9]{40}$/)
          .transform((arg) => getAddress(arg)),
      }),
    )
    .mutation(async ({ input }) => {
      return await refreshBalancesOfAddress(input.address)
    }),

    report: procedure
    .input(
      z.object({
        address: z
          .string()
          .regex(/^0x[a-fA-F0-9]{40}$/)
          .transform((arg) => getAddress(arg)),
      }),
    )
    .mutation(async ({ input }) => {
      const user = await db.assetRisksUser.findUserByAddress(input.address)
      if(!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        })
      }
      const balances = await db.assetRisksBalance.getAllForUser(user.id)
      const tokens = await db.token.getByIds(balances.map((b) => b.tokenId))
      // TODO: Fetch info about bridged tokens / bridges / prices / etc.
      return tokens.map((token) => {
        const balanceRecord = balances.find((b) => b.tokenId === token.id)
        assert(balanceRecord, 'Balance not found')
        return {
          token,
          balance: balanceRecord.balance
        }
      })
    })
})
