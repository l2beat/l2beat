import { Logger } from '@l2beat/backend-tools'
import { chains, getVerifiersFromConfig } from '@l2beat/config'
import { Config } from '../../config'
import { Peripherals } from '../../peripherals/Peripherals'
import { Clock } from '../../tools/Clock'
import { ApplicationModule } from '../ApplicationModule'
import { VerifiersStatusRefresher } from './VerifiersStatusRefresher'

export function createVerifiersModule(
  config: Config,
  logger: Logger,
  peripherals: Peripherals,
  clock: Clock,
): ApplicationModule | undefined {
  if (!config.verifiers) {
    logger.info('VerifiersModule disabled')
    return
  }

  logger = logger.tag({ feature: 'verifiers', module: 'verifiers' })

  const refresher = new VerifiersStatusRefresher({
    db: peripherals.database,
    peripherals,
    clock,
    logger,
    verifiersListProvider: getVerifiersFromConfig,
    chains: chains,
  })

  const start = () => {
    logger = logger.for('VerifiersModule')
    logger.info('Starting...')

    refresher.start()

    logger.info('Started')
  }

  return {
    start,
  }
}
