import type { ApplicationModule, ModuleDependencies } from '../types'
import { VerifiersStatusRefresher } from './VerifiersStatusRefresher'

export function createVerifiersModule({
  config,
  logger,
  peripherals,
  clock,
}: ModuleDependencies): ApplicationModule | undefined {
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
    verifiers: config.verifiers.verifiers,
    chains: config.verifiers.chains,
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
