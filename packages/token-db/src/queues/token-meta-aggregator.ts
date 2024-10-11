import { Logger } from '@l2beat/backend-tools'
import { Database } from '@l2beat/database'
import { Redis } from 'ioredis'
import { buildTokenMetaAggregatorSource } from '../sources/token-meta-aggregator.js'
import { setupQueueWithProcessor } from '../utils/queue/queue-with-processor.js'
import { TokenPayload } from './payloads.js'

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
  const queueWithProcessor = setupQueueWithProcessor(deps)
  const tokenMetaAggregator = queueWithProcessor<TokenPayload>({
    name: 'TokenMetaAggregator.Processor',
    processor: (job) =>
      buildTokenMetaAggregatorSource({
        logger,
        db,
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
    inbox: tokenMetaAggregator.queue,
  }
}
