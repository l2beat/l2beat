import { assert, Logger } from '@l2beat/backend-tools'
import {
  CoingeckoClient,
  CoingeckoQueryService,
  EtherscanClient,
} from '@l2beat/shared'

import { Config } from '../../../config/Config'
import { Peripherals } from '../../../peripherals/Peripherals'
import { ViemRpcClient } from '../../../peripherals/viem-rpc-client/ViemRpcClient'
import { Clock } from '../../../tools/Clock'
import { IndexerConfigurationRepository } from '../../../tools/uif/IndexerConfigurationRepository'
import { IndexerService } from '../../../tools/uif/IndexerService'
import { IndexerStateRepository } from '../../../tools/uif/IndexerStateRepository'
import { ApplicationModule } from '../../ApplicationModule'
import { HourlyIndexer } from '../../tracked-txs/HourlyIndexer'
import { GasPriceIndexer } from '../indexers/GasPriceIndexer'
import { GasPriceRepository } from '../repositories/GasPriceRepository'

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

    assert(chain.config.blockNumberProviderConfig.type === 'etherscan')

    const blockTimestampClient = peripherals.getClient(EtherscanClient, {
      apiKey: chain.config.blockNumberProviderConfig.etherscanApiKey,
      url: chain.config.blockNumberProviderConfig.etherscanApiUrl,
      minTimestamp: chain.config.minBlockTimestamp,
      chainId: chain.config.chainId,
    })

    return new GasPriceIndexer({
      logger: logger.tag(chain.chain),
      parents: [hourlyIndexer],
      project: chain.chain,
      coingeckoQueryService,
      id: `gas_price_${chain.chain}`,
      minHeight: chain.config.minBlockTimestamp.toNumber(),
      gasPriceRepository: peripherals.getRepository(GasPriceRepository),
      rpc,
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
