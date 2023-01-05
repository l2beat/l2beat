import { Logger } from '@l2beat/common'

import { Config } from '../../config'
import { ApplicationModule } from '../ApplicationModule'

export function createWatchModule(
  config: Config,
  logger: Logger,
): ApplicationModule {
  return {
    routers: [],
    start: () => {
      if (!config.watchModeEnabled) {
        return
      }

      logger = logger.for('WatchModule')
      logger.info('Starting')
    },
  }
}
