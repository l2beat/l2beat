import { Logger } from '@l2beat/backend-tools'
import { Token } from '@prisma/client'
import { createPrismaClient } from './db/prisma.js'
import { connection } from './redis/redis.js'
import { buildCoingeckoSource } from './sources/coingecko.js'
import { buildDeploymentSource } from './sources/deployment.js'
import { buildOrbitSource } from './sources/orbit.js'
import { buildTokenListSource } from './sources/tokenList.js'
import { buildWormholeSource } from './sources/wormhole.js'
import { getNetworksConfig, withExplorer } from './utils/getNetworksConfig.js'
import { eventRouter } from './utils/queue/router/index.js'
import { setupQueue } from './utils/queue/setup-queue.js'
import { setupQueueWithProcessor } from './utils/queue/queue-with-processor.js'
import {
  wrapDeploymentUpdatedQueue,
  wrapTokenQueue,
} from './utils/queue/wrap.js'
import { setupCollector } from './utils/queue/aggregates/collector.js'
import { buildArbitrumCanonicalSource } from './sources/arbitrumCanonical.js'
import { buildOptimismCanonicalSource } from './sources/optimismCanonical.js'
import { buildAxelarConfigSource } from './sources/axelarConfig.js'
import { buildAxelarGatewaySource } from './sources/axelarGateway.js'
import { buildOnChainMetadataSource } from './sources/onChainMetadata.js'
import { byTokenChainId } from './utils/queue/router/routing-key-rules.js'
import { env } from './env.js'
import { startQueueDashboard } from './utils/queue/dashboard.js'
import { buildLineaCanonicalSource } from './sources/lineaCanonical.js'
import { buildZkSyncCanonicalSource } from './sources/zkSyncCanonical.js'
import { buildScrollCanonicalSource } from './sources/scrollCanonical.js'

type TokenPayload = { tokenId: Token['id'] }
type BatchTokenPayload = { tokenIds: Token['id'][] }

const db = createPrismaClient()

const logger = new Logger({ format: 'pretty', colors: true })

const networksConfig = await getNetworksConfig({
  db,
  logger,
})

const router = eventRouter({
  connection,
  logger,
})

const queueWithProcessor = setupQueueWithProcessor({ connection, logger })
const queue = setupQueue({ connection })

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

// #region Deployment processors
// Routing inbox where TokenUpdate events are broadcasted from independent sources
const deploymentRoutingInbox = queue<TokenPayload>({
  name: 'DeploymentRoutingInbox',
})

// Output queue for the deployment processors where the tokenIds are broadcasted if the deployment is updated
const deploymentUpdatedInbox = queue<TokenPayload>({
  name: 'DeploymentUpdatedInbox',
})

const deploymentUpdatedQueue = wrapDeploymentUpdatedQueue(
  deploymentUpdatedInbox,
)

// For each supported network with an explorer, create a deployment processor
const deploymentProcessors = networksConfig
  .filter(withExplorer)
  .map((networkConfig) => {
    const processor = buildDeploymentSource({
      logger,
      db,
      networkConfig,
      queue: deploymentUpdatedQueue,
    })

    const bus = queueWithProcessor<TokenPayload>({
      name: `DeploymentProcessor:${networkConfig.name}`,
      processor: (job) => {
        return processor(job.data.tokenId)
      },
    })

    return {
      queue: bus.queue,
      routingKey: networkConfig.chainId,
    }
  })

// Route the events from deploymentRoutingInbox to the per-chain deployment processors
router.routingKey({
  from: deploymentRoutingInbox,
  to: deploymentProcessors,
  extractRoutingKey: byTokenChainId({ db }),
})
// #endregion Deployment processors

// #region Canonical sources - Arbitrum
const arbitrumCanonicalProcessor = queueWithProcessor<BatchTokenPayload>({
  name: 'ArbitrumCanonicalProcessor',
  processor: buildArbitrumCanonicalSource({ logger, db, networksConfig }),
})

// Handle backpressure from the deployment processor
const arbitrumCanonicalEventCollector = queue<TokenPayload>({
  name: 'ArbitrumCanonicalEventCollector',
})
const oneMinuteMs = 60 * 1000

setupCollector({
  inputQueue: arbitrumCanonicalEventCollector,
  outputQueue: arbitrumCanonicalProcessor.queue,
  aggregate: (data) => ({ tokenIds: data.map((d) => d.tokenId) }),
  bufferSize: 100,
  flushIntervalMs: oneMinuteMs,
  connection,
  logger,
})
// #endregion Canonical sources - Arbitrum

// #region Canonical sources - Optimism
const optimismCanonicalProcessor = queueWithProcessor<BatchTokenPayload>({
  name: 'OptimismCanonicalProcessor',
  processor: buildOptimismCanonicalSource({ logger, db, networksConfig }),
})

