import { Logger } from '@l2beat/backend-tools'
import { Config } from '../../config'
import { Peripherals } from '../../peripherals/Peripherals'
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

  const verifiersController = new VerifiersController({
    peripherals,
    projects: config.projects,
    logger,
  })

  const verifiersRouter = createVerifiersRouter(verifiersController, config.api)

  const start = () => {
    logger = logger.for('VerifiersModule')
    logger.info('Starting...')

    if (config.api.cache.verifiers) {
      verifiersController.start()
    }
  }

  return {
    start,
    routers: [verifiersRouter],
  }
}
