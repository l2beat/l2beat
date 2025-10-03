// DO NOT MOVE ANYTHING ABOVE THIS LINE BELOW
import './dotenv'

import { env } from '~/env'
import { createCacheWarmer } from './server/cacheWarmer'
import { setupDevReload } from './server/devReload'
import { createServer } from './server/server'
import { getLogger } from './server/utils/logger'

function main() {
  const logger = getLogger()

  logger.info('Starting frontend...')

  createServer(logger)

  if (env.NODE_ENV === 'production') {
    createCacheWarmer(logger)
  } else {
    setupDevReload(logger)
  }
}

main()
