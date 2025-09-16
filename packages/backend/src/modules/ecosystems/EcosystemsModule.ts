import { HourlyIndexer } from '../../tools/HourlyIndexer'
import { IndexerService } from '../../tools/uif/IndexerService'
import type { ApplicationModule, ModuleDependencies } from '../types'
import { EcosystemTokenIndexer } from './EcosystemTokenIndexer'

export function createEcosystemsModule({
  config,
  logger,
  peripherals,
  providers,
  clock,
}: ModuleDependencies): ApplicationModule | undefined {
  const ecosystemsConfig = config.ecosystems
  if (!ecosystemsConfig) {
    logger.info('Ecosystems module disabled')
    return
  }

  logger = logger.tag({
    feature: 'ecosystems',
    module: 'ecosystems',
  })

  const hourlyIndexer = new HourlyIndexer(logger, clock)

  const indexers = ecosystemsConfig.tokens.map(
    (token) =>
      new EcosystemTokenIndexer({
        db: peripherals.database,
        logger,
        minHeight: 0,
        indexerService: new IndexerService(peripherals.database),
        parents: [hourlyIndexer],
        tokenConfig: token,
        coingeckoClient: providers.clients.coingecko,
      }),
  )

  const start = async () => {
    logger = logger.for('EcosystemsModule')
    logger.info('Starting')

    await hourlyIndexer.start()
    for (const indexer of indexers) {
      await indexer.start()
    }

    logger.info('Started')
  }

  return {
    start,
  }
}
