import { assert, Logger } from '@l2beat/backend-tools'
import {
  BlockscoutClient,
  CoingeckoClient,
  CoingeckoQueryService,
  EtherscanClient,
} from '@l2beat/shared'
import { assertUnreachable } from '@l2beat/shared-pure'

import { Config } from '../../../config/Config'
import { Peripherals } from '../../../peripherals/Peripherals'
import { ViemRpcClient } from '../../../peripherals/viem-rpc-client/ViemRpcClient'
import { Clock } from '../../../tools/Clock'
import { IndexerConfigurationRepository } from '../../../tools/uif/IndexerConfigurationRepository'
import { IndexerService } from '../../../tools/uif/IndexerService'
import { IndexerStateRepository } from '../../../tools/uif/IndexerStateRepository'
import { ApplicationModule } from '../../ApplicationModule'
import { HourlyIndexer } from '../../tracked-txs/HourlyIndexer'
import { ArbitrumFeeAnalyzer } from '../ArbitrumFeeAnalyzer'
import { EVMFeeAnalyzer } from '../EVMFeeAnalyzer'
import { GasPriceIndexer } from '../indexers/GasPriceIndexer'
import { GasPriceRepository } from '../repositories/GasPriceRepository'
import { AnalyzerType } from '../types'

export function createGasPriceModule(
  config: Config,
  logger: Logger,
  peripherals: Peripherals,
  clock: Clock,
): ApplicationModule | undefined {
  if (!config.gasPrice) {
    logger.info('GasPriceModule disabled')
    return
  }

  const hourlyIndexer = new HourlyIndexer(logger, clock)
  const coingeckoClient = peripherals.getClient(CoingeckoClient, {
    apiKey: config.gasPrice.coingeckoApiKey,
  })
  const coingeckoQueryService = new CoingeckoQueryService(coingeckoClient)

  const indexerStateRepository = peripherals.getRepository(
    IndexerStateRepository,
  )
  const configurationsRepository = peripherals.getRepository(
    IndexerConfigurationRepository,
  )
  const indexerService = new IndexerService(
    indexerStateRepository,
    configurationsRepository,
  )

  const indexers = config.gasPrice.chains.map((chain) => {
    assert(chain.config)

    const rpc = peripherals.getClient(ViemRpcClient, {
      url: chain.config.providerUrl,
      callsPerMinute: chain.config.providerCallsPerMinute,
    })

    const blockTimestampClient =
      chain.config.blockNumberProviderConfig.type === 'etherscan'
        ? peripherals.getClient(EtherscanClient, {
            apiKey: chain.config.blockNumberProviderConfig.etherscanApiKey,
            url: chain.config.blockNumberProviderConfig.etherscanApiUrl,
            minTimestamp: chain.config.minBlockTimestamp,
            chainId: chain.config.chainId,
          })
        : peripherals.getClient(BlockscoutClient, {
            url: chain.config.blockNumberProviderConfig.blockscoutApiUrl,
            minTimestamp: chain.config.minBlockTimestamp,
            chainId: chain.config.chainId,
          })

    const analyzer = getAnalyzerForConfig(chain.type, rpc)

    return new GasPriceIndexer({
      logger: logger.tag(chain.chain),
      parents: [hourlyIndexer],
      project: chain.chain,
      coingeckoQueryService,
      id: `gas_price_${chain.chain}`,
      minHeight: chain.config.minBlockTimestamp.toNumber(),
      gasPriceRepository: peripherals.getRepository(GasPriceRepository),
      analyzer,
      indexerService,
      blockTimestampClient,
    })
  })

  return {
    start: async () => {
      await hourlyIndexer.start()
      for (const indexer of indexers) {
        await indexer.start()
      }
    },
  }
}

function getAnalyzerForConfig(type: AnalyzerType, rpc: ViemRpcClient) {
  switch (type) {
    case 'evm':
      return new EVMFeeAnalyzer(rpc)
    case 'arbitrum':
      return new ArbitrumFeeAnalyzer(rpc)
    default:
      assertUnreachable(type)
  }
}
