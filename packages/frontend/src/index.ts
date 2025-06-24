// DO NOT MOVE ANYTHING ABOVE THIS LINE BELOW
import './dotenv'

import { env } from '~/env'
import { setupDevReload } from './server/devReload'
import { createServer } from './server/server'
import { createLogger } from './server/utils/logger'

function main() {
  const logger = createLogger()

  createServer(logger)
  if (env.NODE_ENV !== 'production') {
    setupDevReload(logger)
  }
}

main()
