import type { Logger } from '@l2beat/backend-tools'
import { EthRpcClient, Http, HttpClient } from '@l2beat/shared'
import type { LongChainName } from '@l2beat/shared-pure'
import { getTokenDbClient } from '@l2beat/token-backend'
import type { ChainApi } from '../../../config/chain/ChainApi'
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
import { InteropMatchingLoop } from './match/InteropMatchingLoop'
import { InteropEventSyncer } from './sync/InteropEventSyncer'
import { InteropSyncModes } from './sync/InteropPluginSyncModes'
import { isPluginResyncable } from './sync/isPluginResyncable'

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
  const syncModes = new InteropSyncModes()

  const processors = []
  if (config.interop.capture.enabled) {
    for (const chain of config.interop.capture.chains) {
      const processor = new InteropBlockProcessor(
        chain.name,
        plugins.eventPlugins,
        eventStore,
        syncModes,
        db,
        logger,
      )
      // blockProcessors.push(processor) // TODO: AA debug
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

  const eventSyncers: InteropEventSyncer[] = []
  for (const plugin of plugins.eventPlugins) {
    if (!isPluginResyncable(plugin)) {
      continue
    }
    for (const chain of config.interop.capture.chains) {
      const chainName = chain.name as LongChainName
      const chainConfig = config.chainConfig.find((c) => c.name === chainName)
      if (!chainConfig) {
        throw new Error(`Missing configuration for chain ${chainName}`)
      }
      const eventSyncer = new InteropEventSyncer(
        chainName,
        plugin,
        getRpcClient(chainConfig, logger),
        syncModes.getForPlugin(plugin.name),
        eventStore,
        db,
        logger,
      )
      eventSyncers.push(eventSyncer)
    }
  }

  const router = createInteropRouter(
    db,
    config.interop,
    processors,
    syncModes,
    logger.for('InteropRouter'),
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

  const tokenDbClient = getTokenDbClient({
    apiUrl: config.interop.financials.tokenDbApiUrl,
    authToken: config.interop.financials.tokenDbAuthToken,
    callSource: 'interop',
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
    config.interop.capture.chains.map((c) => c.name),
    relayApiClient,
    db,
    eventStore,
    relayRootIndexer,
    indexerService,
    logger,
  )

  const start = async () => {
    logger = logger.for('InteropModule')
    logger.info('Starting')

    await eventStore.start()

    if (config.interop && config.interop.matching) {
      matcher.start()
      // TODO: AA debug
      // await relayRootIndexer.start()
      // await relayIndexer.start()
    }
    if (config.interop && config.interop.compare.enabled) {
      for (const compareLoop of compareLoops) {
        // compareLoop.start()
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

    if (config.interop && config.interop.capture.chains) {
      for (const eventSyncer of eventSyncers) {
        eventSyncer.start()
      }
    }
  }

  return { routers: [router], start }
}

const INTEROP_RPC_CLIENTS: { [chain: string]: EthRpcClient } = {}

function getRpcClient(chainConfig: ChainApi, logger: Logger) {
  let client = INTEROP_RPC_CLIENTS[chainConfig.name]
  if (!client) {
    const rpcConfig = chainConfig.blockApis.find((a) => a.type === 'rpc')
    if (!rpcConfig || rpcConfig.type !== 'rpc') {
      throw new Error(`Missing RPC config for chain ${chainConfig.name}`)
    }

    const rpcLogger = logger
      .for(EthRpcClient.name)
      .tag({ source: chainConfig.name })

    const http = new Http({
      logger: rpcLogger,
      maxCallsPerMinute: 120, // rpcConfig.callsPerMinute
    })

    client = new EthRpcClient(
      http,
      rpcConfig.url,
      `${EthRpcClient.name}:${chainConfig.name}`,
    )
    INTEROP_RPC_CLIENTS[chainConfig.name] = client
  }
  return client
}
