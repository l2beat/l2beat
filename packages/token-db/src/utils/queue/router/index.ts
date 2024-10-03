import { Logger } from '@l2beat/backend-tools'
import { Redis } from 'ioredis'
import { broadcast } from './broadcast.js'
import { routingKey } from './routing-key.js'

export function eventRouter({
  connection,
  logger,
}: { connection: Redis; logger: Logger }) {
  logger = logger.for('EventRouter')

  return {
    broadcast: broadcast({ connection, logger }),
    routingKey: routingKey({ connection, logger }),
  }
}
