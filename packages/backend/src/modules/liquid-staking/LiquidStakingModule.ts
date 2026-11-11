import { DuneQueryService } from '@l2beat/shared'
import { DailyIndexer } from '../../tools/DailyIndexer'
import { HourlyIndexer } from '../../tools/HourlyIndexer'
import { IndexerService } from '../../tools/uif/IndexerService'
import type { ApplicationModule, ModuleDependencies } from '../types'
import { readExecutionDay } from './network/dune/readExecutionDay'
import { EthereumStakingIndexer } from './network/EthereumStakingIndexer'
import { shareBlockLookups } from './shareBlockLookups'
import { LiquidStakingIndexer } from './tokens/LiquidStakingIndexer'

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
  const duneClient = providers.clients.dune
  if (!duneClient) {
    throw new Error('liquid-staking needs DUNE_API_KEY')
  }

  const { sinceTimestamp, projects } = config.liquidStaking
  const indexerService = new IndexerService(db)
  const dune = new DuneQueryService({ logger, duneClient })
  const rpc = providers.clients.getRpcClient('ethereum')
  // Over RPC, as Etherscan's daily limit is shared with the other modules
  const blockFinder = shareBlockLookups(
    providers.block.getBlockProvider('ethereum'),
  )
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
              minHeight: sinceTimestamp,
              maxHeight: null,
              properties: project,
            },
          ],
          tags: { tag: project.projectId, project: project.projectId },
          db,
          rpc,
          blockFinder,
        },
        logger,
      ),
  )
  const ethereumStakingIndexer = new EthereumStakingIndexer(
    {
      parents: [dailyIndexer],
      indexerService,
      firstDay: sinceTimestamp,
      db,
      rpc,
      readExecutionDay: (day, fromBlock, toBlock) =>
        readExecutionDay(dune, logger, day, fromBlock, toBlock),
      beacon,
      blockFinder,
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
