// DO NOT MOVE ANYTHING ABOVE THIS LINE BELOW
import './dotenv'

import express from 'express'
import { createServer } from './server/server'
import { getLogger } from './server/utils/logger'
import { render } from './ssr/ServerEntry'

function main() {
  const logger = getLogger()

  logger.info('Starting frontend...')
  const app = express()
  createServer(logger, {
    dev: false,
    app,
    render,
  })
}

main()
