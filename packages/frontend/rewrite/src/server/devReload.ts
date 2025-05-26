import { createServer } from 'http'
import { WebSocketServer } from 'ws'

export function setupDevReload() {
  const server = createServer()
  new WebSocketServer({ server })

  server.listen(9999, () => {
    console.log(`Server started at http://localhost:9999`)
  })
}
