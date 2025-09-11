import type { ApplicationModule, ModuleDependencies } from '../types'
import { DaBeatPricesRefresher } from './DaBeatPricesRefresher'
import { DaBeatStakeRefresher } from './DaBeatStakeRefresher'

export function createDaBeatModule({
  config,
  logger,
  peripherals,
  providers,
  clock,
}: ModuleDependencies): ApplicationModule | undefined {
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
    daBeatConfig,
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