// Handle backpressure from the deployment processor
const optimismCanonicalEventCollector = queue<TokenPayload>({
  name: 'OptimismCanonicalEventCollector',
})

setupCollector({
  inputQueue: optimismCanonicalEventCollector,
  outputQueue: optimismCanonicalProcessor.queue,
  aggregate: (data) => ({ tokenIds: data.map((d) => d.tokenId) }),
  bufferSize: 100,
  flushIntervalMs: oneMinuteMs,
  connection,
  logger,
})
// #endregion Canonical sources - Optimism

// #region Canonical sources - Linea
const lineaCanonicalProcessor = queueWithProcessor<BatchTokenPayload>({
  name: 'LineaCanonicalProcessor',
  processor: buildLineaCanonicalSource({ logger, db, networksConfig }),
})

// Handle backpressure from the deployment processor
const lineaCanonicalEventCollector = queue<TokenPayload>({
  name: 'LineaCanonicalEventCollector',
})

setupCollector({
  inputQueue: lineaCanonicalEventCollector,
  outputQueue: lineaCanonicalProcessor.queue,
  aggregate: (data) => ({ tokenIds: data.map((d) => d.tokenId) }),
  bufferSize: 100,
  flushIntervalMs: oneMinuteMs,
  connection,
  logger,
})
// #endregion Canonical sources - Linea

// #region Canonical sources - ZkSync
const zkSyncCanonicalProcessor = queueWithProcessor<BatchTokenPayload>({
  name: 'ZkSyncCanonicalProcessor',
  processor: buildZkSyncCanonicalSource({ logger, db, networksConfig }),
})

// Handle backpressure from the deployment processor
const zkSyncCanonicalEventCollector = queue<TokenPayload>({
  name: 'ZkSyncCanonicalEventCollector',
})

setupCollector({
  inputQueue: zkSyncCanonicalEventCollector,
  outputQueue: zkSyncCanonicalProcessor.queue,
  aggregate: (data) => ({ tokenIds: data.map((d) => d.tokenId) }),
  bufferSize: 100,
  flushIntervalMs: oneMinuteMs,
  connection,
  logger,
})
// #endregion Canonical sources - ZkSync

// #region Canonical sources - Scroll
const scrollCanonicalProcessor = queueWithProcessor<BatchTokenPayload>({
  name: 'ScrollCanonicalProcessor',
  processor: buildScrollCanonicalSource({ logger, db, networksConfig }),
})

// Handle backpressure from the deployment processor
const scrollCanonicalEventCollector = queue<TokenPayload>({
  name: 'ScrollCanonicalEventCollector',
})

setupCollector({
  inputQueue: scrollCanonicalEventCollector,
  outputQueue: scrollCanonicalProcessor.queue,
  aggregate: (data) => ({ tokenIds: data.map((d) => d.tokenId) }),
  bufferSize: 100,
  flushIntervalMs: oneMinuteMs,
  connection,
  logger,
})
// #endregion Canonical sources - Scroll

// #region Canonical sources update wire up
router.routingKey({
  from: deploymentUpdatedInbox,
  to: [
    // Ditch the rest
    {
      queue: arbitrumCanonicalEventCollector,
      routingKey: 42161,
    },
    {
      queue: optimismCanonicalEventCollector,
      routingKey: 10,
    },
    {
      queue: lineaCanonicalEventCollector,
      routingKey: 59144,
    },
    {
      queue: zkSyncCanonicalEventCollector,
      routingKey: 324,
    },
    {
      queue: scrollCanonicalEventCollector,
      routingKey: 534352,
    },
  ],
  extractRoutingKey: byTokenChainId({ db }),
})
// #endregion Canonical sources update wire up

const tokenUpdateInbox = queue<TokenPayload>({
  name: 'TokenUpdateInbox',
})

const tokenUpdateQueue = wrapTokenQueue(tokenUpdateInbox)

// #region On-chain metadata sources
// Routing inbox where TokenUpdate events are broadcasted from independent sources
const onChainMetadataRoutingInbox = queue<TokenPayload>({
  name: 'OnChainMetadataRoutingInbox',
})

