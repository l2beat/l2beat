import { HourlyIndexer } from '../../tools/HourlyIndexer'
import { IndexerService } from '../../tools/uif/IndexerService'
import type { ApplicationModule, ModuleDependencies } from '../types'
import { BridgeBlockProcessor } from './BridgeBlockProcessor'
import { BridgeCleaner } from './BridgeCleaner'
import { BridgeComparator } from './BridgeComparator'
import { BridgeMatcher } from './BridgeMatcher'
import { createBridgeRouter } from './BridgeRouter'
import { BridgeStore } from './BridgeStore'
import { createBridgeComparePlugins } from './compare'
import { FinancialsService } from './FinancialsService'
import { InteropRecentPricesIndexer } from './InteropRecentPricesIndexer'
import { createBridgePlugins } from './plugins'
import { MockTokenDb } from './TokenDb'

export function createBridgeModule({
  config,
  db,
  logger,
  blockProcessors,
  clock,
  providers,
}: ModuleDependencies): ApplicationModule | undefined {
  if (!config.bridges) {
    logger.info('Bridges module disabled')
    return
  }
  logger = logger.tag({ feature: 'bridges', module: 'bridges' })

  const plugins = createBridgePlugins()
  const bridgeStore = new BridgeStore(db)

  const processors = []
  if (config.bridges.capture.enabled) {
    for (const chain of config.bridges.capture.chains) {
      const processor = new BridgeBlockProcessor(
        chain.name,
        plugins,
        bridgeStore,
        logger,
      )
      blockProcessors.push(processor)
      processors.push(processor)
    }
  }

  const bridgeMatcher = new BridgeMatcher(
    bridgeStore,
    db,
    plugins,
    config.bridges.capture.chains.map((c) => c.name),
    logger,
  )

  const bridgeRouter = createBridgeRouter(db, config.bridges, processors)

  const comparePlugins = createBridgeComparePlugins()

  const bridgeComparator = new BridgeComparator(
    db,
    comparePlugins,
    logger,
    config.bridges.compare.intervalMs,
  )

  const bridgeCleaner = new BridgeCleaner(bridgeStore, db, logger)

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
    config.bridges.capture.chains,
    db,
    tokenDb,
    logger,
  )

  const start = async () => {
    logger = logger.for('BridgeModule')
    logger.info('Starting')
    if (config.bridges && config.bridges.matching) {
      await bridgeStore.start()
      bridgeMatcher.start()
    }
    if (config.bridges && config.bridges.compare.enabled) {
      bridgeComparator.start()
    }
    if (config.bridges && config.bridges.cleaner) {
      bridgeCleaner.start()
    }
    if (config.bridges && config.bridges.financials.enabled) {
      await hourlyIndexer.start()
      await recentPricesIndexer.start()
      financialsService.start()
    }
    logger.info('Started', {
      plugins: plugins.length,
    })
  }

  return { routers: [bridgeRouter], start }
}
