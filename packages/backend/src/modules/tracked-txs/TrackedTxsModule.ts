import { CoingeckoQueryService } from '@l2beat/shared'
import partition from 'lodash/partition'
import uniqBy from 'lodash/uniqBy'
import { BigQueryClient } from '../../peripherals/bigquery/BigQueryClient'
import { HourlyIndexer } from '../../tools/HourlyIndexer'
import { IndexerService } from '../../tools/uif/IndexerService'
import type { ApplicationModule, ModuleDependencies } from '../types'
import { L2CostsAggregatorIndexer } from './modules/l2-costs/indexers/L2CostsAggregatorIndexer'
import { L2CostsPricesIndexer } from './modules/l2-costs/indexers/L2CostsPricesIndexer'
import { createL2CostsModule } from './modules/l2-costs/L2CostsModule'
import { AnomaliesIndexer } from './modules/liveness/indexers/AnomaliesIndexer'
import { LivenessAggregatingIndexer } from './modules/liveness/indexers/LivenessAggregatingIndexer'
import { createLivenessModule } from './modules/liveness/LivenessModule'
import { TrackedTxsClient } from './TrackedTxsClient'
import { TrackedTxsIndexer } from './TrackedTxsIndexer'

export function createTrackedTxsModule(
  deps: ModuleDependencies,
): ApplicationModule | undefined {
  let { config, logger, peripherals, providers, clock } = deps

  if (!config.trackedTxsConfig) {
    logger.info('TrackedTxsModule disabled')
    return
  }

  logger = logger.tag({ module: 'tracked-txs' })

  const indexerService = new IndexerService(peripherals.database)
  const bigQueryClient = peripherals.getClient(
    BigQueryClient,
    config.trackedTxsConfig.bigQuery,
  )

  const trackedTxsClient = new TrackedTxsClient(bigQueryClient)
  const runtimeConfigurations = config.trackedTxsConfig.projects.flatMap(
    (project) => project.configurations,
  )

  const hourlyIndexer = new HourlyIndexer(logger, clock, {
    onTick: async (targetTimestamp) => {
      const [l2CostsConfigs, livenessConfigs] = partition(
        runtimeConfigurations,
        (c) => c.type === 'l2costs',
      )
      await peripherals.database.syncMetadata.upsertMany([
        // There might be multiple configurations for the same project
        // so we need to uniq them
        ...uniqBy(l2CostsConfigs, (c) => c.projectId).map((c) => ({
          feature: 'l2costs' as const,
          id: c.projectId,
          target: targetTimestamp,
        })),
        ...uniqBy(livenessConfigs, (c) => c.projectId).map((c) => ({
          feature: 'liveness' as const,
          id: c.projectId,
          target: targetTimestamp,
        })),
      ])
    },
  })

  const livenessModule = createLivenessModule(deps)
  const l2costsModule = createL2CostsModule(deps)

  const subModules: (ApplicationModule | undefined)[] = [
    livenessModule,
    l2costsModule,
  ]

  const updaters = [livenessModule?.updater, l2costsModule?.updater].filter(
    (x) => x !== undefined,
  )

  const minTimestamp = config.trackedTxsConfig.minTimestamp

  const trackedTxsIndexer = new TrackedTxsIndexer({
    logger,
    parents: [hourlyIndexer],
    indexerService,
    trackedTxsClient,
    configurations: runtimeConfigurations.map((c) => ({
      properties: c,
      minHeight:
        c.sinceTimestamp < minTimestamp ? minTimestamp : c.sinceTimestamp,
      maxHeight: c.untilTimestamp ?? null,
      id: c.id,
    })),
    updaters,
    db: peripherals.database,
    projects: config.trackedTxsConfig.projects,
  })

  let l2CostPricesIndexer: L2CostsPricesIndexer | undefined
  let l2CostsAggregatorIndexer: L2CostsAggregatorIndexer | undefined

  if (
    config.trackedTxsConfig.uses.l2costs &&
    config.trackedTxsConfig.uses.l2costs.aggregatorEnabled
  ) {
    const coingeckoClient = providers.clients.coingecko
    const coingeckoQueryService = new CoingeckoQueryService(
      coingeckoClient,
      logger.tag({ tag: 'trackedTxs' }),
    )

    l2CostPricesIndexer = new L2CostsPricesIndexer({
      coingeckoQueryService,
      db: peripherals.database,
      parents: [hourlyIndexer],
      indexerService,
      minHeight: config.trackedTxsConfig.minTimestamp,
      logger: logger.tag({ feature: 'costs' }),
    })

    l2CostsAggregatorIndexer = new L2CostsAggregatorIndexer({
      db: peripherals.database,
      parents: [trackedTxsIndexer, l2CostPricesIndexer],
      indexerService,
      minHeight: config.trackedTxsConfig.minTimestamp,
      logger: logger.tag({ feature: 'costs' }),
      projects: config.trackedTxsConfig.projects,
    })
  }

  let livenessAggregatingIndexer: LivenessAggregatingIndexer | undefined
  let anomaliesIndexer: AnomaliesIndexer | undefined

  if (config.trackedTxsConfig.uses.liveness) {
    livenessAggregatingIndexer = new LivenessAggregatingIndexer({
      db: peripherals.database,
      projects: config.trackedTxsConfig.projects,
      parents: [trackedTxsIndexer],
      indexerService,
      minHeight: config.trackedTxsConfig.minTimestamp,
      logger: logger.tag({ feature: 'liveness' }),
    })

    anomaliesIndexer = new AnomaliesIndexer({
      db: peripherals.database,
      projects: config.trackedTxsConfig.projects,
      parents: [trackedTxsIndexer],
      indexerService,
      minHeight: config.trackedTxsConfig.minTimestamp,
      logger: logger.tag({ feature: 'liveness' }),
    })
  }

  const start = async () => {
    logger = logger.for('TrackedTxsModule')
    logger.info('Starting...')

    await hourlyIndexer.start()
    for (const subModule of subModules) {
      await subModule?.start?.()
    }
    await trackedTxsIndexer.start()
    await l2CostPricesIndexer?.start()
    await l2CostsAggregatorIndexer?.start()
    await livenessAggregatingIndexer?.start()
    await anomaliesIndexer?.start()
  }

  return {
    start,
  }
}
