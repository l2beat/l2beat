import { assert } from '@l2beat/shared-pure'
import { HourlyIndexer } from '../../tools/HourlyIndexer'
import { IndexerService } from '../../tools/uif/IndexerService'
import type { ApplicationModule, ModuleDependencies } from '../types'
import { createInteropComparePlugins } from './compare'
import { FinancialsService } from './FinancialsService'
import { InteropBlockProcessor } from './InteropBlockProcessor'
import { InteropCleaner } from './InteropCleaner'
import { InteropComparator } from './InteropComparator'
import { InteropMatcher } from './InteropMatcher'
import { InteropNetworksUpdater } from './InteropNetworksUpdater'
import { InteropRecentPricesIndexer } from './InteropRecentPricesIndexer'
import { createInteropRouter } from './InteropRouter'
import { InteropStore } from './InteropStore'
import { createInteropNetworksPlugins } from './networks'
import { createInteropPlugins } from './plugins'
import { MockTokenDb } from './TokenDb'

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

  const interopStore = new InteropStore(db)
  const plugins = createInteropPlugins(interopStore)

  const ethereumRpc = providers.clients.rpcClients.find(
    (c) => c.chain === 'ethereum',
  )
  assert(ethereumRpc)
  const configPlugins = createInteropNetworksPlugins(
    config.interop.config.chains,
    logger,
    ethereumRpc,
  )

  const configExtractor = new InteropNetworksUpdater(
    interopStore,
    configPlugins,
    logger,
  )

  const processors = []
  if (config.interop.capture.enabled) {
    for (const chain of config.interop.capture.chains) {
      const processor = new InteropBlockProcessor(
        chain.name,
        plugins,
        interopStore,
        logger,
      )
      blockProcessors.push(processor)
      processors.push(processor)
    }
  }

  const matcher = new InteropMatcher(
    interopStore,
    db,
    plugins,
    config.interop.capture.chains.map((c) => c.name),
    logger,
  )

  const router = createInteropRouter(db, config.interop, processors)

  const comparePlugins = createInteropComparePlugins()

  const comparator = new InteropComparator(
    db,
    comparePlugins,
    logger,
    config.interop.compare.intervalMs,
  )

  const cleaner = new InteropCleaner(interopStore, db, logger)

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
  const financialsService = new FinancialsService(
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
      configExtractor.start()
    }
    logger.info('Started', {
      plugins: plugins.length,
    })
  }

  return { routers: [router], start }
}
