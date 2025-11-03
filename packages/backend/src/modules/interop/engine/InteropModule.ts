import { HttpClient } from '@l2beat/shared'
import { HourlyIndexer } from '../../../tools/HourlyIndexer'
import { IndexerService } from '../../../tools/uif/IndexerService'
import type { ApplicationModule, ModuleDependencies } from '../../types'
import { createInteropPlugins } from '../plugins'
import { RelayApiClient } from '../plugins/relay/RelayApiClient'
import { RelayIndexer, RelayRootIndexer } from '../plugins/relay/relay.indexer'
import { InteropBlockProcessor } from './capture/InteropBlockProcessor'
import { InteropEventStore } from './capture/InteropEventStore'
import { InteropCleanerLoop } from './cleaner/InteropCleanerLoop'
import { InteropCompareLoop } from './compare/InteropCompareLoop'
import { InteropConfigStore } from './config/InteropConfigStore'
import { createInteropRouter } from './dashboard/InteropRouter'
import { InteropFinancialsLoop } from './financials/InteropFinancialsLoop'
import { InteropRecentPricesIndexer } from './financials/InteropRecentPricesIndexer'
import { MockTokenDb } from './financials/TokenDb'
import { InteropMatchingLoop } from './match/InteropMatchingLoop'

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

  const eventStore = new InteropEventStore(db)
  const configStore = new InteropConfigStore(db)
  const plugins = createInteropPlugins({
    configs: configStore,
    chains: config.interop.config.chains,
    httpClient: new HttpClient(),
    logger,
    rpcClients: providers.clients.rpcClients,
  })

  const processors = []
  if (config.interop.capture.enabled) {
    for (const chain of config.interop.capture.chains) {
      const processor = new InteropBlockProcessor(
        chain.name,
        plugins.eventPlugins,
        eventStore,
        logger,
      )
      blockProcessors.push(processor)
      processors.push(processor)
    }
  }

  const matcher = new InteropMatchingLoop(
    eventStore,
    db,
    plugins.eventPlugins,
    config.interop.capture.chains.map((c) => c.name),
    logger,
  )

  const router = createInteropRouter(db, config.interop, processors)

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
  const tokenDb = new MockTokenDb()
  const financialsService = new InteropFinancialsLoop(
    config.interop.capture.chains,
    db,
    tokenDb,
    logger,
  )

  const relayApiClient = new RelayApiClient(new HttpClient())
  const relayRootIndexer = new RelayRootIndexer(logger)
  const relayIndexer = new RelayIndexer(
    config.interop.config.chains,
    config.interop.capture.chains.map((c) => c.name),
    relayApiClient,
    eventStore,
    relayRootIndexer,
    indexerService,
    logger,
  )

  const start = async () => {
    logger = logger.for('InteropModule')
    logger.info('Starting')
    if (config.interop && config.interop.matching) {
      await eventStore.start()
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
    if (config.interop && config.interop.financials.enabled) {
      await hourlyIndexer.start()
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
      eventPlugins: plugins.eventPlugins.length,
    })
  }

  return { routers: [router], start }
}
