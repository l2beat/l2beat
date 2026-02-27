// DO NOT MOVE ANYTHING ABOVE THIS LINE BELOW
import './dotenv'

import { createServer } from './server/server'
import { getLogger } from './server/utils/logger'

async function main() {
  const logger = getLogger()

  logger.info('Starting frontend...')
  await createServer(logger, { dev: true })
}

main()
