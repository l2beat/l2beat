import { UnixTime } from '@l2beat/shared-pure'
import type { Indexer } from '@l2beat/uif'
import { HourlyIndexer } from '../../tools/HourlyIndexer'
import { IndexerService } from '../../tools/uif/IndexerService'
import type { ApplicationModule, ModuleDependencies } from '../types'
import { PrivacyBlockTimestampIndexer } from './indexers/PrivacyBlockTimestampIndexer'
import { PrivacyFlowIndexer } from './indexers/PrivacyFlowIndexer'
import { PrivacyPriceIndexer } from './indexers/PrivacyPriceIndexer'
import type { PrivacyFlowIndexerConfig } from './types'

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

  const flowConfigsByChain = new Map<string, PrivacyFlowIndexerConfig[]>()
  for (const flowConfig of config.privacy.flowConfigs) {
    flowConfigsByChain.set(flowConfig.chain, [
      ...(flowConfigsByChain.get(flowConfig.chain) ?? []),
      flowConfig,
    ])
  }

  for (const blockTimestampConfig of config.privacy.blockTimestampConfigs) {
    const sinceTimestamp = UnixTime.toStartOf(
      blockTimestampConfig.sinceTimestamp,
      'hour',
    )
    const flowConfigs = flowConfigsByChain.get(blockTimestampConfig.chain) ?? []

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

    const flowIndexer = new PrivacyFlowIndexer(
      {
        chain: blockTimestampConfig.chain,
        parents: [priceIndexer, blockTimestampIndexer],
        indexerService,
        blockProvider: providers.block.getBlockProvider(
          blockTimestampConfig.chain,
        ),
        logsProvider: providers.logs.getLogsProvider(
          blockTimestampConfig.chain,
        ),
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