// For each network, create routing inbox and backpressure (collector) queue
// so we can batch process the events instead of calling node for each token
const onChainMetadataBuses = networksConfig
  .filter(withExplorer)
  .map((networkConfig) => {
    // Per-chain events will be collected here
    const eventCollectorInbox = queue<TokenPayload>({
      name: `OnChainMetadataEventCollector:${networkConfig.name}`,
    })

    // Batch processor for the collected events
    const batchEventProcessor = queueWithProcessor<BatchTokenPayload>({
      name: `OnChainMetadataBatchProcessor:${networkConfig.name}`,
      processor: (job) =>
        buildOnChainMetadataSource({
          logger,
          db,
          networkConfig,
        })(job.data.tokenIds),
    })

    // Wire up the collector to the processor
    setupCollector({
      inputQueue: eventCollectorInbox,
      outputQueue: batchEventProcessor.queue,
      aggregate: (data) => ({ tokenIds: data.map((d) => d.tokenId) }),
      bufferSize: 100,
      flushIntervalMs: oneMinuteMs,
      connection,
      logger,
    })

    return {
      queue: eventCollectorInbox,
      batchQueue: batchEventProcessor.queue,
      routingKey: networkConfig.chainId,
    }
  })

// Route the events from the global inbox to the per-chain event collectors
router.routingKey({
  from: onChainMetadataRoutingInbox,
  to: onChainMetadataBuses.map((bus) => ({
    queue: bus.queue,
    routingKey: bus.routingKey,
  })),
  extractRoutingKey: byTokenChainId({ db }),
})
// #endregion On-chain metadata sources
// #region Independent sources

const coingeckoSource = buildCoingeckoSource({
  logger,
  db,
  queue: tokenUpdateQueue,
})
const axelarConfigSource = buildAxelarConfigSource({
  logger,
  db,
  queue: tokenUpdateQueue,
})
const wormholeSource = buildWormholeSource({
  logger,
  db,
  queue: tokenUpdateQueue,
})
const orbitSource = buildOrbitSource({ logger, db, queue: tokenUpdateQueue })
const tokenListSources = lists.map(({ tag, url }) =>
  queueWithProcessor({
    name: `TokenListProcessor:${tag}`,
    processor: buildTokenListSource({
      tag,
      url,
      logger,
      db,
      queue: tokenUpdateQueue,
    }),
  }),
)

// const lzV1Sources = networksConfig.filter(withExplorer).map((networkConfig) => {
//   return {
//     name: `LayerZeroV1Processor:${networkConfig.name}`,
//     processor: buildLayerZeroV1Source({
//       logger,
//       db,
//       networkConfig,
//       queue: tokenUpdateQueue,
//     }),
//   }
// })

// const lzV1Queues = lzV1Sources.map((source) => sourceQueue(source))

const axelarGatewayQueues = networksConfig.map((networkConfig) =>
  queueWithProcessor({
    name: `AxelarGatewayProcessor:${networkConfig.name}`,
    processor: buildAxelarGatewaySource({
      logger,
      db,
      networkConfig,
      queue: tokenUpdateQueue,
    }),
  }),
)

const coingeckoQueue = queueWithProcessor({
  name: 'CoingeckoProcessor',
  processor: coingeckoSource,
})

const axelarConfigQueue = queueWithProcessor({
  name: 'AxelarConfigProcessor',
  processor: axelarConfigSource,
})

const wormholeQueue = queueWithProcessor({
  name: 'WormholeProcessor',
  processor: wormholeSource,
})

const orbitQueue = queueWithProcessor({
  name: 'OrbitProcessor',
  processor: orbitSource,
})

const independentSources = [
  coingeckoQueue,
  ...axelarGatewayQueues,
  axelarConfigQueue,
  wormholeQueue,
  orbitQueue,
  ...tokenListSources,
  // ...lzV1Queues,
]

// Input signal, might be removed
const refreshInbox = queue({
  name: 'RefreshInbox',
})

// Input signal, might be removed
router.broadcast({
  from: refreshInbox,
  to: independentSources.map((q) => q.queue),
})

// Broadcast the token update events to the independent sources to dependant sources
router.broadcast({
  from: tokenUpdateInbox,
  to: [deploymentRoutingInbox, onChainMetadataRoutingInbox],
})

// #endregion Independent sources

// #region BullBoard

const dashboardLogger = logger.for('QueueDashboard')

if (env.QUEUE_DASHBOARD_PORT) {
  const allQueues = [
    deploymentRoutingInbox,
    tokenUpdateInbox,
    refreshInbox,
    independentSources.map((q) => q.queue),
    deploymentProcessors.map((p) => p.queue),
    arbitrumCanonicalEventCollector,
    optimismCanonicalEventCollector,
    arbitrumCanonicalProcessor.queue,
    optimismCanonicalProcessor.queue,
    deploymentUpdatedInbox,
    onChainMetadataBuses.map((b) => b.queue),
    onChainMetadataBuses.map((b) => b.batchQueue),
    onChainMetadataRoutingInbox,
  ].flat()

  await startQueueDashboard({
    port: env.QUEUE_DASHBOARD_PORT,
    logger: dashboardLogger,
    queues: allQueues,
    signalQueue: refreshInbox,
  })
} else {
  dashboardLogger.warn('Queue dashboard is disabled')
}
// #endregion BullBoard
