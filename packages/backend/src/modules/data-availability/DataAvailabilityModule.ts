import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { assert } from '@l2beat/shared-pure'
import partition from 'lodash/partition'
import type { Config } from '../../config'
import type { DataAvailabilityTrackingConfig } from '../../config/Config'
import type { Peripherals } from '../../peripherals/Peripherals'
import type { Providers } from '../../providers/Providers'
import type { Clock } from '../../tools/Clock'
import { HourlyIndexer } from '../../tools/HourlyIndexer'
import { IndexerService } from '../../tools/uif/IndexerService'
import type { ApplicationModule } from '../ApplicationModule'
import { BlobIndexer } from './indexers/BlobIndexer'
import { BlockTargetIndexer } from './indexers/BlockTargetIndexer'
import { DaIndexer } from './indexers/DaIndexer'
import { EigenDaLayerIndexer } from './indexers/eigen-da/EigenDaLayerIndexer'
import { EigenDaProjectsIndexer } from './indexers/eigen-da/EigenDaProjectsIndexer'
import { BlobService } from './services/BlobService'
import { DaService } from './services/DaService'

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

  const { targetIndexers, daIndexers, eigenIndexers, hourlyIndexer } =
    createIndexers(config.da, clock, database, logger, providers)

  return {
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

      if (eigenIndexers.length > 0) {
        logger.info('Starting EigenDA indexer')
        await hourlyIndexer.start()
        await Promise.all(
          eigenIndexers.map(async (indexer) => {
            logger.info(
              `Starting ${indexer.constructor.name} for ${indexer.daLayer}`,
            )
            await indexer.start()
          }),
        )
        logger.info('EigenDA indexer started')
      }
    },
  }
}

function createIndexers(
  config: DataAvailabilityTrackingConfig,
  clock: Clock,
  database: Database,
  logger: Logger,
  providers: Providers,
) {
  const daService = new DaService()
  const indexerService = new IndexerService(database)

  const targetIndexers: BlockTargetIndexer[] = []
  const daIndexers: (DaIndexer | BlobIndexer)[] = []
  const hourlyIndexer = new HourlyIndexer(logger, clock)
  const eigenIndexers: (EigenDaLayerIndexer | EigenDaProjectsIndexer)[] = []

  for (const daLayer of config.blockLayers) {
    const targetIndexer = new BlockTargetIndexer(
      logger,
      clock,
      providers.blockTimestamp,
      daLayer.name,
    )
    targetIndexers.push(targetIndexer)

    const configurations = config.blockProjects.filter(
      (c) => c.daLayer === daLayer.name,
    )

    let blobService: BlobService | undefined = undefined
    let blobIndexer: BlobIndexer | undefined = undefined

    if (daLayer.type === 'ethereum') {
      blobService = new BlobService(database)
      blobIndexer = new BlobIndexer({
        daLayer: daLayer.name,
        batchSize: daLayer.batchSize,
        daProvider: providers.da,
        blobService,
        logger,
        indexerService,
        minHeight: daLayer.startingBlock,
        parents: [targetIndexer],
      })
      daIndexers.push(blobIndexer)
    }

    const indexer = new DaIndexer({
      configurations: configurations.map((c) => ({
        id: c.configurationId,
        minHeight: c.sinceBlock,
        maxHeight: c.untilBlock ?? null,
        properties: c,
      })),
      daProvider: providers.da,
      daService: daService,
      logger,
      daLayer: daLayer.name,
      batchSize: daLayer.batchSize,
      parents: [blobIndexer ?? targetIndexer],
      indexerService,
      db: database,
      blobService,
    })

    daIndexers.push(indexer)
  }

  for (const daLayer of config.timestampLayers) {
    if (daLayer.type !== 'eigen-da') {
      continue
    }

    const configurations = config.timestampProjects.filter(
      (c) => c.daLayer === daLayer.name,
    )
    const [daLayerConfigurations, projectConfigurations] = partition(
      configurations,
      (c) => c.projectId === 'eigenda',
    )

    const eigenClient = providers.clients.eigen
    assert(eigenClient, 'Eigen client is required')

    const layerIndexer = new EigenDaLayerIndexer({
      configurations: daLayerConfigurations.map((c) => ({
        id: c.configurationId,
        minHeight: c.sinceTimestamp,
        maxHeight: c.untilTimestamp ?? null,
        properties: c,
      })),
      eigenClient,
      logger,
      daLayer: daLayer.name,
      parents: [hourlyIndexer],
      indexerService,
      db: database,
    })
    eigenIndexers.push(layerIndexer)

    const projectsIndexer = new EigenDaProjectsIndexer({
      configurations: projectConfigurations.map((c) => ({
        id: c.configurationId,
        minHeight: c.sinceTimestamp,
        maxHeight: c.untilTimestamp ?? null,
        properties: c,
      })),
      eigenClient,
      logger,
      daLayer: daLayer.name,
      parents: [hourlyIndexer],
      indexerService,
      db: database,
    })
    eigenIndexers.push(projectsIndexer)
  }

  return { targetIndexers, daIndexers, eigenIndexers, hourlyIndexer }
}
