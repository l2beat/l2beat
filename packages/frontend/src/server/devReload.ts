import { createServer } from 'http'
import type { Logger } from '@l2beat/backend-tools'
import { WebSocketServer } from 'ws'

const PORT = 9999

export function setupDevReload(logger: Logger) {
  const appLogger = logger.for('DevReload')
  const server = createServer()
  new WebSocketServer({ server })

  server.listen(PORT, () => {
    appLogger.info(`Started`, { port: PORT })
  })
}
