import type { ApplicationModule, ModuleDependencies } from '../types'
import { createFlatSourcesRouter } from './api/createFlatSourcesRouter'
import { FlatSourcesController } from './api/FlatSourcesController'

export function createFlatSourcesModule({
  config,
  logger,
  peripherals,
}: ModuleDependencies): ApplicationModule | undefined {
  if (!config.flatSourceModuleEnabled) {
    logger.info('Flat sources module disabled')
    return
  }

  const controller = new FlatSourcesController(peripherals.database)

  return {
    routers: [createFlatSourcesRouter(controller)],
  }
}
