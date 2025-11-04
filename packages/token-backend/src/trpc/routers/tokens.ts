import { v } from '@l2beat/validate'
import fuzzysort from 'fuzzysort'
import { db } from '../../database/db'
import { protectedProcedure, router } from '../trpc'
import { getCoinByChainAndAddress } from './coingecko'

export const tokensRouter = router({
  getAllAbstractTokens: protectedProcedure.query(() => {
    return db.abstractToken.getAll()
  }),
  getAllAbstractTokensWithDeployedTokens: protectedProcedure.query(async () => {
    const [abstractTokens, allDeployedTokens] = await Promise.all([
      db.abstractToken.getAll(),
      db.deployedToken.getAll(),
    ])

    const deployedByAbstract = allDeployedTokens.reduce(
      (acc, deployed) => {
        if (deployed.abstractTokenId) {
          if (!acc[deployed.abstractTokenId]) {
            acc[deployed.abstractTokenId] = []
          }
          acc[deployed.abstractTokenId]?.push(deployed)
        }
        return acc
      },
      {} as Record<string, typeof allDeployedTokens>,
    )

    const abstractTokenIds = abstractTokens.map((t) => t.id)

    const deployedWithoutAbstractTokens = allDeployedTokens.filter(
      (t) =>
        !t.abstractTokenId || !abstractTokenIds.includes(t.abstractTokenId),
    )

    return {
      abstractTokens: abstractTokens.map((abstractToken) => ({
        ...abstractToken,
        deployedTokens: deployedByAbstract[abstractToken.id] ?? [],
      })),
      deployedWithoutAbstractTokens,
    }
  }),
  getAbstractById: protectedProcedure
    .input(v.string())
    .query(async ({ input }) => {
      const abstractToken = await db.abstractToken.findById(input)
      if (!abstractToken) {
        return null
      }
      const deployedTokens = await db.deployedToken.getByAbstractTokenId(input)
      return {
        ...abstractToken,
        deployedTokens,
      }
    }),
  getDeployedByChainAndAddress: protectedProcedure
    .input(v.object({ chain: v.string(), address: v.string() }))
    .query(async ({ input }) => {
      const result = await db.deployedToken.findByChainAndAddress({
        chain: input.chain,
        address: input.address,
      })
      return result ?? null
    }),

  checkIfDeployedTokenExists: protectedProcedure
    .input(v.object({ chain: v.string(), address: v.string() }))
    .query(async ({ input }) => {
      const result = await db.deployedToken.findByChainAndAddress({
        chain: input.chain,
        address: input.address,
      })
      return result !== undefined
    }),
  getDeployedTokenDetails: protectedProcedure
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
  search: protectedProcedure.input(v.string()).query(async ({ input }) => {
    const deployedTokens = await db.deployedToken.getAll()
    if (input.startsWith('0x')) {
      return {
        deployedTokens: deployedTokens.filter((t) => t.address === input),
        abstractTokens: [],
      }
    }

    const abstractTokens = await db.abstractToken.getAll()

    const abstractResult = fuzzysort.go(input, abstractTokens, {
      limit: 15,
      keys: [
        (e) => e.id,
        (e) => e.symbol,
        (e) => e.category,
        (e) => e.coingeckoId ?? '',
        (e) => e.issuer ?? 'unknown',
      ],
    })

    const deployedResult = fuzzysort.go(input, deployedTokens, {
      limit: 15,
      keys: [
        (e) => e.address,
        (e) => e.symbol,
        (e) => e.chain,
        (e) => e.abstractTokenId ?? '',
      ],
    })

    return {
      abstractTokens: abstractResult.map((match) => match.obj),
      deployedTokens: deployedResult.map((match) => match.obj),
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
