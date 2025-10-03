import type { Logger } from '@l2beat/backend-tools'
import { createServer } from 'http'
import { WebSocketServer } from 'ws'

const PORT = 9999

export function setupDevReload(logger: Logger) {
  logger = logger.for('DevReload')
  const server = createServer()
  new WebSocketServer({ server })

  server.listen(PORT, () => {
    logger.info('Started', { port: PORT })
  })
}
