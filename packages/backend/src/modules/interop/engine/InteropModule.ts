import type { Database } from '@l2beat/database'
import { HttpClient } from '@l2beat/shared'
import type { ApplicationModule, ModuleDependencies } from '../../types'
import { createInteropPlugins } from '../plugins'
import { InteropBlockProcessor } from './capture/InteropBlockProcessor'
import { InteropEventStore } from './capture/InteropEventStore'
import { InteropCompareLoop } from './compare/InteropCompareLoop'
import { InteropConfigStore } from './config/InteropConfigStore'
import { createInteropRouter } from './dashboard/InteropRouter'
import { InteropMatchingLoop } from './match/InteropMatchingLoop'
import { InteropPluginSyncer } from './sync/InteropPluginSyncer'

// const MODE: 'match' | 'sync' = 'match'
const MODE: 'match' | 'sync' = 'sync'

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
      // blockProcessors.push(processor)
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

  const pluginSyncer = new InteropPluginSyncer(
    config.interop.capture.chains,
    config.chainConfig,
    plugins.eventPlugins,
    eventStore,
    db,
    logger,
  )

  const router = createInteropRouter(
    db,
    config.interop,
    processors,
    logger.for('InteropRouter'),
  )

  const compareLoops = plugins.comparePlugins.map(
    (c) => new InteropCompareLoop(db, c, logger),
  )

  // const indexerService = new IndexerService(db)
  // const cleaner = new InteropCleanerLoop(eventStore, db, logger)

  // const hourlyIndexer = new HourlyIndexer(logger, clock)
  // const recentPricesIndexer = new InteropRecentPricesIndexer({
  //   db,
  //   priceProvider: providers.price,
  //   logger,
  //   parents: [hourlyIndexer],
  //   minHeight: 1,
  //   indexerService,
  // })

  // const tokenDbClient = getTokenDbClient({
  //   apiUrl: config.interop.financials.tokenDbApiUrl,
  //   authToken: config.interop.financials.tokenDbAuthToken,
  //   callSource: 'interop',
  // })

  // const financialsService = new InteropFinancialsLoop(
  //   config.interop.capture.chains,
  //   db,
  //   tokenDbClient,
  //   logger,
  // )

  // const relayApiClient = new RelayApiClient(new HttpClient())
  // const relayRootIndexer = new RelayRootIndexer(logger)
  // const relayIndexer = new RelayIndexer(
  //   config.interop.config.chains,
  //   config.interop.capture.chains.map((c) => c.name),
  //   relayApiClient,
  //   db,
  //   eventStore,
  //   relayRootIndexer,
  //   indexerService,
  //   logger,
  // )

  const start = async () => {
    logger = logger.for('InteropModule')
    logger.info('Starting')

    await clearDb(db)

    await eventStore.start()

    if (config.interop && config.interop.matching) {
      // matcher.start()
      // await relayRootIndexer.start()
      // await relayIndexer.start()
    }
    if (config.interop && config.interop.compare.enabled) {
      // for (const compareLoop of compareLoops) {
      //   compareLoop.start()
      // }
    }
    if (config.interop && config.interop.cleaner) {
      // cleaner.start()
    }
    if (config.interop && config.interop.financials.enabled) {
      // await hourlyIndexer.start()
      // await recentPricesIndexer.start()
      // financialsService.start()
    }
    if (config.interop && config.interop.config.enabled) {
      await configStore.start()
      // for (const configLoop of plugins.configPlugins) {
      //   configLoop.start()
      // }
    }
    logger.info('Started', {
      comparePlugins: plugins.comparePlugins.length,
      configPlugins: plugins.configPlugins.length,
      eventPlugins: plugins.eventPlugins.length,
    })

    await matcher.run()
    if (MODE === 'match') return
    await pluginSyncer.start()
    await matcher.run()
  }

  return { routers: [router], start }
}

async function clearDb(db: Database) {
  if (MODE === 'match') return
  await db.interopEvent.deleteAll()
  await db.interopTransfer.deleteAll()
  await db.interopMessage.deleteAll()
}
