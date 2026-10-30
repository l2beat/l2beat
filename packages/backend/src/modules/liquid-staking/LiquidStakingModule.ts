import { UnixTime } from '@l2beat/shared-pure'
import { DailyIndexer } from '../../tools/DailyIndexer'
import { HourlyIndexer } from '../../tools/HourlyIndexer'
import { IndexerService } from '../../tools/uif/IndexerService'
import type { ApplicationModule, ModuleDependencies } from '../types'
import { EthereumStakingIndexer } from './EthereumStakingIndexer'
import { LiquidStakingIndexer } from './LiquidStakingIndexer'

export function createLiquidStakingModule({
  config,
  logger,
  clock,
  db,
  providers,
}: ModuleDependencies): ApplicationModule | undefined {
  if (!config.liquidStaking) {
    logger.info('LiquidStakingModule disabled')
    return
  }

  logger = logger.tag({ feature: 'liquid-staking', module: 'liquid-staking' })
  const beacon = providers.clients.beacon
  if (!beacon) {
    throw new Error('liquid-staking needs ETHEREUM_BEACON_API_URL')
  }

  const { sinceTimestamp, projects } = config.liquidStaking
  const indexerService = new IndexerService(db)
  const rpc = providers.clients.getRpcClient('ethereum')
  const hourlyIndexer = new HourlyIndexer(logger, clock)
  const dailyIndexer = new DailyIndexer(logger, clock)
  // One indexer per project, so a project whose reads fail stalls alone.
  const indexers = projects.map(
    (project) =>
      new LiquidStakingIndexer(
        {
          parents: [hourlyIndexer],
          indexerService,
          configurations: [
            {
              id: project.configurationId,
              minHeight: project.sinceTimestamp,
              maxHeight: null,
              properties: project,
            },
          ],
          tags: { tag: project.projectId, project: project.projectId },
          db,
          rpc,
          blockTimestampProvider: providers.blockTimestamp,
        },
        logger,
      ),
  )
  const ethereumStakingIndexer = new EthereumStakingIndexer(
    {
      parents: [dailyIndexer],
      indexerService,
      // Heights are day ends, so the first stored day is sinceTimestamp.
      minHeight: sinceTimestamp + UnixTime.DAY,
      db,
      rpc,
      beacon,
      blockTimestampProvider: providers.blockTimestamp,
    },
    logger,
  )

  logger.info('Liquid staking config loaded', { projects: projects.length })

  return {
    start: async () => {
      await hourlyIndexer.start()
      await dailyIndexer.start()
      for (const indexer of indexers) {
        await indexer.start()
      }
      await ethereumStakingIndexer.start()
    },
  }
}
