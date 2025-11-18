import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import type { CoingeckoClient } from '../../chains/clients/coingecko/CoingeckoClient'
import type { Coin } from '../../chains/clients/coingecko/types'
import { readOnlyProcedure } from '../procedures'
import { router } from '../trpc'

export interface AbstractTokensRouterDeps {
  coingeckoClient: CoingeckoClient
}

export const abstractTokensRouter = (deps: AbstractTokensRouterDeps) => {
  const { coingeckoClient } = deps

  return router({
    getAll: readOnlyProcedure.query(({ ctx }) => {
      return ctx.db.abstractToken.getAll()
    }),
    getAllWithDeployedTokens: readOnlyProcedure.query(async ({ ctx }) => {
      const [abstractTokens, allDeployedTokens] = await Promise.all([
        ctx.db.abstractToken.getAll(),
        ctx.db.deployedToken.getAll(),
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
    getById: readOnlyProcedure
      .input(v.string())
      .query(async ({ ctx, input }) => {
        const abstractToken = await ctx.db.abstractToken.findById(input)
        if (!abstractToken) {
          return null
        }
        const deployedTokens =
          await ctx.db.deployedToken.getByAbstractTokenId(input)
        return {
          ...abstractToken,
          deployedTokens,
        }
      }),
    checks: readOnlyProcedure.input(v.string()).query(async ({ input }) => {
      let coin: Coin | null = null
      try {
        coin = await coingeckoClient.getCoinDataById(input)
      } catch (error) {
        console.error(error)
      }

      if (coin === null) {
        return {
          error: {
            type: 'not-found-on-coingecko' as const,
            message: 'Coin not found on Coingecko',
          },
          data: undefined,
        }
      }

      let listingTimestamp: UnixTime | undefined
      try {
        const marketChart = await coingeckoClient.getCoinMarketChartRange(
          coin.id,
          'usd',
          UnixTime.fromDate(new Date('2000-01-01')),
          UnixTime.fromDate(new Date()),
        )
        const [firstPrice] = marketChart.prices

        if (!firstPrice) {
          return null
        }

        listingTimestamp = UnixTime(
          Math.floor(firstPrice.date.getTime() / 1000),
        )
      } catch (error) {
        console.error(error)
      }

      return {
        error: undefined,
        data: {
          coinId: coin.id,
          coinUrl: coin.image.large,
          listingTimestamp,
        },
      }
    }),
  })
}
