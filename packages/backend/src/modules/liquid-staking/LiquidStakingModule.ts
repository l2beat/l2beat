import { HourlyIndexer } from '../../tools/HourlyIndexer'
import { IndexerService } from '../../tools/uif/IndexerService'
import type { ApplicationModule, ModuleDependencies } from '../types'
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
  const { sinceTimestamp, projects } = config.liquidStaking
  const hourlyIndexer = new HourlyIndexer(logger, clock)
  const indexer = new LiquidStakingIndexer(
    {
      parents: [hourlyIndexer],
      indexerService: new IndexerService(db),
      configurations: projects.map((project) => ({
        id: project.configurationId,
        minHeight: sinceTimestamp,
        maxHeight: null,
        properties: project,
      })),
      db,
      rpc: providers.clients.getRpcClient('ethereum'),
      blockTimestampProvider: providers.blockTimestamp,
    },
    logger,
  )

  logger.info('Liquid staking config loaded', { projects: projects.length })

  return {
    start: async () => {
      await hourlyIndexer.start()
      await indexer.start()
    },
  }
}
