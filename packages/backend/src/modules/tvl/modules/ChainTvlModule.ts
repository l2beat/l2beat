import { Logger } from '@l2beat/backend-tools'
import {
  BlockNumberProvider,
  BlockscoutClient,
  CoingeckoQueryService,
  EtherscanClient,
  HttpClient,
} from '@l2beat/shared'
import {
  capitalizeFirstLetter,
  ChainId,
  notUndefined,
  ProjectId,
  Token,
  UnixTime,
} from '@l2beat/shared-pure'
import { providers } from 'ethers'

import { ChainTvlConfig } from '../../../config/Config'
import { MulticallClient } from '../../../peripherals/multicall/MulticallClient'
import { RpcClient } from '../../../peripherals/rpcclient/RpcClient'
import { Clock } from '../../../tools/Clock'
import { CirculatingSupplyFormulaUpdater } from '../assets/CirculatingSupplyFormulaUpdater'
import { TotalSupplyFormulaUpdater } from '../assets/TotalSupplyFormulaUpdater'
import { BlockNumberUpdater } from '../BlockNumberUpdater'
import { PriceUpdater } from '../PriceUpdater'
import { CirculatingSupplyUpdater } from '../totalSupply/CirculatingSupplyUpdater'
import { TotalSupplyProvider } from '../totalSupply/TotalSupplyProvider'
import { TotalSupplyUpdater } from '../totalSupply/TotalSupplyUpdater'
import { TvlDatabase, TvlModule } from './types'

export function chainTvlModule(
  { chain, config }: ChainTvlConfig,
  tokens: Token[],
  db: TvlDatabase,
  priceUpdater: PriceUpdater,
  coingeckoQueryService: CoingeckoQueryService,
  http: HttpClient,
  clock: Clock,
  logger: Logger,
): TvlModule | undefined {
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
      ? new BlockscoutClient(
          http,
          config.blockNumberProviderConfig.blockscoutApiUrl,
          config.minBlockTimestamp,
          config.chainId,
          logger,
        )
      : new EtherscanClient(
          http,
          config.blockNumberProviderConfig.etherscanApiUrl,
          config.blockNumberProviderConfig.etherscanApiKey,
          config.minBlockTimestamp,
          config.chainId,
          logger,
        )

  const ethereumClient = new RpcClient(
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

  const { totalSupplyUpdater, totalSupplyFormulaUpdater } =
    initializeTotalSupply(
      totalSupplyTokens,
      totalSupplyProvider,
      blockNumberUpdater,
      priceUpdater,
      config,
      db,
      clock,
      logger,
    )

  const circulatingSupplyTokens = tokens.filter(
    (t) => t.chainId === config.chainId && t.formula === 'circulatingSupply',
  )

  const { circulatingSupplyUpdater, circulatingSupplyFormulaUpdater } =
    initializeCirculatingSupply(
      circulatingSupplyTokens,
      coingeckoQueryService,
      priceUpdater,
      config,
      db,
      clock,
      logger,
    )
  // #endregion

  const start = async () => {
    logger = logger.for(name)
    logger.info('Starting')

    await blockNumberUpdater.start()
    await totalSupplyUpdater?.start()
    await totalSupplyFormulaUpdater?.start()
    circulatingSupplyUpdater?.start()
    await circulatingSupplyFormulaUpdater?.start()

    logger.info('Started')
  }

  return {
    chain,
    reportUpdaters: [
      totalSupplyFormulaUpdater,
      circulatingSupplyFormulaUpdater,
    ].filter(notUndefined),
    dataUpdaters: [
      blockNumberUpdater,
      totalSupplyUpdater,
      circulatingSupplyUpdater,
    ].filter(notUndefined),
    start,
  }
}

function initializeCirculatingSupply(
  circulatingSupplyTokens: Token[],
  coingeckoQueryService: CoingeckoQueryService,
  priceUpdater: PriceUpdater,
  config: {
    projectId: ProjectId
    chainId: ChainId
    minBlockTimestamp: UnixTime
  },
  db: TvlDatabase,
  clock: Clock,
  logger: Logger,
) {
  if (circulatingSupplyTokens.length === 0) {
    return {
      circulatingSupplyUpdater: undefined,
      circulatingSupplyFormulaUpdater: undefined,
    }
  }

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
  return { circulatingSupplyUpdater, circulatingSupplyFormulaUpdater }
}

function initializeTotalSupply(
  totalSupplyTokens: Token[],
  totalSupplyProvider: TotalSupplyProvider,
  blockNumberUpdater: BlockNumberUpdater,
  priceUpdater: PriceUpdater,
  config: {
    projectId: ProjectId
    chainId: ChainId
    minBlockTimestamp: UnixTime
  },
  db: TvlDatabase,
  clock: Clock,
  logger: Logger,
) {
  if (totalSupplyTokens.length === 0) {
    return {
      totalSupplyUpdater: undefined,
      totalSupplyFormulaUpdater: undefined,
    }
  }

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
  return { totalSupplyUpdater, totalSupplyFormulaUpdater }
}
