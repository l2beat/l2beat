import { UnixTime } from '@l2beat/shared-pure'
import type { Indexer } from '@l2beat/uif'
import { HourlyIndexer } from '../../tools/HourlyIndexer'
import { IndexerService } from '../../tools/uif/IndexerService'
import type { ApplicationModule, ModuleDependencies } from '../types'
import { PrivacyAnonymitySetIndexer } from './indexers/PrivacyAnonymitySetIndexer'
import { PrivacyBlockTimestampIndexer } from './indexers/PrivacyBlockTimestampIndexer'
import { PrivacyFlowIndexer } from './indexers/PrivacyFlowIndexer'
import { PrivacyPriceIndexer } from './indexers/PrivacyPriceIndexer'
import { StarknetPrivacyFlowIndexer } from './indexers/StarknetPrivacyFlowIndexer'
import type {
  PrivacyAnonymitySetIndexerConfig,
  PrivacyFlowIndexerConfig,
  StarknetPrivacyFlowIndexerConfig,
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

  const anonymitySetConfigsByChain = new Map<
    string,
    PrivacyAnonymitySetIndexerConfig[]
  >()
  for (const anonymitySetConfig of config.privacy.anonymitySetConfigs) {
    anonymitySetConfigsByChain.set(anonymitySetConfig.chain, [
      ...(anonymitySetConfigsByChain.get(anonymitySetConfig.chain) ?? []),
      anonymitySetConfig,
    ])
  }

  const starknetFlowConfigsByChain = new Map<
    string,
    StarknetPrivacyFlowIndexerConfig[]
  >()
  for (const flowConfig of config.privacy.starknetFlowConfigs) {
    starknetFlowConfigsByChain.set(flowConfig.chain, [
      ...(starknetFlowConfigsByChain.get(flowConfig.chain) ?? []),
      flowConfig,
    ])
  }

  for (const blockTimestampConfig of config.privacy.blockTimestampConfigs) {
    const sinceTimestamp = UnixTime.toStartOf(
      blockTimestampConfig.sinceTimestamp,
      'hour',
    )
    const flowConfigs = flowConfigsByChain.get(blockTimestampConfig.chain) ?? []
    const anonymitySetConfigs =
      anonymitySetConfigsByChain.get(blockTimestampConfig.chain) ?? []
    const starknetFlowConfigs =
      starknetFlowConfigsByChain.get(blockTimestampConfig.chain) ?? []

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

    if (anonymitySetConfigs.length > 0) {
      indexers.push(
        new PrivacyAnonymitySetIndexer(
          {
            chain: blockTimestampConfig.chain,
            parents: [hourlyIndexer],
            indexerService,
            blockTimestampProvider: providers.blockTimestamp,
            blockProvider: providers.block.getBlockProvider(
              blockTimestampConfig.chain,
            ),
            logsProvider: providers.logs.getLogsProvider(
              blockTimestampConfig.chain,
            ),
            rpcClient: providers.clients.getRpcClient(
              blockTimestampConfig.chain,
            ),
            configurations: anonymitySetConfigs.map((anonymitySetConfig) => ({
              id: anonymitySetConfig.id,
              minHeight: anonymitySetConfig.sinceTimestamp,
              maxHeight: null,
              properties: anonymitySetConfig,
            })),
            db,
          },
          logger,
        ),
      )
    }

    if (flowConfigs.length > 0) {
      indexers.push(
        new PrivacyFlowIndexer(
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
        ),
      )
    }

    if (starknetFlowConfigs.length > 0) {
      indexers.push(
        new StarknetPrivacyFlowIndexer(
          {
            chain: blockTimestampConfig.chain,
            parents: [priceIndexer, blockTimestampIndexer],
            indexerService,
            blockProvider: providers.block.getBlockProvider(
              blockTimestampConfig.chain,
            ),
            starknetClient: providers.clients.getStarknetClient(
              blockTimestampConfig.chain,
            ),
            configurations: starknetFlowConfigs.map((flowConfig) => ({
              id: flowConfig.id,
              minHeight: flowConfig.sinceTimestamp,
              maxHeight: null,
              properties: flowConfig,
            })),
            db,
          },
          logger,
        ),
      )
    }
  }

  logger.info('Privacy config loaded', {
    projects: config.privacy.projects.length,
    flowConfigs: config.privacy.flowConfigs.length,
    anonymitySetConfigs: config.privacy.anonymitySetConfigs.length,
    starknetFlowConfigs: config.privacy.starknetFlowConfigs.length,
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
