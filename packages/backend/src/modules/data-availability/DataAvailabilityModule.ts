import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type { Config } from '../../config'
import type { Peripherals } from '../../peripherals/Peripherals'
import type { Providers } from '../../providers/Providers'
import type { Clock } from '../../tools/Clock'
import { IndexerService } from '../../tools/uif/IndexerService'
import type { ApplicationModule } from '../ApplicationModule'
import { DataAvailabilityDependencies } from './DataAvailabilityDependencies'
import type { DataAvailabilityIndexer } from './indexers/types'

export function initDataAvailabilityModule(
  config: Config,
  logger: Logger,
  clock: Clock,
  providers: Providers,
  database: Database,
  _peripherals: Peripherals,
): ApplicationModule | undefined {
  if (!config.da) {
    logger.info('Data availability module disabled')
    return
  }

  logger = logger.tag({
    feature: 'data-availability',
    module: 'data-availability',
  })

  const dependencies = new DataAvailabilityDependencies(
    config,
    database,
    providers,
  )

  const indexers = createDataAvailabilityIndexers(
    config,
    logger,
    clock,
    dependencies,
  )

  return {
    start: async () => {
      await Promise.all(
        indexers.map(async (indexer) => {
          await indexer.start()
        }),
      )
    },
  }
}

function createDataAvailabilityIndexers(
  _dataAvailabilityConfig: unknown,
  _logger: Logger,
  _clock: Clock,
  dependencies: DataAvailabilityDependencies,
): DataAvailabilityIndexer[] {
  const indexers: DataAvailabilityIndexer[] = []

  const _indexerService = new IndexerService(dependencies.database)

  return indexers
}
