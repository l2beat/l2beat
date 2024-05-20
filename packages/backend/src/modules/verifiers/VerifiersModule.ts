import { Logger } from '@l2beat/backend-tools'
import { Config } from '../../config'
import { ApplicationModule } from '../ApplicationModule'
import { Peripherals } from '../../peripherals/Peripherals'
import { createVerifiersRouter } from './VerifiersRouter'
import { VerifiersController } from './VerifiersController'
import { ChainId, UnixTime } from '@l2beat/shared-pure'
import { BlockscoutClient } from '../../peripherals/blockscout/BlockscoutClient'

const MAX_DAYS = 365

export function createVerifiersModule(
  config: Config,
  logger: Logger,
  peripherals: Peripherals,
): ApplicationModule | undefined {
  if (!config.verifiers) {
    logger.info('VerifiersModule disabled')
    return
  }

  const blockscoutClient = peripherals.getClient(BlockscoutClient, {
    url: config.verifiers.blockscoutApiUrl,
  })

  const verifiersController = new VerifiersController({
    blockscoutClient,
    projects: config.projects,
    logger,
  })

  const l2CostsRouter = createVerifiersRouter(verifiersController, config.api)

  const start = () => {
    logger = logger.for('VerifiersModule')
    logger.info('Starting...')

    if (config.api.cache.verifiers) {
      verifiersController.start()
    }
  }

  return {
    start,
    routers: [l2CostsRouter],
  }
}
