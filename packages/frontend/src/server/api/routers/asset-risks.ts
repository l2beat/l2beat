import { getAddress } from 'viem'
import { z } from 'zod'
import { refreshTokensOfAddress } from '~/server/features/asset-risks/refresh-tokens-of-address'
import { procedure, router } from '../trpc'
import { refreshBalancesOfAddress } from '~/server/features/asset-risks/refresh-balances-of-address'
import { db } from '~/server/database'
import { TRPCError } from '@trpc/server'
import { assert } from '@l2beat/shared-pure'
import { Layer2, layer2s, Layer3, layer3s } from '@l2beat/config'

const projects = [...layer2s, ...layer3s];

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
    .query(async ({ input }) => {
      await db.assetRisksUser.upsert({
        address: input.address,
      })
      const user = await db.assetRisksUser.findUserByAddress(input.address)
      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        })
      }
      const networks = await db.network.getAll()
      const balances = await db.assetRisksBalance.getAllForUser(user.id)
      const tokens = await db.token.getByIds(balances.map((b) => b.tokenId))
      // TODO: Fetch only needed token meta
      const tokenMeta = await db.tokenMeta.getAll()
      // TODO: Fetch info about bridged tokens / bridges / prices / etc.

      const chains = networks.reduce<Record<string, (Layer2 | Layer3)>>((acc, { id, chainId}) => {
        const project = projects.find(p => p.chainConfig?.chainId === chainId)
        if(project) {
          acc[id] = project
        }
        return acc;
      }, {})

      return {
        usdValue: 0,
        tokensRefreshedAt: user.tokensRefreshedAt,
        balancesRefreshedAt: user.balancesRefreshedAt,
        projects: chains,
        tokens: tokens.map((token) => {
          const balanceRecord = balances.find((b) => b.tokenId === token.id)
          assert(balanceRecord, 'Balance not found')
          
          return {
            token,
            meta: tokenMeta.find(m => m.tokenId === token.id && m.name),
            balance: balanceRecord.balance,
          }
        }),
      }
    }),
})
