import { HttpClient } from '@l2beat/shared'
import { HourlyIndexer } from '../../tools/HourlyIndexer'
import { IndexerService } from '../../tools/uif/IndexerService'
import type { ApplicationModule, ModuleDependencies } from '../types'
import { createInteropRouter } from './dashboard/InteropRouter'
import { InteropFinancialsLoop } from './financials/InteropFinancialsLoop'
import { InteropRecentPricesIndexer } from './financials/InteropRecentPricesIndexer'
import { MockTokenDb } from './financials/TokenDb'
import { InteropBlockProcessor } from './InteropBlockProcessor'
import { InteropCleanerLoop } from './InteropCleanerLoop'
import { InteropCompareLoop } from './InteropCompareLoop'
import { InteropConfigStore } from './InteropConfigStore'
import { InteropEventStore } from './InteropEventStore'
import { InteropMatchingLoo } from './InteropMatchingLoop'
import { createInteropPlugins } from './plugins'

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

  const interopStore = new InteropEventStore(db)

  const configs = new InteropConfigStore(db)
  const plugins = createInteropPlugins({
    configs,
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
        interopStore,
        logger,
      )
      blockProcessors.push(processor)
      processors.push(processor)
    }
  }

  const matcher = new InteropMatchingLoo(
    interopStore,
    db,
    plugins.eventPlugins,
    config.interop.capture.chains.map((c) => c.name),
    logger,
  )

  const router = createInteropRouter(db, config.interop, processors)

  const comparator = new InteropCompareLoop(
    db,
    plugins.comparePlugins,
    logger,
    config.interop.compare.intervalMs,
  )

  const cleaner = new InteropCleanerLoop(interopStore, db, logger)

  const hourlyIndexer = new HourlyIndexer(logger, clock)
  const recentPricesIndexer = new InteropRecentPricesIndexer({
    db,
    priceProvider: providers.price,
    logger,
    parents: [hourlyIndexer],
    minHeight: 1,
    indexerService: new IndexerService(db),
  })
  const tokenDb = new MockTokenDb()
  const financialsService = new InteropFinancialsLoop(
    config.interop.capture.chains,
    db,
    tokenDb,
    logger,
  )

  const start = async () => {
    logger = logger.for('InteropModule')
    logger.info('Starting')
    if (config.interop && config.interop.matching) {
      await interopStore.start()
      matcher.start()
    }
    if (config.interop && config.interop.compare.enabled) {
      comparator.start()
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
      for (const plugin of plugins.configPlugins) {
        plugin.start()
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
