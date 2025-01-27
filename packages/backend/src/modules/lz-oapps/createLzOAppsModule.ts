import type { Logger } from '@l2beat/backend-tools'

import type { Config } from '../../config'
import type { ApplicationModule } from '../ApplicationModule'
import { LzOAppsController } from './api/LzOappsController'
import { createLzOAppsRouter } from './api/LzOappsRouter'

export function createLzOAppsModule(
  config: Config,
  logger: Logger,
): ApplicationModule | undefined {
  if (!config.lzOAppsEnabled) {
    logger.info('LayerZero OApps module disabled')
    return
  }

  const controller = new LzOAppsController(logger)
  const routers = [createLzOAppsRouter(controller)]

  const start = () => {
    logger = logger.for('LzOAppsModule')
    logger.info('Started')
  }

  return {
    start,
    routers,
  }
}
