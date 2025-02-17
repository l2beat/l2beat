import type { Logger } from '@l2beat/backend-tools'
import type {
  AvailDaTrackingConfig,
  CelestiaDaTrackingConfig,
  EthereumDaTrackingConfig,
  ProjectDaTrackingConfig,
} from '@l2beat/config'
import type { Database } from '@l2beat/database'
import { assert, ProjectId } from '@l2beat/shared-pure'
import type { Config } from '../../config'
import type { Peripherals } from '../../peripherals/Peripherals'
import type { Providers } from '../../providers/Providers'
import type { Clock } from '../../tools/Clock'
import { IndexerService } from '../../tools/uif/IndexerService'
import type { ApplicationModule } from '../ApplicationModule'
import { BlockTargetIndexer } from './indexers/BlockTargetIndexer'
import { DaIndexer } from './indexers/DaIndexer'
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

  const blockProviders = providers.block
  const daProviders = providers.getDaProviders()
  const indexerService = new IndexerService(database)

  const targetIndexers: BlockTargetIndexer[] = []
  const daIndexers: DaIndexer[] = []

  // const daLayers = new Set(config.da.projects.map((p) => p.config.daLayer))

  for (const daLayer of config.da.layers) {
    const blockTimestampProvider = blockProviders.getBlockTimestampProvider(
      daLayer.name,
    )

    const targetIndexer = new BlockTargetIndexer(
      logger,
      clock,
      blockTimestampProvider,
      daLayer.name,
    )

    targetIndexers.push(targetIndexer)

    const daProvider = daProviders.getProvider(daLayer.name)

    const projectConfigurations = config.da.projects
      .filter((c) => c.config.daLayer === daLayer.name)
      .map((c) => ({
        ...c,
        type: c.config.type as '' | 'celestia' | 'avail',
      })) as (
      | {
          configurationId: string
          type: 'ethereum'
          projectId: ProjectId
          config: EthereumDaTrackingConfig | { type: 'baseLayer' }
        }
      | {
          configurationId: string
          type: 'celestia'
          projectId: ProjectId
          config: CelestiaDaTrackingConfig | { type: 'baseLayer' }
        }
      | {
          configurationId: string
          type: 'avail'
          projectId: ProjectId
          config: AvailDaTrackingConfig | { type: 'baseLayer' }
        }
    )[]

    const base = {
      configurationId: 'TODO',
      type: daLayer.type as 'ethereum' | 'celestia' | 'avail',
      projectId: ProjectId(daLayer.name),
      config: { type: 'baseLayer' as const },
    }

    const configurations = [...projectConfigurations, base]

    let daService: DaService | undefined

    if (daLayer.type === 'ethereum') {
      if (!isEthereumConfigurations(configurations)) {
        throw new Error('Expected all configurations to be ethereum type')
      }
      daService = new DaService(configurations)
    }

    assert(daService)

    const indexer = new DaIndexer({
      configurations: configurations.map((c) => ({
        id: c.configurationId,
        minHeight: daLayer.startingBlockNumber,
        maxHeight: null,
        properties: {
          project: c.projectId,
          ...c.config,
        },
      })),
      daProvider,
      daService,
      logger,
      daLayer: daLayer.name,
      batchSize: daLayer.batchSize,
      parents: [targetIndexer],
      indexerService,
      db: database,
      serializeConfiguration: (
        value: ProjectDaTrackingConfig | { type: 'baseLayer' },
      ) => JSON.stringify(value),
      configurationsTrimmingDisabled: true,
    })
    daIndexers.push(indexer)
  }

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
    },
  }
}

function isEthereumConfigurations(
  configurations: (
    | {
        configurationId: string
        type: 'ethereum'
        projectId: ProjectId
        config: EthereumDaTrackingConfig | { type: 'baseLayer' }
      }
    | {
        configurationId: string
        type: 'celestia'
        projectId: ProjectId
        config: CelestiaDaTrackingConfig | { type: 'baseLayer' }
      }
    | {
        configurationId: string
        type: 'avail'
        projectId: ProjectId
        config: AvailDaTrackingConfig | { type: 'baseLayer' }
      }
  )[],
): configurations is {
  configurationId: string
  type: 'ethereum'
  projectId: ProjectId
  config: EthereumDaTrackingConfig | { type: 'baseLayer' }
}[] {
  return configurations.every((c) => c.type === 'ethereum')
}
