import type { AdjustCount } from '@l2beat/config'
import { assertUnreachable, UnixTime } from '@l2beat/shared-pure'
import { IndexerService } from '../../tools/uif/IndexerService'
import type { ApplicationModule, ModuleDependencies } from '../types'
import { BlockActivityIndexer } from './indexers/BlockActivityIndexer'
import { BlockTargetIndexer } from './indexers/BlockTargetIndexer'
import { DayActivityIndexer } from './indexers/DayActivityIndexer'
import { DayTargetIndexer } from './indexers/DayTargetIndexer'
import { SlotTargetIndexer } from './indexers/SlotTargetIndexer'
import type { ActivityIndexer } from './indexers/types'
import { BlockTxsCountService } from './services/txs/BlockTxsCountService'
import { DayTxsCountService } from './services/txs/DayTxsCountService'
import { SlotTxsCountService } from './services/txs/SlotTxsCountService'

export function initActivityModule({
  config,
  logger,
  db: database,
  clock,
  providers,
}: ModuleDependencies): ApplicationModule | undefined {
  if (!config.activity) {
    logger.info('Activity module disabled')
    return
  }

  logger = logger.tag({ feature: 'activity', module: 'activity' })

  const indexerService = new IndexerService(database)

  const indexers: ActivityIndexer[] = []

  for (const project of config.activity.projects) {
    switch (project.activityConfig.type) {
      case 'block': {
        const blockTargetIndexer = new BlockTargetIndexer(
          logger,
          clock,
          providers.blockTimestamp,
          database,
          project,
          {
            onTick: async (targetTimestamp, blockNumber) => {
              if (!config.activity) {
                return
              }

              await database.syncMetadata.upsertMany([
                {
                  feature: 'activity',
                  id: project.id,
                  target: targetTimestamp,
                  blockTarget: blockNumber,
                },
              ])
            },
          },
        )

        const provider = providers.block.getBlockProvider(project.chainName)
        const analyzer = providers.uops.getUopsAnalyzer(project.chainName)
        const txsCountService = new BlockTxsCountService({
          provider,
          projectId: project.id,
          assessCount: assessCount(project.activityConfig.adjustCount),
          uopsAnalyzer: analyzer,
          logger,
        })

        const activityIndexer = new BlockActivityIndexer({
          logger,
          projectId: project.id,
          batchSize: project.activityConfig.batchSize ?? 100,
          minHeight: project.activityConfig.startBlock ?? 1,
          parents: [blockTargetIndexer],
          txsCountService,
          indexerService,
          db: database,
        })

        indexers.push(blockTargetIndexer, activityIndexer)
        break
      }

      case 'slot': {
        const slotTargetIndexer = new SlotTargetIndexer(
          logger,
          clock,
          providers.slotTimestamp,
          project,
          {
            onTick: async (targetTimestamp, slotTarget) => {
              if (!config.activity) {
                return
              }

              await database.syncMetadata.upsertMany([
                {
                  feature: 'activity',
                  id: project.id,
                  target: targetTimestamp,
                  blockTarget: slotTarget,
                },
              ])
            },
          },
        )

        const provider = providers.svmBlock.getBlockProvider(project.chainName)
        const txsCountService = new SlotTxsCountService({
          provider,
          projectId: project.id,
          logger,
        })

        const activityIndexer = new BlockActivityIndexer({
          logger,
          projectId: project.id,
          batchSize: project.activityConfig.batchSize ?? 100,
          minHeight: project.activityConfig.startSlot ?? 1,
          parents: [slotTargetIndexer],
          txsCountService,
          indexerService,
          db: database,
        })

        indexers.push(slotTargetIndexer, activityIndexer)
        break
      }

      case 'day': {
        const dayTargetIndexer = new DayTargetIndexer(logger, clock, {
          // We do not want to index today's data because it's not fully processed yet
          // We want to process full previous day
          onTick: async (targetTimestamp) => {
            if (!config.activity) {
              return
            }

            await database.syncMetadata.upsertMany([
              {
                feature: 'activity',
                id: project.id,
                target: targetTimestamp,
              },
            ])
          },
        })

        const provider = providers.day.getDayProvider(project.chainName)
        const txsCountService = new DayTxsCountService({
          provider,
          projectId: project.id,
        })

        const activityIndexer = new DayActivityIndexer({
          logger,
          projectId: project.id,
          minHeight: UnixTime.toDays(
            UnixTime.toStartOf(project.activityConfig.sinceTimestamp, 'day'),
          ),
          parents: [dayTargetIndexer],
          txsCountService,
          indexerService,
          db: database,
          batchSize:
            project.activityConfig.batchSize ?? Number.POSITIVE_INFINITY,
          uncertaintyBuffer: project.activityConfig.resyncLastDays ?? 0,
        })

        indexers.push(dayTargetIndexer, activityIndexer)
        break
      }

      default:
        assertUnreachable(project.activityConfig)
    }
  }

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

function assessCount(
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
