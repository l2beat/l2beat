import type { Logger } from '@l2beat/backend-tools'
import type { AdjustCount } from '@l2beat/config'
import type { Database } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import type { Config } from '../../config'
import type { Providers } from '../../providers/Providers'
import type { Clock } from '../../tools/Clock'
import { IndexerService } from '../../tools/uif/IndexerService'
import type { ApplicationModule } from '../ApplicationModule'
import { BlockActivityIndexer } from './indexers/BlockActivityIndexer'
import { BlockTargetIndexer } from './indexers/BlockTargetIndexer'
import { DayActivityIndexer } from './indexers/DayActivityIndexer'
import { DayTargetIndexer } from './indexers/DayTargetIndexer'
import type { ActivityIndexer } from './indexers/types'
import { BlockTxsCountService } from './services/txs/BlockTxsCountService'
import { DayTxsCountService } from './services/txs/DayTxsCountService'

export function initActivityModule(
  config: Config,
  logger: Logger,
  clock: Clock,
  providers: Providers,
  database: Database,
): ApplicationModule | undefined {
  if (!config.activity) {
    logger.info('Activity module disabled')
    return
  }

  logger = logger.tag({ feature: 'activity', module: 'activity' })

  const indexerService = new IndexerService(database)

  const dayTargetIndexer = new DayTargetIndexer(logger, clock)
  const indexers: ActivityIndexer[] = [dayTargetIndexer]

  config.activity.projects.forEach((project) => {
    switch (project.activityConfig.type) {
      case 'block': {
        const blockTimestampProvider =
          providers.block.getBlockTimestampProvider(project.chainName)
        const blockTargetIndexer = new BlockTargetIndexer(
          logger,
          clock,
          blockTimestampProvider,
          database,
          project.id,
        )

        const provider = providers.block.getBlockProvider(project.chainName)
        const analyzer = providers.uops.getUopsAnalyzer(project.chainName)
        const txsCountService = new BlockTxsCountService({
          provider,
          projectId: project.id,
          assessCount: assesCount(project.activityConfig.adjustCount),
          uopsAnalyzer: analyzer,
        })

        const activityIndexer = new BlockActivityIndexer({
          logger,
          projectId: project.id,
          batchSize: project.batchSize,
          minHeight: 1,
          parents: [blockTargetIndexer],
          txsCountService,
          indexerService,
          db: database,
        })

        indexers.push(blockTargetIndexer, activityIndexer)
        break
      }

      case 'day': {
        const provider = providers.day.getDayProvider(project.chainName)
        const txsCountService = new DayTxsCountService(provider, project.id)

        const activityIndexer = new DayActivityIndexer({
          logger,
          projectId: project.id,
          batchSize: 10,
          minHeight: UnixTime.toDays(
            UnixTime.toStartOf(project.activityConfig.sinceTimestamp, 'day'),
          ),
          uncertaintyBuffer: project.activityConfig.resyncLastDays ?? 0,
          parents: [dayTargetIndexer],
          txsCountService,
          indexerService,
          db: database,
        })

        indexers.push(activityIndexer)
        break
      }
    }
  })

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

function assesCount(
  adjustCount: AdjustCount | undefined,
): (count: number, block: number) => number {
  if (!adjustCount) {
    return (count) => count
  }
  if (adjustCount.type === 'SubtractOne') {
    return (count) => count - 1
  }
  if (adjustCount.type === 'SubtractOneSinceBlock') {
    return (count: number, block: number) =>
      block >= adjustCount.blockNumber ? count - 1 : count
  }
  throw new Error('Unknown config for adjustCount')
}
