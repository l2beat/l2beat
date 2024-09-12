import { Logger } from '@l2beat/backend-tools'
import { Redis } from 'ioredis'
import { broadcast } from './broadcast.js'
import { forward } from './forward.js'
import { routingKey } from './routingKey.js'

export function eventRouter({
  connection,
  logger,
}: { connection: Redis; logger: Logger }) {
  logger = logger.for('EventRouter')

  return {
    forward: forward({ connection, logger }),
    broadcast: broadcast({ connection, logger }),
    routingKey: routingKey({ connection, logger }),
  }
}
