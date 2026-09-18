import express from 'express'
import { createServer as createViteServer } from 'vite'
import { createApiRouter } from './api'
import { startServer } from './startServer'

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

async function main() {
  const app = express()
  app.use('/api', createApiRouter())

  // Vite serves index.html and the client with HMR, so dev needs a single port.
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  })
  app.use(vite.middlewares)
  startServer(app)
}
