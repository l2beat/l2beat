import { Logger } from '@l2beat/backend-tools'
import { Database } from '@l2beat/database'
import { Redis } from 'ioredis'
import { buildAxelarConfigSource } from '../sources/axelar-config.js'
import { buildAxelarGatewaySource } from '../sources/axelar-gateway.js'
import { buildCoingeckoSource } from '../sources/coingecko.js'
import { buildOrbitSource } from '../sources/orbit.js'
import { buildTokenListSource } from '../sources/token-list.js'
import { buildWormholeSource } from '../sources/wormhole.js'
import { NetworkConfig } from '../utils/get-networks-config.js'
import { setupQueueWithProcessor } from '../utils/queue/queue-with-processor.js'
import { setupQueue } from '../utils/queue/setup-queue.js'
import { wrapTokenQueue } from '../utils/queue/wrap.js'
import { TokenPayload } from './payloads.js'

export async function setupIndependentQueues({
  db,
  logger,
  connection,
  networksConfig,
}: {
  db: Database
  logger: Logger
  connection: Redis
  networksConfig: NetworkConfig[]
}) {
  const deps = {
    connection,
    logger,
  }
  const queue = setupQueue(deps)
  const queueWithProcessor = setupQueueWithProcessor(deps)

  const tokenUpdateInbox = queue<TokenPayload>({ name: 'TokenUpdate.Inbox' })
  const tokenUpdateQueue = wrapTokenQueue(tokenUpdateInbox)

  const lists = [
    { tag: '1INCH', url: 'https://tokens.1inch.eth.link' },
    { tag: 'AAVE', url: 'http://tokenlist.aave.eth.link' },
    { tag: 'MYCRYPTO', url: 'https://uniswap.mycryptoapi.com/' },
    {
      tag: 'SUPERCHAIN',
      url: 'https://static.optimism.io/optimism.tokenlist.json',
    },
  ]

  const coingecko = queueWithProcessor({
    name: 'Coingecko.Processor',
    processor: buildCoingeckoSource({ logger, db, queue: tokenUpdateQueue }),
  })

  const axelarConfig = queueWithProcessor({
    name: 'AxelarConfig.Processor',
    processor: buildAxelarConfigSource({ logger, db, queue: tokenUpdateQueue }),
  })

  const wormhole = queueWithProcessor({
    name: 'Wormhole.Processor',
    processor: buildWormholeSource({ logger, db, queue: tokenUpdateQueue }),
  })

  const orbit = queueWithProcessor({
    name: 'Orbit.Processor',
    processor: buildOrbitSource({ logger, db, queue: tokenUpdateQueue }),
  })

  const tokenLists = lists.map(({ tag, url }) =>
    queueWithProcessor({
      name: `TokenList.Processor.${tag}`,
      processor: buildTokenListSource({
        tag,
        url,
        logger,
        db,
        queue: tokenUpdateQueue,
      }),
    }),
  )

  const axelarGateway = networksConfig.map((networkConfig) =>
    queueWithProcessor({
      name: `AxelarGateway.Processor.${networkConfig.name}`,
      processor: buildAxelarGatewaySource({
        logger,
        db,
        networkConfig,
        queue: tokenUpdateQueue,
      }),
    }),
  )

  async function start() {
    const statusLogger = logger.for('IndependentQueuesModule')
    statusLogger.info('Starting')

    coingecko.worker.run()
    axelarConfig.worker.run()
    wormhole.worker.run()
    orbit.worker.run()
    tokenLists.forEach(({ worker }) => worker.run())
    axelarGateway.forEach(({ worker }) => worker.run())

    statusLogger.info('Started')
  }

  return {
    start,
    sources: {
      coingecko,
      axelarConfig,
      wormhole,
      orbit,
      tokenLists,
      axelarGateway,
    },
    inbox: tokenUpdateInbox,
  }
}
