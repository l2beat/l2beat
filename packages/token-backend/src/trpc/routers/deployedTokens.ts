import { v } from '@l2beat/validate'
import { db } from '../../database/db'
import { protectedProcedure, router } from '../trpc'
import { getCoinByChainAndAddress } from './coingecko'

export const deployedTokensRouter = router({
  getByChainAndAddress: protectedProcedure
    .input(v.object({ chain: v.string(), address: v.string() }))
    .query(async ({ input }) => {
      const result = await db.deployedToken.findByChainAndAddress({
        chain: input.chain,
        address: input.address,
      })
      return result ?? null
    }),

  checkIfExists: protectedProcedure
    .input(v.object({ chain: v.string(), address: v.string() }))
    .query(async ({ input }) => {
      const result = await db.deployedToken.findByChainAndAddress({
        chain: input.chain,
        address: input.address,
      })
      return result !== undefined
    }),

  getDetails: protectedProcedure
    .input(v.object({ chain: v.string(), address: v.string() }))
    .query(async ({ input }) => {
      const result = await db.deployedToken.findByChainAndAddress({
        chain: input.chain,
        address: input.address,
      })
      if (result !== undefined) {
        return {
          type: 'already-exists' as const,
        }
      }

      const token = getRpcDetails(input.chain, input.address)
      if (token === undefined) {
        return {
          type: 'not-found-on-rpc' as const,
        }
      }

      const coin = await getCoinByChainAndAddress(input.chain, input.address)
      if (coin === null) {
        return {
          type: 'not-found-on-coingecko' as const,
          data: token,
        }
      }

      const abstractToken = coin.id
        ? await db.abstractToken.findByCoingeckoId(coin.id)
        : undefined

      return {
        type: 'success' as const,
        data: {
          ...coin,
          ...token,
          abstractToken,
        },
      }
    }),
})

function getRpcDetails(
  chain: string,
  address: string,
): { decimals: number; deploymentTimestamp: number } | undefined {
  return {
    decimals: 18,
    deploymentTimestamp: 1714732800,
  }
}
