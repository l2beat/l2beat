import { Logger } from '@l2beat/backend-tools'
import {
  BlockNumberProvider,
  CoingeckoQueryService,
  HttpClient,
  UniversalEtherscanClient,
  UniversalBlockscoutClient,
} from '@l2beat/shared'
import { capitalizeFirstLetter, Token } from '@l2beat/shared-pure'
import { providers } from 'ethers'

import { ChainTvlConfig } from '../../config/Config'
import { CirculatingSupplyFormulaUpdater } from '../../core/assets/CirculatingSupplyFormulaUpdater'
import { TotalSupplyFormulaUpdater } from '../../core/assets/TotalSupplyFormulaUpdater'
import { BlockNumberUpdater } from '../../core/BlockNumberUpdater'
import { Clock } from '../../core/Clock'
import { PriceUpdater } from '../../core/PriceUpdater'
import { CirculatingSupplyUpdater } from '../../core/totalSupply/CirculatingSupplyUpdater'
import { TotalSupplyProvider } from '../../core/totalSupply/TotalSupplyProvider'
import { TotalSupplyUpdater } from '../../core/totalSupply/TotalSupplyUpdater'
import { EthereumClient } from '../../peripherals/ethereum/EthereumClient'
import { MulticallClient } from '../../peripherals/ethereum/multicall/MulticallClient'
import { TvlSubmodule } from '../ApplicationModule'
import { TvlDatabase } from './types'

export function chainTvlSubmodule(
  { chain, config }: ChainTvlConfig,
  tokens: Token[],
  db: TvlDatabase,
  priceUpdater: PriceUpdater,
  coingeckoQueryService: CoingeckoQueryService,
  http: HttpClient,
  clock: Clock,
  logger: Logger,
): TvlSubmodule | undefined {
  const name = `${capitalizeFirstLetter(chain)}TvlModule`
  if (!config) {
    logger.info(`${name} disabled`)
    return
  }
  logger = logger.tag(chain)

  // #region peripherals
  const provider = new providers.JsonRpcProvider(config.providerUrl)

  const blockNumberProvider: BlockNumberProvider =
    config.blockNumberProviderConfig.type === 'blockscout'
      ? new UniversalBlockscoutClient(
          http,
          config.blockNumberProviderConfig.blockscoutApiUrl,
          config.minBlockTimestamp,
          config.chainId,
          logger,
        )
      : new UniversalEtherscanClient(
          http,
          config.blockNumberProviderConfig.etherscanApiUrl,
          config.blockNumberProviderConfig.etherscanApiKey,
          config.minBlockTimestamp,
          config.chainId,
          logger,
        )

  const ethereumClient = new EthereumClient(
    provider,
    logger,
    config.providerCallsPerMinute,
  )

  const multicallClient = new MulticallClient(
    ethereumClient,
    config.multicallConfig,
  )

  const totalSupplyProvider = new TotalSupplyProvider(
    multicallClient,
    config.chainId,
  )

  // #endregion
  // #region updaters

  const blockNumberUpdater = new BlockNumberUpdater(
    blockNumberProvider,
    db.blockNumberRepository,
    clock,
    logger,
    config.chainId,
    config.minBlockTimestamp,
  )

  const totalSupplyTokens = tokens.filter(
    (t) => t.chainId === config.chainId && t.formula === 'totalSupply',
  )
  const totalSupplyUpdater = new TotalSupplyUpdater(
    totalSupplyProvider,
    blockNumberUpdater,
    db.totalSupplyRepository,
    db.totalSupplyStatusRepository,
    clock,
    totalSupplyTokens,
    logger,
    config.chainId,
    config.minBlockTimestamp,
  )

  const totalSupplyFormulaUpdater = new TotalSupplyFormulaUpdater(
    priceUpdater,
    totalSupplyUpdater,
    db.reportRepository,
    db.reportStatusRepository,
    config.projectId,
    config.chainId,
    clock,
    totalSupplyTokens,
    logger,
    config.minBlockTimestamp,
  )

  const circulatingSupplyTokens = tokens.filter(
    (t) => t.chainId === config.chainId && t.formula === 'circulatingSupply',
  )

  const circulatingSupplyUpdater = new CirculatingSupplyUpdater(
    coingeckoQueryService,
    db.circulatingSupplyRepository,
    clock,
    circulatingSupplyTokens,
    config.chainId,
    logger,
    config.minBlockTimestamp,
  )

  const circulatingSupplyFormulaUpdater = new CirculatingSupplyFormulaUpdater(
    priceUpdater,
    circulatingSupplyUpdater,
    db.reportRepository,
    db.reportStatusRepository,
    config.projectId,
    config.chainId,
    clock,
    circulatingSupplyTokens,
    logger,
    config.minBlockTimestamp,
  )
  // #endregion

  const start = async () => {
    logger = logger.for(name)
    logger.info('Starting')

    await blockNumberUpdater.start()
    await totalSupplyUpdater.start()
    await totalSupplyFormulaUpdater.start()
    circulatingSupplyUpdater.start()
    await circulatingSupplyFormulaUpdater.start()

    logger.info('Started')
  }

  return {
    reportUpdaters: [
      totalSupplyFormulaUpdater,
      circulatingSupplyFormulaUpdater,
    ],
    dataUpdaters: [
      blockNumberUpdater,
      totalSupplyUpdater,
      circulatingSupplyUpdater,
    ],
    start,
  }
}
