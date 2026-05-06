import { Env, getEnv } from '@l2beat/backend-tools'
import type { Indexer } from '@l2beat/uif'
import { HourlyIndexer } from '../../tools/HourlyIndexer'
import { IndexerService } from '../../tools/uif/IndexerService'
import { BlockNumberIndexer } from '../block-sync/BlockNumberIndexer'
import { SyncOptimizer } from '../tvs/tools/SyncOptimizer'
import type { ApplicationModule, ModuleDependencies } from '../types'
import { PrivacyFlowIndexer } from './indexers/PrivacyFlowIndexer'
import { PrivacyPriceIndexer } from './indexers/PrivacyPriceIndexer'

export function createPrivacyModule({
  config,
  logger,
  db,
  providers,
  clock,
}: ModuleDependencies): ApplicationModule | undefined {
  if (!config.privacy) {
    logger.info('PrivacyModule disabled')
    return
  }

  logger = logger.tag({ feature: 'privacy', module: 'privacy' })
  const env = getEnv()
  const indexerService = new IndexerService(db)
  const syncOptimizer = new SyncOptimizer(clock)
  const indexers: Indexer[] = []

  const flowConfigsByChain = new Map<
    string,
    typeof config.privacy.flowConfigs
  >()
  for (const flowConfig of config.privacy.flowConfigs) {
    flowConfigsByChain.set(flowConfig.chain, [
      ...(flowConfigsByChain.get(flowConfig.chain) ?? []),
      flowConfig,
    ])
  }

  for (const [chain, flowConfigs] of flowConfigsByChain) {
    const blockNumberIndexer = new BlockNumberIndexer(
      providers.block.getBlockProvider(chain),
      chain,
      logger,
      config.blockSync.delayFromTipInSeconds,
    )

    const flowIndexer = new PrivacyFlowIndexer(
      {
        chain,
        parents: [blockNumberIndexer],
        indexerService,
        blockProvider: providers.block.getBlockProvider(chain),
        logsProvider: providers.logs.getLogsProvider(chain),
        configurations: flowConfigs.map((flowConfig) => ({
          id: PrivacyFlowIndexer.idToConfigurationId(flowConfig),
          minHeight: flowConfig.sinceBlock,
          maxHeight: null,
          properties: flowConfig,
        })),
        db,
        batchSize:
          env.optionalInteger(Env.key(chain, 'PRIVACY_FLOW_BATCH_SIZE')) ??
          10_000,
      },
      logger,
    )

    indexers.push(blockNumberIndexer, flowIndexer)
  }

  if (config.privacy.priceConfigs.length > 0) {
    const hourlyIndexer = new HourlyIndexer(logger, clock)
    indexers.push(hourlyIndexer)

    const priceIndexer = new PrivacyPriceIndexer(
      {
        parents: [hourlyIndexer],
        indexerService,
        configurations: config.privacy.priceConfigs.map((priceConfig) => ({
          id: PrivacyPriceIndexer.idToConfigurationId(priceConfig),
          minHeight: priceConfig.sinceTimestamp,
          maxHeight: null,
          properties: priceConfig,
        })),
        priceProvider: providers.price,
        syncOptimizer,
        db,
      },
      logger,
    )

    indexers.push(priceIndexer)
  }

  logger.info('Privacy config loaded', {
    projects: config.privacy.projects.length,
    flowConfigs: config.privacy.flowConfigs.length,
    priceConfigs: config.privacy.priceConfigs.length,
    chains: config.privacy.chains.length,
  })

  return {
    start: async () => {
      logger = logger.for('PrivacyModule')
      logger.info('Starting...')
      for (const indexer of indexers) {
        await indexer.start()
      }
    },
  }
}
