import { Logger } from '@l2beat/backend-tools'
import { Config } from '../../config'
import { Peripherals } from '../../peripherals/Peripherals'
import { Providers } from '../../providers/Providers'
import { Clock } from '../../tools/Clock'
import { ApplicationModule } from '../ApplicationModule'
import { DaBeatPricesRefresher } from './DaBeatPricesRefresher'
import { DaBeatStakeRefresher } from './DaBeatStakeRefresher'

export function createDaBeatModule(
  config: Config,
  logger: Logger,
  peripherals: Peripherals,
  providers: Providers,
  clock: Clock,
): ApplicationModule | undefined {
  const daBeatConfig = config.daBeat
  if (!daBeatConfig) {
    logger.info('DABeat module disabled')
    return
  }

  logger = logger.tag({
    feature: 'dabeat',
    module: 'dabeat',
  })

  const pricesRefresher = new DaBeatPricesRefresher(
    peripherals.database,
    providers.clients.coingecko,
    clock,
    logger,
  )

  const stakeRefresher = new DaBeatStakeRefresher(
    peripherals,
    daBeatConfig,
    clock,
    logger,
  )

  const start = () => {
    logger = logger.for('DaBeatModule')
    logger.info('Starting')
    pricesRefresher.start()
    stakeRefresher.start()
    logger.info('Started')
  }

  return {
    start,
  }
}
