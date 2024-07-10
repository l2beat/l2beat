import { Logger } from '@l2beat/backend-tools'
import { Config } from '../../config'
import { Peripherals } from '../../peripherals/Peripherals'
import { ApplicationModule } from '../ApplicationModule'
import { VerifiersStatusRefresher } from './VerifiersStatusRefresher'
import { Clock } from '../../tools/Clock'
import { chains, layer2s, zkCatalogProjects } from '@l2beat/config'

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

  const refresher = new VerifiersStatusRefresher({
    database: peripherals.database,
    peripherals,
    clock,
    logger,
    layer2s: layer2s,
    zkCatalogProjects: zkCatalogProjects,
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
