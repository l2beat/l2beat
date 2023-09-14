import { HttpClient, Logger, OptiscanClient } from '@l2beat/shared'
import { ChainId, ProjectId } from '@l2beat/shared-pure'
import { providers } from 'ethers'

import { Config } from '../../config'
import { TotalSupplyFormulaUpdater } from '../../core/assets/TotalSupplyFormulaUpdater'
import { BalanceProvider } from '../../core/balances/BalanceProvider'
import { BalanceUpdater } from '../../core/balances/BalanceUpdater'
import { BlockNumberUpdater } from '../../core/BlockNumberUpdater'
import { Clock } from '../../core/Clock'
import { PriceUpdater } from '../../core/PriceUpdater'
import { TotalSupplyProvider } from '../../core/totalSupply/TotalSupplyProvider'
import { TotalSupplyUpdater } from '../../core/totalSupply/TotalSupplyUpdater'
import { EthereumClient } from '../../peripherals/ethereum/EthereumClient'
import { MulticallClient } from '../../peripherals/ethereum/MulticallClient'
import { OPTIMISM_MULTICALL_CONFIG } from '../../peripherals/ethereum/MulticallConfig'
import { TvlSubmodule } from '../ApplicationModule'
import { TvlDatabase } from './types'

export function createOptimismTvlSubmodule(
  db: TvlDatabase,
  priceUpdater: PriceUpdater,
  config: Config,
  logger: Logger,
  http: HttpClient,
  clock: Clock,
): TvlSubmodule | undefined {
  if (!config.tvl.optimism) {
    logger.info('Optimism TVL module disabled')
    return
  }

  // #region peripherals
  const optimismProvider = new providers.JsonRpcProvider(
    config.tvl.optimism.providerUrl,
    'optimism',
  )

  const optiscanClient = new OptiscanClient(
    http,
    config.tvl.optimism.etherscanApiKey,
    config.tvl.optimism.minBlockTimestamp,
    logger,
  )

  const optimismClient = new EthereumClient(optimismProvider, logger, 25)

  const multicallClient = new MulticallClient(
    optimismClient,
    OPTIMISM_MULTICALL_CONFIG,
  )

  const totalSupplyProvider = new TotalSupplyProvider(
    multicallClient,
    ChainId.OPTIMISM,
  )

  const optimismBalanceProvider = new BalanceProvider(
    optimismClient,
    multicallClient,
    ChainId.OPTIMISM,
    undefined,
  )

  // #endregion
  // #region updaters

  const optiscanBlockNumberUpdater = new BlockNumberUpdater(
    optiscanClient,
    db.blockNumberRepository,
    clock,
    logger,
    ChainId.OPTIMISM,
    config.tvl.optimism.minBlockTimestamp,
  )

  const optimismBalanceUpdater = new BalanceUpdater(
    optimismBalanceProvider,
    optiscanBlockNumberUpdater,
    db.balanceRepository,
    db.balanceStatusRepository,
    clock,
    [],
    logger,
    ChainId.OPTIMISM,
    config.tvl.optimism.minBlockTimestamp,
  )

  const totalSupplyTokens = config.tokens.filter(
    (t) => t.chainId === ChainId.OPTIMISM && t.formula === 'totalSupply',
  )
  const totalSupplyUpdater = new TotalSupplyUpdater(
    totalSupplyProvider,
    optiscanBlockNumberUpdater,
    db.totalSupplyRepository,
    db.totalSupplyStatusRepository,
    clock,
    totalSupplyTokens,
    logger,
    ChainId.OPTIMISM,
    config.tvl.optimism.minBlockTimestamp,
  )

  const totalSupplyFormulaUpdater = new TotalSupplyFormulaUpdater(
    priceUpdater,
    totalSupplyUpdater,
    db.reportRepository,
    db.reportStatusRepository,
    ProjectId.OPTIMISM,
    ChainId.OPTIMISM,
    clock,
    totalSupplyTokens,
    logger,
    config.tvl.optimism.minBlockTimestamp,
  )
  // #endregion

  const start = async () => {
    logger = logger.for('OptimismTvlModule')
    logger.info('Starting')

    await optiscanBlockNumberUpdater.start()
    await optimismBalanceUpdater.start()
    await totalSupplyUpdater.start()
    await totalSupplyFormulaUpdater.start()

    logger.info('Started')
  }

  return {
    updaters: [totalSupplyFormulaUpdater],
    start,
  }
}
