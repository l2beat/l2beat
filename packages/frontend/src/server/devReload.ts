import { createServer } from 'http'
import { WebSocketServer } from 'ws'
import { getLogger } from './utils/logger'

const PORT = 9999

export function setupDevReload() {
  const logger = getLogger().for('DevReload')
  const server = createServer()
  new WebSocketServer({ server })

  server.listen(PORT, () => {
    logger.info('Started', { port: PORT })
  })
}
