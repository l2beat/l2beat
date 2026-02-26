// DO NOT MOVE ANYTHING ABOVE THIS LINE BELOW
import './dotenv'

import { createDevServer } from './server/devServer'
import { getLogger } from './server/utils/logger'

async function main() {
  const logger = getLogger()

  logger.info('Starting frontend...')
  await createDevServer(logger)
}

main()
