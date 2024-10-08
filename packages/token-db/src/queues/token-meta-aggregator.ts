import { Logger } from '@l2beat/backend-tools'
import { Database } from '@l2beat/database'
import { buildTokenMetaAggregatorSource } from '../sources/token-meta-aggregator.js'
import { setupQueueWithProcessor } from '../utils/queue/queue-with-processor.js'
import { setupQueue } from '../utils/queue/setup-queue.js'
import { wrapTokenQueue } from '../utils/queue/wrap.js'
import { TokenPayload } from './payloads.js'
import { Redis } from 'ioredis'

export async function setupTokenMetaAggregatorQueue({
  db,
  logger,
  connection,
}: {
  db: Database
  logger: Logger
  connection: Redis
}) {
  const deps = {
    connection,
    logger,
  }
  const queue = setupQueue(deps)
  const queueWithProcessor = setupQueueWithProcessor(deps)
  const tokenMetaAggregatorInbox = queue<TokenPayload>({
    name: 'TokenMetaAggregator.Inbox',
  })
  const tokenMetaAggregatorQueue = wrapTokenQueue(tokenMetaAggregatorInbox)

  const tokenMetaAggregator = queueWithProcessor<TokenPayload>({
    name: 'TokenMetaAggregator.Processor',
    processor: (job) =>
      buildTokenMetaAggregatorSource({
        logger,
        db,
        queue: tokenMetaAggregatorQueue,
      })(job.data.tokenId),
  })

  function start() {
    const statusLogger = logger.for('TokenMetaAggregatorModule')
    statusLogger.info('Starting')

    tokenMetaAggregator.worker.run()

    statusLogger.info('Started')
  }

  return {
    start,
    inbox: tokenMetaAggregatorInbox,
  }
}
