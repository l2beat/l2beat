// DO NOT MOVE ANYTHING ABOVE THIS LINE BELOW
import './dotenv'

import { env } from '~/env'
import { setupDevReload } from './server/devReload'
import { createServer } from './server/server'
import { createLogger } from './server/utils/logger'

async function main() {
  const logger = await createLogger(env)

  createServer(logger)
  if (env.NODE_ENV !== 'production') {
    setupDevReload(logger)
  }
}

main().catch(console.error)
