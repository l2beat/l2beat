import { CoingeckoClient, HttpClient } from '@l2beat/shared'
import { CoingeckoId, UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { config } from '../../config'
import { db } from '../../database/db'
import { getLogger } from '../../logger'
import { ps } from '../../utils/ps'
import { protectedProcedure, router } from '../trpc'

const httpClient = new HttpClient()
const coingeckoClient = new CoingeckoClient({
  apiKey: config.coingeckoApiKey,
  http: httpClient,
  logger: getLogger(),
  sourceName: 'coingecko',
  callsPerMinute: 400,
  retryStrategy: 'RELIABLE',
})

export const coingeckoRouter = router({
  getCoinById: protectedProcedure.input(v.string()).query(({ input }) => {
    return coingeckoClient.getCoinDataById(CoingeckoId(input))
  }),
  getCoinByChainAndAddress: protectedProcedure
    .input(
      v.object({
        chain: v.string(),
        address: v.string(),
      }),
    )
    .query(async ({ input }) =>
      getCoinByChainAndAddress(input.chain, input.address),
    ),
  getListingTimestamp: protectedProcedure
    .input(v.string())
    .query(async ({ input }) => {
      const data = await coingeckoClient.getCoinMarketChartRange(
        CoingeckoId(input),
        'usd',
        UnixTime.fromDate(new Date('2000-01-01')),
        UnixTime.now(),
      )

      const [firstPrice] = data.prices

      if (!firstPrice) {
        return null
      }

      return UnixTime.fromDate(firstPrice.date)
    }),
})

export async function getCoinByChainAndAddress(chain: string, address: string) {
  const data = await coingeckoClient.getCoinList({ includePlatform: true })
  const chains = (await ps.getProjects({ select: ['chainConfig'] })).map(
    (p) => p.chainConfig,
  )
  const chainToPlatform = new Map(
    chains.map((chain) => [chain.name, chain.coingeckoPlatform]),
  )

  const platform = chainToPlatform.get(chain)
  if (!platform) return null

  const coin = data.find(
    (coin) => coin.platforms[platform]?.toLowerCase() === address.toLowerCase(),
  )
  if (!coin) return null

  const platformToChain = new Map(
    chains.map((chain) => [chain.coingeckoPlatform, chain.name]),
  )

  const otherChains = (
    await Promise.all(
      Object.entries(coin.platforms).map(async ([platform, address]) => {
        const platformChain = platformToChain.get(platform)
        if (!platformChain || !address || platformChain === chain)
          return undefined

        const record = await db.deployedToken.findByChainAndAddress({
          chain: platformChain,
          address,
        })

        return {
          chain: platformChain,
          address,
          exists: !!record,
        }
      }),
    )
  ).filter((x) => x !== undefined)

  return {
    id: coin.id,
    name: coin.name,
    symbol: coin.symbol,
    otherChains,
  }
}
