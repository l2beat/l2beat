import type { ProjectId } from '@l2beat/shared-pure'
import { HourlyIndexer } from '../../tools/HourlyIndexer'
import { IndexerService } from '../../tools/uif/IndexerService'
import { generateConfigurationId } from '../tvs/tools/extractPricesAndAmounts'
import type { ApplicationModule, ModuleDependencies } from '../types'
import { DaBeatPricesIndexer } from './DaBeatPricesIndexer'
import { DaBeatStatsIndexer } from './DaBeatStatsIndexer'

export function createDaBeatModule({
  config,
  logger,
  providers,
  clock,
  db,
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

  const hourlyIndexer = new HourlyIndexer(logger, clock)
  const indexerService = new IndexerService(db)
  const statsIndexers: DaBeatStatsIndexer[] = []

  for (const projectId of daBeatConfig.projectsForDaBeatStats) {
    const indexer = new DaBeatStatsIndexer({
      db,
      projectId: projectId as ProjectId,
      logger,
      indexerService,
      minHeight: 0,
      parents: [hourlyIndexer],
      statsProvider: providers.daBeatStats,
    })
    statsIndexers.push(indexer)
  }

  const pricesIndexer = new DaBeatPricesIndexer({
    priceProvider: providers.price,
    db,
    logger,
    indexerService,
    parents: [hourlyIndexer],
    configurations: [
      {
        id: generateConfigurationId(daBeatConfig.coingeckoIds),
        minHeight: 0,
        maxHeight: null,
        properties: { coingeckoIds: daBeatConfig.coingeckoIds },
      },
    ],
  })

  const start = async () => {
    logger = logger.for('DaBeatModule')
    logger.info('Starting')

    await hourlyIndexer.start()
    for (const indexer of statsIndexers) {
      await indexer.start()
    }
    await pricesIndexer.start()

    logger.info('Started')
  }

  return {
    start,
  }
}
