import { Logger } from '@l2beat/backend-tools'

import { Config } from '../../config'
import { Peripherals } from '../../peripherals/Peripherals'
import { Clock } from '../../tools/Clock'
import { ApplicationModule } from '../ApplicationModule'
import { DaBeatPricesRefresher } from './DaBeatPricesRefresher'
import { CoingeckoClient } from '@l2beat/shared'

export function createDaBeatModule(
  config: Config,
  logger: Logger,
  peripherals: Peripherals,
  clock: Clock,
): ApplicationModule | undefined {
  if (!config.daBeat) {
    logger.info('DABeat module disabled')
    return
  }

  const pricesRefresher = new DaBeatPricesRefresher(
    peripherals.database,
    peripherals.getClient(CoingeckoClient, {
      apiKey: config.daBeat.coingeckoApiKey,
    }),
    clock,
    logger,
  )

  const start = () => {
    logger = logger.for('ActivityModule')
    logger.info('Starting')
    pricesRefresher.start()
    logger.info('Started')
  }

  return {
    start,
  }
}
