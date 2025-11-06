import { v } from '@l2beat/validate'
import { db } from '../../database/db'
import { protectedProcedure, router } from '../trpc'

export const abstractTokensRouter = router({
  getAll: protectedProcedure.query(() => {
    return db.abstractToken.getAll()
  }),
  getAllWithDeployedTokens: protectedProcedure.query(async () => {
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
  getById: protectedProcedure.input(v.string()).query(async ({ input }) => {
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
})
