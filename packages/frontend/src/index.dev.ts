// DO NOT MOVE ANYTHING ABOVE THIS LINE BELOW
import './dotenv'

import express from 'express'
import { createDevRender } from './server/createDevRender'
import { createServer } from './server/server'
import { getLogger } from './server/utils/logger'

async function main() {
  const logger = getLogger()

  logger.info('Starting frontend...')
  const app = express()
  const { createDevMiddleware } = await import('./server/createDevMiddleware')
  const vite = await createDevMiddleware(app)
  createServer(logger, {
    dev: true,
    app,
    vite,
    render: createDevRender(vite),
  })
}

main()
