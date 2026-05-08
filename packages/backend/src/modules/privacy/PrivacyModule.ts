import type { Indexer } from '@l2beat/uif'
import { HourlyIndexer } from '../../tools/HourlyIndexer'
import { IndexerService } from '../../tools/uif/IndexerService'
import type { ApplicationModule, ModuleDependencies } from '../types'
import { PrivacyBlockTimestampIndexer } from './indexers/PrivacyBlockTimestampIndexer'
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
  const indexerService = new IndexerService(db)
  const indexers: Indexer[] = []

  const hourlyIndexer = new HourlyIndexer(logger, clock)
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
      db,
    },
    logger,
  )

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
    const minTimestamp = Math.min(...flowConfigs.map((c) => c.sinceTimestamp))

    const blockTimestampIndexer = new PrivacyBlockTimestampIndexer(
      {
        parents: [hourlyIndexer],
        indexerService,
        blockTimestampProvider: providers.blockTimestamp,
        configurations: [
          {
            id: PrivacyBlockTimestampIndexer.idToConfigurationId({
              chain,
              sinceTimestamp: minTimestamp,
            }),
            minHeight: minTimestamp,
            maxHeight: null,
            properties: { chain, sinceTimestamp: minTimestamp },
          },
        ],
        db,
      },
      logger,
    )

    const flowIndexer = new PrivacyFlowIndexer(
      {
        chain,
        parents: [priceIndexer, blockTimestampIndexer],
        indexerService,
        blockProvider: providers.block.getBlockProvider(chain),
        logsProvider: providers.logs.getLogsProvider(chain),
        configurations: flowConfigs.map((flowConfig) => ({
          id: PrivacyFlowIndexer.idToConfigurationId(flowConfig),
          minHeight: flowConfig.sinceTimestamp,
          maxHeight: null,
          properties: flowConfig,
        })),
        db,
      },
      logger,
    )

    indexers.push(blockTimestampIndexer, flowIndexer)
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
      await hourlyIndexer.start()
      await priceIndexer.start()
      for (const indexer of indexers) {
        await indexer.start()
      }
    },
  }
}
