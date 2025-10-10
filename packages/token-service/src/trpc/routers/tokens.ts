import { v } from '@l2beat/validate'
import fuzzysort from 'fuzzysort'
import { db } from '../../database/db'
import { protectedProcedure, router } from '../trpc'

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
  getById: protectedProcedure
    .input(v.object({ id: v.string() }))
    .query(async ({ input }) => {
      const abstractToken = await db.abstractToken.findById(input.id)
      if (abstractToken) {
        const deployedTokens = await db.deployedToken.getByAbstractTokenId(
          input.id,
        )
        return {
          type: 'abstract' as const,
          token: {
            ...abstractToken,
            deployedTokens,
          },
        }
      }
      const [chain, address] = input.id.split('+')
      const deployedToken = await db.deployedToken.findByChainAndAddress({
        chain,
        address,
      })
      if (deployedToken) {
        return {
          type: 'deployed' as const,
          token: deployedToken,
        }
      }
      return null
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
  search: protectedProcedure
    .input(v.object({ search: v.string() }))
    .query(async ({ input }) => {
      const deployedTokens = await db.deployedToken.getAll()
      if (input.search.startsWith('0x')) {
        return {
          deployedTokens: deployedTokens.filter(
            (t) => t.address === input.search,
          ),
          abstractTokens: [],
        }
      }

      const abstractTokens = await db.abstractToken.getAll()

      const abstractResult = fuzzysort.go(input.search, abstractTokens, {
        limit: 15,
        keys: [
          (e) => e.id,
          (e) => e.symbol,
          (e) => e.category,
          (e) => e.coingeckoId ?? '',
          (e) => e.issuer ?? 'unknown',
        ],
      })

      const deployedResult = fuzzysort.go(input.search, deployedTokens, {
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
