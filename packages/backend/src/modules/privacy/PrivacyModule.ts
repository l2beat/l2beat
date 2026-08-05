import { assert, UnixTime } from '@l2beat/shared-pure'
import type { Indexer } from '@l2beat/uif'
import { HourlyIndexer } from '../../tools/HourlyIndexer'
import { IndexerService } from '../../tools/uif/IndexerService'
import type { ApplicationModule, ModuleDependencies } from '../types'
import { PrivacyBlockTimestampIndexer } from './indexers/PrivacyBlockTimestampIndexer'
import { PrivacyFlowIndexer } from './indexers/PrivacyFlowIndexer'
import { PrivacyPriceIndexer } from './indexers/PrivacyPriceIndexer'
import { PrivacyRelayerActivityIndexer } from './indexers/PrivacyRelayerActivityIndexer'
import type {
  PrivacyFlowIndexerConfig,
  PrivacyRelayerActivityIndexerConfig,
} from './types'

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
  const priceIndexer =
    config.privacy.priceConfigs.length > 0
      ? new PrivacyPriceIndexer(
          {
            parents: [hourlyIndexer],
            indexerService,
            configurations: config.privacy.priceConfigs.map((priceConfig) => ({
              id: priceConfig.id,
              minHeight: UnixTime.toStartOf(priceConfig.sinceTimestamp, 'hour'),
              maxHeight: null,
              properties: priceConfig,
            })),
            priceProvider: providers.price,
            db,
          },
          logger,
        )
      : undefined

  const flowConfigsByChain = new Map<string, PrivacyFlowIndexerConfig[]>()
  for (const flowConfig of config.privacy.flowConfigs) {
    flowConfigsByChain.set(flowConfig.chain, [
      ...(flowConfigsByChain.get(flowConfig.chain) ?? []),
      flowConfig,
    ])
  }

  const relayerConfigsByChain = new Map<
    string,
    PrivacyRelayerActivityIndexerConfig[]
  >()
  for (const relayerConfig of config.privacy.relayerConfigs) {
    relayerConfigsByChain.set(relayerConfig.chain, [
      ...(relayerConfigsByChain.get(relayerConfig.chain) ?? []),
      relayerConfig,
    ])
  }

  for (const blockTimestampConfig of config.privacy.blockTimestampConfigs) {
    const sinceTimestamp = UnixTime.toStartOf(
      blockTimestampConfig.sinceTimestamp,
      'hour',
    )
    const flowConfigs = flowConfigsByChain.get(blockTimestampConfig.chain) ?? []
    const relayerConfigs =
      relayerConfigsByChain.get(blockTimestampConfig.chain) ?? []
    const blockProvider = providers.block.getBlockProvider(
      blockTimestampConfig.chain,
    )
    const logsProvider = providers.logs.getLogsProvider(
      blockTimestampConfig.chain,
    )

    const blockTimestampIndexer = new PrivacyBlockTimestampIndexer(
      {
        parents: [hourlyIndexer],
        indexerService,
        blockTimestampProvider: providers.blockTimestamp,
        configurations: [
          {
            id: blockTimestampConfig.id,
            minHeight: sinceTimestamp,
            maxHeight: null,
            properties: { ...blockTimestampConfig, sinceTimestamp },
          },
        ],
        db,
      },
      logger,
    )

    indexers.push(blockTimestampIndexer)

    if (flowConfigs.length > 0) {
      assert(priceIndexer, 'Privacy flow configs require a price indexer')
      const flowIndexer = new PrivacyFlowIndexer(
        {
          chain: blockTimestampConfig.chain,
          parents: [priceIndexer, blockTimestampIndexer],
          indexerService,
          blockProvider,
          logsProvider,
          configurations: flowConfigs.map((flowConfig) => ({
            id: flowConfig.id,
            minHeight: flowConfig.sinceTimestamp,
            maxHeight: null,
            properties: flowConfig,
          })),
          db,
        },
        logger,
      )
      indexers.push(flowIndexer)
    }

    if (relayerConfigs.length > 0) {
      const relayerActivityIndexer = new PrivacyRelayerActivityIndexer(
        {
          chain: blockTimestampConfig.chain,
          parents: [blockTimestampIndexer],
          indexerService,
          blockProvider,
          logsProvider,
          configurations: relayerConfigs.map((relayerConfig) => ({
            id: relayerConfig.id,
            minHeight: relayerConfig.sinceTimestamp,
            maxHeight: null,
            properties: relayerConfig,
          })),
          db,
        },
        logger,
      )
      indexers.push(relayerActivityIndexer)
    }
  }

  logger.info('Privacy config loaded', {
    projects: config.privacy.projects.length,
    flowConfigs: config.privacy.flowConfigs.length,
    relayerConfigs: config.privacy.relayerConfigs.length,
    priceConfigs: config.privacy.priceConfigs.length,
    chains: config.privacy.chains.length,
  })

  return {
    start: async () => {
      logger = logger.for('PrivacyModule')
      logger.info('Starting...')
      await hourlyIndexer.start()
      await priceIndexer?.start()
      for (const indexer of indexers) {
        await indexer.start()
      }
    },
  }
}
