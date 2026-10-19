import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { DiscordClient } from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import uniqBy from 'lodash/uniqBy'
import type {
  BlockDaIndexedConfig,
  DataAvailabilityTrackingConfig,
  LiveBlobsTrackingConfig,
  NotificationsConfig,
} from '../../config/Config'
import type { Providers } from '../../providers/Providers'
import type { Clock } from '../../tools/Clock'
import { HourlyIndexer } from '../../tools/HourlyIndexer'
import { IndexerService } from '../../tools/uif/IndexerService'
import type { ApplicationModule, ModuleDependencies } from '../types'
import { BlobIndexer } from './indexers/BlobIndexer'
import { BlockTargetIndexer } from './indexers/BlockTargetIndexer'
import { DaIndexer } from './indexers/DaIndexer'
import { EthereumBlobNotifierIndexer } from './indexers/EthereumBlobNotifierIndexer'
import { LiveBlobsIndexer } from './indexers/live/LiveBlobsIndexer'
import { LiveBlobsTargetIndexer } from './indexers/live/LiveBlobsTargetIndexer'
import { BlobService } from './services/BlobService'
import { DaService } from './services/DaService'
import { createDataAvailabilityTrpcRouter } from './trpc/router'

export function initDataAvailabilityModule({
  config,
  logger,
  clock,
  providers,
  db,
}: ModuleDependencies): ApplicationModule | undefined {
  if (!config.da) {
    logger.info('Data availability module disabled')
    return
  }

  logger = logger.tag({
    feature: 'data-availability',
    module: 'data-availability',
  })

  const { targetIndexers, daIndexers, notificationIndexers, liveIndexers } =
    createIndexers(
      config.da,
      config.notifications,
      clock,
      db,
      logger,
      providers,
    )
  const trpcRouter = createDataAvailabilityTrpcRouter({ config: config.da })

  return {
    trpc: {
      namespace: 'dataAvailability',
      trpcRouter,
    },
    start: async () => {
      logger.info('Starting target indexers')
      await Promise.all(
        targetIndexers.map(async (indexer) => {
          logger.info(
            `Starting ${indexer.constructor.name} for ${indexer.daLayer}`,
          )
          await indexer.start()
        }),
      )
      logger.info('Target indexers started')

      logger.info('Starting DA indexers')
      await Promise.all(
        daIndexers.map(async (indexer) => {
          logger.info(
            `Starting ${indexer.constructor.name} for ${indexer.daLayer}`,
          )
          await indexer.start()
        }),
      )
      logger.info('DA indexers started')

      if (notificationIndexers.length > 0) {
        logger.info('Starting notification indexers')
        await Promise.all(
          notificationIndexers.map(async (indexer) => {
            await indexer.start()
          }),
        )
        logger.info('Notification indexers started')
      }

      if (liveIndexers.length > 0) {
        logger.info('Starting live blobs indexers')
        for (const indexer of liveIndexers) {
          await indexer.start()
        }
        logger.info('Live blobs indexers started')
      }
    },
  }
}

function createIndexers(
  config: DataAvailabilityTrackingConfig,
  notifications: NotificationsConfig | false,
  clock: Clock,
  database: Database,
  logger: Logger,
  providers: Providers,
) {
  const daService = new DaService()
  const indexerService = new IndexerService(database)

  const targetIndexers: BlockTargetIndexer[] = []
  const daIndexers: (DaIndexer | BlobIndexer)[] = []
  const notificationIndexers: (HourlyIndexer | EthereumBlobNotifierIndexer)[] =
    []
  const liveIndexers: (LiveBlobsTargetIndexer | LiveBlobsIndexer)[] = []

  for (const daLayer of config.blockLayers) {
    const configurations = config.blockProjects.filter(
      (c) => c.daLayer === daLayer.name,
    )

    const targetIndexer = new BlockTargetIndexer(
      logger,
      clock,
      providers.blockTimestamp,
      daLayer.name,
      {
        onTick: async (targetTimestamp, blockNumber) => {
          await database.syncMetadata.upsertMany(
            uniqBy(configurations, (e) => e.projectId).map((c) => ({
              feature: 'dataAvailability',
              id: c.projectId,
              target: targetTimestamp,
              blockTarget: blockNumber,
            })),
          )
        },
      },
    )
    targetIndexers.push(targetIndexer)

    const blobService = new BlobService(database)
    const blobIndexer = new BlobIndexer(
      {
        daLayer: daLayer.name,
        batchSize: daLayer.batchSize,
        daProvider: providers.da,
        blobService,
        indexerService,
        minHeight: daLayer.startingBlock,
        parents: [targetIndexer],
      },
      logger,
    )
    daIndexers.push(blobIndexer)

    if (notifications && notifications.ethereumBlobs) {
      const hourlyIndexer = new HourlyIndexer(logger, clock)
      notificationIndexers.push(hourlyIndexer)

      const notifierIndexer = new EthereumBlobNotifierIndexer(
        {
          db: database,
          configurations: configurations.filter((c) => c.type === 'ethereum'),
          discordClient: new DiscordClient(
            notifications.ethereumBlobs.discordWebhookUrl,
          ),
          indexerService,
          minHeight: 0,
          parents: [hourlyIndexer],
        },
        logger,
      )
      notificationIndexers.push(notifierIndexer)
    }

    if (config.liveBlobs) {
      liveIndexers.push(
        ...createLiveBlobsIndexers(
          config.liveBlobs,
          configurations,
          database,
          logger,
          providers,
          indexerService,
        ),
      )
    }

    const indexer = new DaIndexer(
      {
        configurations: configurations.map((c) => ({
          id: c.configurationId,
          minHeight: c.sinceBlock,
          maxHeight: c.untilBlock ?? null,
          properties: c,
        })),
        daProvider: providers.da,
        daService: daService,
        daLayer: daLayer.name,
        batchSize: daLayer.batchSize,
        parents: [blobIndexer],
        indexerService,
        db: database,
        blobService,
      },
      logger,
    )

    daIndexers.push(indexer)
  }

  return {
    targetIndexers,
    daIndexers,
    notificationIndexers,
    liveIndexers,
  }
}

function createLiveBlobsIndexers(
  config: LiveBlobsTrackingConfig,
  configurations: BlockDaIndexedConfig[],
  database: Database,
  logger: Logger,
  providers: Providers,
  indexerService: IndexerService,
) {
  const rpc = providers.clients.liveBlobsRpc
  assert(rpc, 'Live blobs RPC client is required')
  assert(providers.liveBlobsDa, 'Live blobs DA provider is required')

  const targetIndexer = new LiveBlobsTargetIndexer(
    { rpc, db: database },
    logger,
  )
  const indexer = new LiveBlobsIndexer(
    {
      db: database,
      daProvider: providers.liveBlobsDa,
      configurations: configurations.filter(isEthereumConfig),
      batchSize: config.batchSize,
      indexerService,
      minHeight: 0,
      parents: [targetIndexer],
    },
    logger,
  )
  return [targetIndexer, indexer]
}

function isEthereumConfig(
  config: BlockDaIndexedConfig,
): config is Extract<BlockDaIndexedConfig, { type: 'ethereum' }> {
  return config.type === 'ethereum'
}
