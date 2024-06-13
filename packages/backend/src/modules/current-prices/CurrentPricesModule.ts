import { Logger } from '@l2beat/backend-tools'

import { Config } from '../../config'
import { Peripherals } from '../../peripherals/Peripherals'
import { Clock } from '../../tools/Clock'
import { ApplicationModule } from '../ApplicationModule'
import { CurrentPricesRefresher } from './CurrentPricesRefresher'

export function createCurrentPricesModule(
  config: Config,
  logger: Logger,
  peripherals: Peripherals,
  clock: Clock,
): ApplicationModule | undefined {
  if (!config.activity) {
    logger.info('Activity module disabled')
    return
  }

  const currentPricesRefresher = new CurrentPricesRefresher(
    peripherals.database,
    clock,
    logger,
  )

  const start = async () => {
    logger = logger.for('ActivityModule')
    logger.info('Starting')
    await Promise.all(processors.map((p) => p.start()))
    viewRefresher.start()
    logger.info('Started')
  }

  return {
    start,
  }
}
