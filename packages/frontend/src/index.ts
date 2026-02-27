// DO NOT MOVE ANYTHING ABOVE THIS LINE BELOW
import './dotenv'

import express from 'express'
import { env } from './env'
import { createCacheWarmer } from './server/cacheWarmer'
import { createServer } from './server/server'
import { getLogger } from './server/utils/logger'
import { render } from './ssr/ServerEntry'
import { manifest } from './utils/Manifest'

function main() {
  const logger = getLogger()

  logger.info('Starting frontend...')
  const app = express()
  createServer(logger, {
    dev: false,
    app,
    render,
    stylesheetUrl: manifest.getUrl('/index.css'),
  })

  if (env.REDIS_URL && env.DEPLOYMENT_ENV === 'production') {
    createCacheWarmer(logger)
  }
}

main()
