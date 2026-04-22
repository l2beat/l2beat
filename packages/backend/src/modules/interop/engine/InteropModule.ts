import { HttpClient, InteropTransferClassifier } from '@l2beat/shared'
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
import { isPluginResyncable } from '../plugins/types'
import { InteropAggregatingIndexer } from './aggregation/InteropAggregatingIndexer'
import { DefaultInteropAggregationAnalyzer } from './aggregation/InteropAggregationAnalyzer'
import { InteropAggregationService } from './aggregation/InteropAggregationService'
import { InteropEventStore } from './capture/InteropEventStore'
import { InteropConfigStore } from './config/InteropConfigStore'
import type { InteropNotifier } from './notifications/InteropNotifier'
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

  const configStore = new InteropConfigStore(db)

  let notificationClient: InteropNotifier | undefined

  const tokenDbClient = getTokenDbClient({
    apiUrl: config.interop.financials.tokenDbApiUrl,
    authToken: config.interop.financials.tokenDbAuthToken,
    callSource: 'interop',
  })
  const plugins = createInteropPlugins({
    configs: configStore,
    chains: config.interop.config.chains,
    oneSidedChains: config.interop.oneSidedChains,
    httpClient: new HttpClient(),
    logger,
    rpcClients: providers.clients.rpcClients,
    tokenDbClient,
    configIntervalMs: config.interop.config.configIntervalMs,
  })
  const eventPlugins = flattenClusters(plugins.eventPlugins)
  const eventStore = new InteropEventStore(
    db,
    config.interop.inMemoryEventCap,
    eventPlugins.filter(isPluginResyncable),
  )

  let interopAggregatingIndexer: InteropAggregatingIndexer | undefined

  const syncersManager = new InteropSyncersManager(
    pluginsAsClusters(plugins.eventPlugins),
    config.interop.capture.chains.map((c) => c.id as LongChainName),
    config.chainConfig,
    eventStore,
    db,
    logger,
  )

  const indexerService = new IndexerService(db)

  const hourlyIndexer = new HourlyIndexer(logger, clock)

  if (config.interop.aggregation) {
    const classifier = new InteropTransferClassifier()
    const aggregationService = new InteropAggregationService(classifier)
    const aggregationAnalyzer = new DefaultInteropAggregationAnalyzer(db)
    interopAggregatingIndexer = new InteropAggregatingIndexer(
      {
        db,
        configs: config.interop.aggregation.configs,
        aggregationService,
        aggregationAnalyzer,
        indexerService,
        notifier: notificationClient,
        parents: [hourlyIndexer],
        minHeight: 1,
        syncersManager,
      },
      logger,
    )
  }

  const start = async () => {
    logger = logger.for('InteropModule')
    logger.info('Starting')

    await hourlyIndexer.start()
    if (config.interop && config.interop.aggregation) {
      await interopAggregatingIndexer?.start()
    }

    logger.info('Started', {
      comparePlugins: plugins.comparePlugins.length,
      configPlugins: plugins.configPlugins.length,
      eventPlugins: eventPlugins.length,
    })
  }

  return { routers: [], start }
}
