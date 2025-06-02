import { createServer } from 'http'
import { Logger } from '@l2beat/backend-tools'
import { WebSocketServer } from 'ws'

export function setupDevReload(logger: Logger) {
  logger = logger.for('DevReload')
  const server = createServer()
  new WebSocketServer({ server })

  server.listen(9999, () => {
    logger.info(`Server started at http://localhost:9999`)
  })
}
