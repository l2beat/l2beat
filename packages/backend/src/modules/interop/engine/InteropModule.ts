import { HttpClient } from '@l2beat/shared'
import type { LongChainName } from '@l2beat/shared-pure'
import { getTokenDbClient } from '@l2beat/token-backend'
import { HourlyIndexer } from '../../../tools/HourlyIndexer'
import { IndexerService } from '../../../tools/uif/IndexerService'
import type { ApplicationModule, ModuleDependencies } from '../../types'
import {
  createInteropPlugins,
  flattenClusters,
  pluginsAsClusters,
} from '../plugins'
import { RelayApiClient } from '../plugins/relay/RelayApiClient'
import { RelayIndexer, RelayRootIndexer } from '../plugins/relay/relay.indexer'
import { InteropAggregatingIndexer } from './aggregation/InteropAggregatingIndexer'
import { InteropBlockProcessor } from './capture/InteropBlockProcessor'
import { InteropEventStore } from './capture/InteropEventStore'
import { InteropCleanerLoop } from './cleaner/InteropCleanerLoop'
import { InteropCompareLoop } from './compare/InteropCompareLoop'
import { InteropConfigStore } from './config/InteropConfigStore'
import { createInteropRouter } from './dashboard/InteropRouter'
import { InteropFinancialsLoop } from './financials/InteropFinancialsLoop'
import { InteropRecentPricesIndexer } from './financials/InteropRecentPricesIndexer'
import { InteropMatchingLoop } from './match/InteropMatchingLoop'
import { InteropTransferStream } from './stream/InteropTransferStream'
import { InteropSyncersManager } from './sync/InteropSyncersManager'

export function createInteropModule({
  config,
  db,
  logger,
  blockProcessors,
  clock,
  providers,
}: ModuleDependencies): ApplicationModule | undefined {
  if (!config.interop) {
    logger.info('Interop module disabled')
    return
  }
  logger = logger.tag({ feature: 'interop', module: 'interop' })

  const eventStore = new InteropEventStore(db, config.interop.inMemoryEventCap)
  const configStore = new InteropConfigStore(db)
  const tokenDbClient = getTokenDbClient({
    apiUrl: config.interop.financials.tokenDbApiUrl,
    authToken: config.interop.financials.tokenDbAuthToken,
    callSource: 'interop',
  })
  const plugins = createInteropPlugins({
    configs: configStore,
    chains: config.interop.config.chains,
    httpClient: new HttpClient(),
    logger,
    rpcClients: providers.clients.rpcClients,
    tokenDbClient,
  })

  const syncersManager = new InteropSyncersManager(
    pluginsAsClusters(plugins.eventPlugins),
    config.interop.capture.chains.map((c) => c.id as LongChainName),
    config.chainConfig,
    eventStore,
    db,
    logger,
  )

  const transferStream = new InteropTransferStream()

  const processors = []
  if (config.interop.capture.enabled) {
    for (const chain of config.interop.capture.chains) {
      const processor = new InteropBlockProcessor(
        chain.id,
        flattenClusters(plugins.eventPlugins),
        eventStore,
        logger,
      )
      blockProcessors.push(processor)
      blockProcessors.push(
        syncersManager.getBlockProcessor(chain.id as LongChainName),
      )
      processors.push(processor)
    }
  }

  const matcher = new InteropMatchingLoop(
    eventStore,
    db,
    flattenClusters(plugins.eventPlugins),
    config.interop.capture.chains.map((c) => c.id),
    logger,
    transferStream,
  )

  const router = createInteropRouter(
    db,
    config.interop,
    processors,
    syncersManager,
    logger.for('InteropRouter'),
    transferStream,
  )

  const compareLoops = plugins.comparePlugins.map(
    (c) => new InteropCompareLoop(db, c, logger),
  )

  const indexerService = new IndexerService(db)
  const cleaner = new InteropCleanerLoop(eventStore, db, logger)

  const hourlyIndexer = new HourlyIndexer(logger, clock)
  const recentPricesIndexer = new InteropRecentPricesIndexer({
    db,
    priceProvider: providers.price,
    logger,
    parents: [hourlyIndexer],
    minHeight: 1,
    indexerService,
  })

  const financialsService = new InteropFinancialsLoop(
    config.interop.capture.chains,
    db,
    tokenDbClient,
    logger,
  )

  const relayApiClient = new RelayApiClient(new HttpClient())
  const relayRootIndexer = new RelayRootIndexer(logger)
  const relayIndexer = new RelayIndexer(
    config.interop.config.chains,
    config.interop.capture.chains.map((c) => c.id),
    relayApiClient,
    db,
    eventStore,
    relayRootIndexer,
    indexerService,
    logger,
  )

  let interopAggregatingIndexer: InteropAggregatingIndexer | undefined
  if (config.interop.aggregation) {
    interopAggregatingIndexer = new InteropAggregatingIndexer({
      db,
      configs: config.interop.aggregation.configs,
      logger,
      indexerService,
      parents: [hourlyIndexer],
      minHeight: 1,
    })
  }

  const start = async () => {
    logger = logger.for('InteropModule')
    logger.info('Starting')

    await eventStore.start()

    if (config.interop && config.interop.matching) {
      matcher.start()
      await relayRootIndexer.start()
      await relayIndexer.start()
    }
    if (config.interop && config.interop.compare.enabled) {
      for (const compareLoop of compareLoops) {
        compareLoop.start()
      }
    }
    if (config.interop && config.interop.cleaner) {
      cleaner.start()
    }
    await hourlyIndexer.start()
    if (config.interop && config.interop.aggregation) {
      await interopAggregatingIndexer?.start()
    }
    if (config.interop && config.interop.financials.enabled) {
      await recentPricesIndexer.start()
      financialsService.start()
    }
    if (config.interop && config.interop.config.enabled) {
      await configStore.start()
      for (const configLoop of plugins.configPlugins) {
        configLoop.start()
      }
    }
    logger.info('Started', {
      comparePlugins: plugins.comparePlugins.length,
      configPlugins: plugins.configPlugins.length,
      eventPlugins: flattenClusters(plugins.eventPlugins).length,
    })

    if (config.interop && config.interop.capture.enabled) {
      syncersManager.start()
    }
  }

  return { routers: [router], start }
}
