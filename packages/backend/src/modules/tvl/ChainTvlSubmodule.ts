import { Logger } from '@l2beat/backend-tools'
import {
  BlockNumberProvider,
  CoingeckoQueryService,
  HttpClient,
  UniversalEtherscanClient,
  UniversalRoutescanClient,
} from '@l2beat/shared'
import {
  capitalizeFirstLetter,
  ChainId,
  ProjectId,
  Token,
} from '@l2beat/shared-pure'
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
import { MulticallConfigEntry } from '../../peripherals/ethereum/multicall/types'
import { TvlSubmodule } from '../ApplicationModule'
import { TvlDatabase } from './types'

export function chainTvlSubmodule(
  chainId: ChainId,
  projectId: ProjectId,
  chainTvlConfig: ChainTvlConfig | false,
  tokens: Token[],
  multicallConfig: MulticallConfigEntry[],
  db: TvlDatabase,
  priceUpdater: PriceUpdater,
  coingeckoQueryService: CoingeckoQueryService,
  http: HttpClient,
  clock: Clock,
  logger: Logger,
): TvlSubmodule | undefined {
  const name = `${capitalizeFirstLetter(ChainId.getName(chainId))}TvlModule`
  if (!chainTvlConfig) {
    logger.info(`${name} disabled`)
    return
  }

  // #region peripherals
  const provider = new providers.JsonRpcProvider(chainTvlConfig.providerUrl)

  const blockNumberProvider: BlockNumberProvider =
    chainTvlConfig.blockNumberProviderConfig.type === 'RoutescanLike'
      ? new UniversalRoutescanClient(
          http,
          chainTvlConfig.blockNumberProviderConfig.routescanApiUrl,
          chainTvlConfig.minBlockTimestamp,
          chainId,
          logger,
        )
      : new UniversalEtherscanClient(
          http,
          chainTvlConfig.blockNumberProviderConfig.etherscanApiUrl,
          chainTvlConfig.blockNumberProviderConfig.etherscanApiKey,
          chainTvlConfig.minBlockTimestamp,
          chainId,
          logger,
        )

  const ethereumClient = new EthereumClient(
    provider,
    logger,
    chainTvlConfig.providerCallsPerMinute,
  )

  const multicallClient = new MulticallClient(ethereumClient, multicallConfig)

  const totalSupplyProvider = new TotalSupplyProvider(multicallClient, chainId)

  // #endregion
  // #region updaters

  const blockNumberUpdater = new BlockNumberUpdater(
    blockNumberProvider,
    db.blockNumberRepository,
    clock,
    logger,
    chainId,
    chainTvlConfig.minBlockTimestamp,
  )

  const totalSupplyTokens = tokens.filter(
    (t) => t.chainId === chainId && t.formula === 'totalSupply',
  )
  const totalSupplyUpdater = new TotalSupplyUpdater(
    totalSupplyProvider,
    blockNumberUpdater,
    db.totalSupplyRepository,
    db.totalSupplyStatusRepository,
    clock,
    totalSupplyTokens,
    logger,
    chainId,
    chainTvlConfig.minBlockTimestamp,
  )

  const totalSupplyFormulaUpdater = new TotalSupplyFormulaUpdater(
    priceUpdater,
    totalSupplyUpdater,
    db.reportRepository,
    db.reportStatusRepository,
    projectId,
    chainId,
    clock,
    totalSupplyTokens,
    logger,
    chainTvlConfig.minBlockTimestamp,
  )

  const circulatingSupplyTokens = tokens.filter(
    (t) => t.chainId === chainId && t.formula === 'circulatingSupply',
  )

  const circulatingSupplyUpdater = new CirculatingSupplyUpdater(
    coingeckoQueryService,
    db.circulatingSupplyRepository,
    clock,
    circulatingSupplyTokens,
    chainId,
    logger,
    chainTvlConfig.minBlockTimestamp,
  )

  const circulatingSupplyFormulaUpdater = new CirculatingSupplyFormulaUpdater(
    priceUpdater,
    circulatingSupplyUpdater,
    db.reportRepository,
    db.reportStatusRepository,
    projectId,
    chainId,
    clock,
    circulatingSupplyTokens,
    logger,
    chainTvlConfig.minBlockTimestamp,
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
