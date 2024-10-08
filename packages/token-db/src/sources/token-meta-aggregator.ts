import { Database } from '@l2beat/database'
import { TokenUpdateQueue } from '../utils/queue/wrap.js'
import { Logger } from '@l2beat/backend-tools'

type Dependencies = {
  logger: Logger
  db: Database
  queue: TokenUpdateQueue
}

export function buildTokenMetaAggregatorSource({
  db,
  logger,
  queue,
}: Dependencies) {
  return async function (tokenId: string) {
    const token = await db.token.findById(tokenId)

    if (!token) {
      logger.error('Token not found', { tokenId })
      return
    }

    const records = (await db.tokenMeta.getByTokenId(tokenId)).filter(
      (r) => r.source === 'Aggregate',
    )

    // TODO: aggregate
    if (records[0]) {
      logger.info('Upserting aggregate token meta', { tokenId })
      await db.tokenMeta.upsert({
        ...records[0],
        source: 'Aggregate',
      })
    }

    queue.add(tokenId)
  }
}
