import { type StageConfig, layer2s, layer3s } from '@l2beat/config'
import { assert } from '@l2beat/shared-pure'
import { TRPCError } from '@trpc/server'
import { getAddress } from 'viem'
import { z } from 'zod'
import { db } from '~/server/database'
import { refreshBalancesOfAddress } from '~/server/features/asset-risks/refresh-balances-of-address'
import { refreshTokensOfAddress } from '~/server/features/asset-risks/refresh-tokens-of-address'
import { procedure, router } from '../trpc'

const projects = [...layer2s, ...layer3s]

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
      const externalBridges = await db.externalBridge.getAll()
      const bridges = await db.tokenBridge.getAll()
      const balances = await db.assetRisksBalance.getAllForUser(user.id)
      const tokenIds = balances.map((b) => b.tokenId)
      const tokens = await db.token.getByIds(tokenIds)
      const tokenMeta = await db.tokenMeta.getByTokenIdsAndSource(
        tokenIds,
        'Aggregate',
      )
      // TODO: Fetch info about prices / etc.

      const chains = networks.reduce<
        Record<
          string,
          {
            name: string
            risks: {
              text: string
              isCritical?: boolean
            }[]
            stage?: StageConfig['stage']
          }
        >
      >((acc, { id, name, chainId }) => {
        const chain = projects.find((p) => p.chainConfig?.chainId === chainId)
        if (chain) {
          acc[id] = {
            name: chain.display.name,
            stage: 'stage' in chain ? chain.stage?.stage : undefined,
            risks: (chain?.technology
              ? [
                  chain.technology.stateCorrectness,
                  chain.technology.newCryptography,
                  chain.technology.dataAvailability,
                  chain.technology.operator,
                  chain.technology.forceTransactions,
                  ...(chain.technology.exitMechanisms ?? []),
                  chain.technology.massExit,
                  ...(chain.technology.otherConsiderations ?? []),
                ].flatMap((choice) => choice?.risks ?? [])
              : []
            ).map((r) => ({
              text: `${r.category} ${r.text}`,
              isCritical: r.isCritical,
            })),
          }
        } else {
          acc[id] = {
            name,
            risks: [],
          }
        }
        return acc
      }, {})

      return {
        usdValue: 0,
        tokensRefreshedAt: user.tokensRefreshedAt,
        balancesRefreshedAt: user.balancesRefreshedAt,
        chains,
        bridges,
        externalBridges,
        tokens: tokens.map((token) => {
          const balanceRecord = balances.find((b) => b.tokenId === token.id)
          assert(balanceRecord, 'Balance not found')

          return {
            token,
            meta: tokenMeta.find((m) => m.tokenId === token.id && m.name),
            balance: balanceRecord.balance,
          }
        }),
      }
    }),
})
