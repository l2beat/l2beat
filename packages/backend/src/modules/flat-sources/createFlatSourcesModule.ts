import { Logger } from '@l2beat/backend-tools'
import { ChainConverter } from '@l2beat/shared-pure'

import { Config } from '../../config'
import { Peripherals } from '../../peripherals/Peripherals'
import { ApplicationModule } from '../ApplicationModule'
import { FlatSourcesController } from './api/FlatSourcesController'
import { createFlatSourcesRouter } from './api/createFlatSourcesRouter'

export function createFlatSourcesModule(
  config: Config,
  logger: Logger,
  peripherals: Peripherals,
): ApplicationModule | undefined {
  if (!config.flatSourceModuleEnabled) {
    logger.info('Flat sources module disabled')
    return
  }

  const chainConverter = new ChainConverter(config.chains)
  const controller = new FlatSourcesController(
    peripherals.database,
    chainConverter,
  )

  return {
    routers: [createFlatSourcesRouter(controller)],
  }
}
