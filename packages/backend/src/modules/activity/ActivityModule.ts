import { hashJson } from '@l2beat/shared'
import { assertUnreachable, UnixTime } from '@l2beat/shared-pure'
import { instrumentCoreFeatureRpcMetricsRun } from '../../tools/coreFeatureRpcMetrics'
import { IndexerService } from '../../tools/uif/IndexerService'
import type { ApplicationModule, ModuleDependencies } from '../types'
import { BlockActivityIndexer } from './indexers/BlockActivityIndexer'
import { BlockTargetIndexer } from './indexers/BlockTargetIndexer'
import { DayActivityIndexer } from './indexers/DayActivityIndexer'
import { DayTargetIndexer } from './indexers/DayTargetIndexer'
import { HourActivityIndexer } from './indexers/HourActivityIndexer'
import { HourTargetIndexer } from './indexers/HourTargetIndexer'
import { SlotTargetIndexer } from './indexers/SlotTargetIndexer'
import type { ActivityIndexer } from './indexers/types'
import { HeadFollower } from './live/HeadFollower'
import { LiveActivityCleaner } from './live/LiveActivityCleaner'
import { RpcBlockFetcher } from './live/RpcBlockFetcher'
import { BlockTxsCountService } from './services/txs/BlockTxsCountService'
import { DayTxsCountService } from './services/txs/DayTxsCountService'
import { SlotTxsCountService } from './services/txs/SlotTxsCountService'
import { assessCount } from './utils/assessCount'

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
  const headFollowers: HeadFollower[] = []

  for (const project of config.activity.projects) {
    const onTick = async (target: UnixTime, blockTarget?: number) => {
      await database.syncMetadata.setTargets('activity', [
        { id: project.id, target, blockTarget },
      ])
    }

    switch (project.activityConfig.type) {
      case 'block': {
        const blockTargetIndexer = new BlockTargetIndexer(
          logger,
          clock,
          providers.blockTimestamp,
          database,
          project,
          { onTick },
        )

        const provider = providers.activityBlock.getProvider(project.chainName)
        const blockSource = new BlockTxsCountService(
          {
            provider,
            projectId: project.id,
            assessCount: assessCount(project.activityConfig.adjustCount),
          },
          logger,
        )

        const rpc = project.followHead
          ? providers.clients.rpcClients.find(
              (client) => client.chain === project.chainName,
            )
          : undefined
        const fetcher =
          rpc &&
          new RpcBlockFetcher(
            rpc,
            providers.uops.getUopsAnalyzer(project.chainName),
            blockSource,
          )
        const headFollower =
          fetcher &&
          instrumentCoreFeatureRpcMetricsRun(
            new HeadFollower(
              {
                projectId: project.id,
                batchSize: project.activityConfig.batchSize ?? 100,
                configHash: hashJson(
                  project.activityConfig.adjustCount ?? null,
                ),
                fetcher,
                db: database,
              },
              logger,
            ),
            'activity.live',
            { chain: project.chainName, mode: 'head' },
          )

        const activityIndexer = new BlockActivityIndexer(
          {
            projectId: project.id,
            batchSize: project.activityConfig.batchSize ?? 100,
            minHeight: project.activityConfig.startBlock ?? 1,
            parents: [blockTargetIndexer],
            blockSource,
            indexerService,
            db: database,
          },
          logger,
        )

        indexers.push(blockTargetIndexer, activityIndexer)
        if (headFollower) headFollowers.push(headFollower)
        break
      }

      case 'slot': {
        const slotTargetIndexer = new SlotTargetIndexer(
          logger,
          clock,
          providers.slotTimestamp,
          project,
          { onTick },
        )

        const provider = providers.svmBlock.getBlockProvider(project.chainName)
        const blockSource = new SlotTxsCountService(
          {
            provider,
            projectId: project.id,
          },
          logger,
        )

        const activityIndexer = new BlockActivityIndexer(
          {
            projectId: project.id,
            batchSize: project.activityConfig.batchSize ?? 100,
            minHeight: project.activityConfig.startSlot ?? 1,
            parents: [slotTargetIndexer],
            blockSource,
            indexerService,
            db: database,
          },
          logger,
        )

        indexers.push(slotTargetIndexer, activityIndexer)
        break
      }

      case 'day': {
        const dayTargetIndexer = new DayTargetIndexer(logger, clock, { onTick })

        const provider = providers.day.getDayProvider(project.chainName)
        const txsCountService = new DayTxsCountService({
          provider,
          projectId: project.id,
        })

        const activityIndexer = new DayActivityIndexer(
          {
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
          },
          logger,
        )

        indexers.push(dayTargetIndexer, activityIndexer)
        break
      }

      case 'hour': {
        const hourTargetIndexer = new HourTargetIndexer(logger, clock, {
          onTick,
        })

        const activityIndexer = new HourActivityIndexer(
          {
            projectId: project.id,
            minHeight:
              UnixTime.toStartOf(project.activityConfig.sinceTimestamp, 'day') /
              UnixTime.HOUR,
            parents: [hourTargetIndexer],
            provider: providers.day.getHourlyProvider(project.chainName),
            indexerService,
            db: database,
          },
          logger,
        )

        indexers.push(hourTargetIndexer, activityIndexer)
        break
      }

      default:
        assertUnreachable(project.activityConfig)
    }
  }

  // also with no follower, so blocks stored before it was turned off go too
  const cleaner = new LiveActivityCleaner(database, logger)

  return {
    start: async () => {
      await Promise.all(headFollowers.map((follower) => follower.initialize()))
      await Promise.all(
        indexers.map(async (indexer) => {
          await indexer.start()
        }),
      )
      cleaner.start()
      for (const follower of headFollowers) {
        follower.start()
      }
    },
  }
}
