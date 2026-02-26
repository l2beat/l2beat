// DO NOT MOVE ANYTHING ABOVE THIS LINE BELOW
import './dotenv'

import { env } from '~/env'
import { createCacheWarmer } from './server/cacheWarmer'
import { createServer } from './server/server'
import { getLogger } from './server/utils/logger'

async function main() {
  const logger = getLogger()

  logger.info('Starting frontend...')

  await createServer(logger)

  if (env.REDIS_URL && env.DEPLOYMENT_ENV === 'production') {
    createCacheWarmer(logger)
  }
}

main()
