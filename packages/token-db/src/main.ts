import { Logger } from '@l2beat/backend-tools'

import { buildAxelarGatewaySource } from './sources/axelarGateway.js'
import { buildCoingeckoSource } from './sources/coingecko.js'
import { buildTokenListSource } from './sources/tokenList.js'

import { createPrismaClient } from './db/prisma.js'
import { buildArbitrumCanonicalSource } from './sources/arbitrumCanonical.js'
import { buildAxelarConfigSource } from './sources/axelarConfig.js'
import { buildDeploymentSource } from './sources/deployment.js'
import { buildOnChainMetadataSource } from './sources/onChainMetadata.js'
import { buildOptimismCanonicalSource } from './sources/optimismCanonical.js'
import { buildOrbitSource } from './sources/orbit.js'
import { buildWormholeSource } from './sources/wormhole.js'
import { getNetworksConfig, withExplorer } from './utils/getNetworksConfig.js'
import { getTokensForChain } from './utils/getTokensForChain.js'
import { TokenUpdateQueue } from './utils/queue/wrap.js'

const db = createPrismaClient()

const voidQueue = { add: () => {} } as unknown as TokenUpdateQueue

const logger = new Logger({ format: 'pretty', colors: true })

const networksConfig = await getNetworksConfig({
  db,
  logger,
})

const lists = [
  {
    tag: '1INCH',
    url: 'https://tokens.1inch.eth.link',
  },
  {
    tag: 'AAVE',
    url: 'http://tokenlist.aave.eth.link',
  },
  {
    tag: 'MYCRYPTO',
    url: 'https://uniswap.mycryptoapi.com/',
  },
  {
    tag: 'SUPERCHAIN',
    url: 'https://static.optimism.io/optimism.tokenlist.json',
  },
]

const tokenListSources = lists.map(({ tag, url }) =>
  buildTokenListSource({
    tag,
    url,
    logger,
    db,
    queue: voidQueue,
  }),
)

const coingeckoSource = buildCoingeckoSource({
  logger,
  db,
  queue: voidQueue,
})

const axelarGatewaySources = networksConfig.map((networkConfig) =>
  buildAxelarGatewaySource({
    logger,
    db,
    networkConfig,
    queue: voidQueue,
  }),
)

const onChainMetadataSources = networksConfig.map(
  (networkConfig) => async () => {
    const tokens = await db.token.findMany({
      where: { network: { chainId: networkConfig.chainId } },
    })

    return buildOnChainMetadataSource({
      logger,
      db,
      networkConfig,
    })(tokens.map((token) => token.id))
  },
)
const axelarConfigSource = buildAxelarConfigSource({
  logger,
  db,
  queue: voidQueue,
})

const wormholeSource = buildWormholeSource({ logger, db, queue: voidQueue })

const orbitSource = buildOrbitSource({ logger, db, queue: voidQueue })

// const lzSources = networksConfig.filter(withExplorer).map((networkConfig) =>
//   buildLayerZeroV1Source({
//     logger,
//     db,
//     networkConfig,
//     queue: voidQueue,
//   }),
// )

const pipeline = [
  coingeckoSource,
  ...tokenListSources,
  ...axelarGatewaySources,
  axelarConfigSource,
  wormholeSource,
  orbitSource,
  ...onChainMetadataSources,
  // ...lzSources,
]

for (const step of pipeline) {
  try {
    await step()
  } catch (e) {
    logger.error('Failed to run step', { error: e })
  }
}

const deploymentSources = (
  await Promise.all(
    networksConfig.filter(withExplorer).map(async (networkConfig) => {
      logger.info(`Running deployment source`, {
        chain: networkConfig.name,
      })

      const tokens = await getTokensForChain({
        db,
        networkConfig,
      })

      logger.info(`Getting deployments info for tokens`, {
        count: tokens.length,
      })

      return tokens.map(
        (token) => () =>
          buildDeploymentSource({
            logger,
            db,
            networkConfig,
            queue: voidQueue,
          })(token.id),
      )
    }),
  )
).flat()

const arbitrumCanonicalSource = buildArbitrumCanonicalSource({
  logger,
  db,
  networksConfig,
})

const optimismCanonicalSource = buildOptimismCanonicalSource({
  logger,
  db,
  networksConfig,
})

const dependedPipeline = [
  ...deploymentSources,

  // those 2 have to be after deployment sources
  arbitrumCanonicalSource,
  optimismCanonicalSource,
]

for (const step of dependedPipeline) {
  try {
    await step()
  } catch (e) {
    logger.error('Failed to run step', { error: e })
  }
}

await stop()

async function stop() {
  await db.$disconnect()
}

process.on('SIGINT', () => stop)
