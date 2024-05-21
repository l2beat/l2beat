import { Logger } from '@l2beat/backend-tools'
import { Config } from '../../config'
import { Peripherals } from '../../peripherals/Peripherals'
import { BlockscoutClient } from '../../peripherals/blockscout/BlockscoutClient'
import { ApplicationModule } from '../ApplicationModule'
import { VerifiersController } from './VerifiersController'
import { createVerifiersRouter } from './VerifiersRouter'

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
