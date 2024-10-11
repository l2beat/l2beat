import { Logger } from '@l2beat/backend-tools'
import { z } from 'zod'

import { Database } from '@l2beat/database'
import { upsertManyTokensWithMeta } from '../db/helpers.js'
import { TokenUpdateQueue } from '../utils/queue/wrap.js'
import { zodFetch } from '../utils/zod-fetch.js'

export { buildCoingeckoSource }

type Dependencies = {
  logger: Logger
  db: Database
  queue: TokenUpdateQueue
}

function buildCoingeckoSource({ db, logger, queue }: Dependencies) {
  logger = logger.for('CoingeckoSource')

  return async function () {
    logger.info(`Syncing tokens from Coingecko...`)
    const res = await zodFetch(
      'https://api.coingecko.com/api/v3/coins/list?include_platform=true',
      CoingeckoResponse,
    )
    logger.info('Coingecko token list fetched', { count: res.length })

    const networks = await db.network.getAllWithCoingeckoId()

    const tokens = res
      .map((token) => ({
        ...token,
        platforms: Object.entries(token.platforms ?? {}).flatMap(
          ([platform, address]) => {
            const network = networks.find(
              (network) => network.coingeckoId === platform,
            )

            if (!network) {
              return []
            }

            return { platform, address, network }
          },
        ),
      }))
      .flatMap((token) =>
        token.platforms
          .filter((platform) => platform.address.length > 0)
          .map((platform) => ({
            logoUrl: null,
            decimals: null,
            contractName: null,
            networkId: platform.network.id,
            address: platform.address,
            externalId: token.id,
            symbol: token.symbol,
            name: token.name,
            source: { type: 'CoinGecko' as const },
          })),
      )

    logger.info('Inserting tokens', { count: tokens.length })

    const tokenIds = await upsertManyTokensWithMeta(db, tokens)

    await Promise.all(tokenIds.map((id) => queue.add(id)))

    logger.info(`Synced ${tokens.length} tokens from Coingecko`)
  }
}

const CoingeckoResponse = z.array(
  z.object({
    id: z.string(),
    symbol: z.string(),
    name: z.string(),
    platforms: z.record(z.string()).optional(),
  }),
)
