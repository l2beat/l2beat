import { Logger } from '@l2beat/backend-tools'
import { Database } from '@l2beat/database'
import { Redis } from 'ioredis'
import { buildArbitrumCanonicalSource } from '../sources/arbitrum-canonical.js'
import { buildOptimismCanonicalSource } from '../sources/optimism-canonical.js'
import { buildZkSyncCanonicalSource } from '../sources/zksync-canonical.js'
import { NetworkConfig } from '../utils/get-networks-config.js'
import { setupCollector } from '../utils/queue/aggregates/collector.js'
import { setupQueueWithProcessor } from '../utils/queue/queue-with-processor.js'
import { setupQueue } from '../utils/queue/setup-queue.js'
import { BatchTokenPayload, TokenPayload } from './payloads.js'

const oneMinuteMs = 60 * 1000

export async function setupCanonicalQueues({
  connection,
  db,
  logger,
  networksConfig,
}: {
  connection: Redis
  db: Database
  logger: Logger
  networksConfig: NetworkConfig[]
}) {
  const deps = {
    connection,
    logger,
  }

  const queue = setupQueue(deps)
  const queueWithProcessor = setupQueueWithProcessor(deps)

  // Arbitrum
  const arbitrumCanonicalProcessor = queueWithProcessor<BatchTokenPayload>({
    name: 'Arbitrum.Canonical.BatchProcessor',
    processor: buildArbitrumCanonicalSource({ logger, db, networksConfig }),
  })
  const arbitrumCanonicalEventCollector = queue<TokenPayload>({
    name: 'Arbitrum.Canonical.EventCollector',
  })

  // Handle backpressure from the deployment processor (for each below)
  const arbitrumCollectorWorker = setupCollector({
    inputQueue: arbitrumCanonicalEventCollector,
    outputQueue: arbitrumCanonicalProcessor.queue,
    aggregate: (data) => ({ tokenIds: data.map((d) => d.tokenId) }),
    bufferSize: 100,
    flushIntervalMs: oneMinuteMs,
    connection,
    logger,
  })

  // Optimism
  const optimismCanonicalProcessor = queueWithProcessor<BatchTokenPayload>({
    name: 'Optimism.Canonical.BatchProcessor',
    processor: buildOptimismCanonicalSource({ logger, db, networksConfig }),
  })
  const optimismCanonicalEventCollector = queue<TokenPayload>({
    name: 'Optimism.Canonical.EventCollector',
  })

  const optimismCollectorWorker = setupCollector({
    inputQueue: optimismCanonicalEventCollector,
    outputQueue: optimismCanonicalProcessor.queue,
    aggregate: (data) => ({ tokenIds: data.map((d) => d.tokenId) }),
    bufferSize: 100,
    flushIntervalMs: oneMinuteMs,
    connection,
    logger,
  })

  // ZkSync
  const zkSyncCanonicalProcessor = queueWithProcessor<BatchTokenPayload>({
    name: 'ZkSync.Canonical.BatchProcessor',
    processor: buildZkSyncCanonicalSource({ logger, db, networksConfig }),
  })
  const zkSyncCanonicalEventCollector = queue<TokenPayload>({
    name: 'ZkSync.Canonical.EventCollector',
  })

  const zkSyncCollectorWorker = setupCollector({
    inputQueue: zkSyncCanonicalEventCollector,
    outputQueue: zkSyncCanonicalProcessor.queue,
    aggregate: (data) => ({ tokenIds: data.map((d) => d.tokenId) }),
    bufferSize: 100,
    flushIntervalMs: oneMinuteMs,
    connection,
    logger,
  })

  function start() {
    const statusLogger = logger.for('CanonicalQueuesModule')
    statusLogger.info('Starting')

    const toRun = [
      arbitrumCollectorWorker,
      arbitrumCanonicalProcessor.worker,
      optimismCollectorWorker,
      optimismCanonicalProcessor.worker,
      zkSyncCollectorWorker,
      zkSyncCanonicalProcessor.worker,
    ]

    toRun.forEach((worker) => worker.run())

    statusLogger.info('Started')
  }

  return {
    start,
    arbitrum: {
      processor: arbitrumCanonicalProcessor,
      collector: {
        queue: arbitrumCanonicalEventCollector,
        worker: arbitrumCollectorWorker,
      },
    },
    optimism: {
      processor: optimismCanonicalProcessor,
      collector: {
        queue: optimismCanonicalEventCollector,
        worker: optimismCollectorWorker,
      },
    },
    zkSync: {
      processor: zkSyncCanonicalProcessor,
      collector: {
        queue: zkSyncCanonicalEventCollector,
        worker: zkSyncCollectorWorker,
      },
    },
  }
}
