import type { ProjectId } from '@l2beat/shared-pure'
import { HourlyIndexer } from '../../tools/HourlyIndexer'
import { IndexerService } from '../../tools/uif/IndexerService'
import type { ApplicationModule, ModuleDependencies } from '../types'
import { DaBeatPricesRefresher } from './DaBeatPricesRefresher'
import { DaBeatStakeRefresher } from './DaBeatStakeRefresher'
import { DaBeatStatsIndexer } from './DaBeatStatsIndexer'

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

  const hourlyIndexer = new HourlyIndexer(logger, clock)
  const indexerService = new IndexerService(peripherals.database)
  const statsIndexers: DaBeatStatsIndexer[] = []

  for (const [projectId, { stake, validators }] of Object.entries(
    daBeatConfig.projectsForDaBeatStats,
  )) {
    if (projectId === 'avail') continue

    const indexer = new DaBeatStatsIndexer({
      db: peripherals.database,
      projectId: projectId as ProjectId,
      logger,
      indexerService,
      minHeight: 0,
      parents: [hourlyIndexer],
      statsProvider: providers.daBeatStats,
    })
    statsIndexers.push(indexer)
  }

  const start = async () => {
    logger = logger.for('DaBeatModule')
    logger.info('Starting')

    // pricesRefresher.start()
    // stakeRefresher.start()

    await hourlyIndexer.start()
    for (const indexer of statsIndexers) {
      await indexer.start()
    }

    logger.info('Started')
  }

  return {
    start,
  }
}
