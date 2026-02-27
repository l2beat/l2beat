// DO NOT MOVE ANYTHING ABOVE THIS LINE BELOW
import './dotenv'

import express from 'express'
import { createServer } from './server/server'
import { getLogger } from './server/utils/logger'

async function main() {
  const logger = getLogger()

  logger.info('Starting frontend...')
  const app = express()
  const { createDevMiddleware } = await import('./server/createDevMiddleware')
  const vite = await createDevMiddleware(app)
  const mod = await vite.ssrLoadModule('/src/ssr/ServerEntry.tsx')
  const render = mod.render
  createServer(logger, {
    dev: true,
    app,
    vite,
    render,
    stylesheetUrl: '/src/styles/globals.css?direct',
  })
}

main()
