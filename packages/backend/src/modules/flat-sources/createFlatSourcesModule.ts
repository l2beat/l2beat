import type { Logger } from '@l2beat/backend-tools'

import type { Config } from '../../config'
import type { Peripherals } from '../../peripherals/Peripherals'
import type { ApplicationModule } from '../ApplicationModule'
import { createFlatSourcesRouter } from './api/createFlatSourcesRouter'
import { FlatSourcesController } from './api/FlatSourcesController'

export function createFlatSourcesModule(
  config: Config,
  logger: Logger,
  peripherals: Peripherals,
): ApplicationModule | undefined {
  if (!config.flatSourceModuleEnabled) {
    logger.info('Flat sources module disabled')
    return
  }

  const controller = new FlatSourcesController(peripherals.database)

  return {
    routers: [createFlatSourcesRouter(controller)],
  }
}
