import { createServer } from 'http'
import type { Logger } from '@l2beat/backend-tools'
import { WebSocketServer } from 'ws'

export function setupDevReload(logger: Logger) {
  const appLogger = logger.for('DevReload')
  const server = createServer()
  new WebSocketServer({ server })

  server.listen(9999, () => {
    appLogger.info(`Started at http://localhost:9999`)
  })
}
