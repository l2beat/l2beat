import { Logger } from '@l2beat/backend-tools'
import { EtherscanClient, HttpClient } from '@l2beat/shared'
import { ChainId } from '@l2beat/shared-pure'
import { providers } from 'ethers'

import { Config } from '../../config'
import { CBVUpdater } from '../../core/assets'
import {
  BalanceProvider,
  ETHEREUM_BALANCE_ENCODING,
} from '../../core/balances/BalanceProvider'
import { BalanceUpdater } from '../../core/balances/BalanceUpdater'
import { BlockNumberUpdater } from '../../core/BlockNumberUpdater'
import { Clock } from '../../core/Clock'
import { PriceUpdater } from '../../core/PriceUpdater'
import { EthereumClient } from '../../peripherals/ethereum/EthereumClient'
import { MulticallClient } from '../../peripherals/ethereum/multicall/MulticallClient'
import { ETHEREUM_MULTICALL_CONFIG } from '../../peripherals/ethereum/multicall/MulticallConfig'
import { TvlSubmodule } from '../ApplicationModule'
import { TvlDatabase } from './types'

export function createEthereumTvlSubmodule(
  db: TvlDatabase,
  priceUpdater: PriceUpdater,
  config: Config,
  logger: Logger,
  http: HttpClient,
  clock: Clock,
): TvlSubmodule | undefined {
  if (!config.tvl.ethereum) {
    logger.info('EthereumTvlModule disabled')
    return
  }

  // #region peripherals

  const ethereumProvider = new providers.JsonRpcProvider(
    config.tvl.ethereum.providerUrl,
  )

  const etherscanClient = new EtherscanClient(
    http,
    config.tvl.ethereum.etherscanApiKey,
    config.tvl.ethereum.minBlockTimestamp,
    logger,
  )
  const ethereumClient = new EthereumClient(
    ethereumProvider,
    logger,
    config.tvl.ethereum.providerCallsPerMinute,
  )
  const multicallClient = new MulticallClient(
    ethereumClient,
    ETHEREUM_MULTICALL_CONFIG,
  )

  const balanceProvider = new BalanceProvider(
    ethereumClient,
    multicallClient,
    ChainId.ETHEREUM,
    ETHEREUM_BALANCE_ENCODING,
  )

  // #endregion
  // #region updaters

  const ethereumBlockNumberUpdater = new BlockNumberUpdater(
    etherscanClient,
    db.blockNumberRepository,
    clock,
    logger,
    ChainId.ETHEREUM,
    config.tvl.ethereum.minBlockTimestamp,
  )

  const balanceUpdater = new BalanceUpdater(
    balanceProvider,
    ethereumBlockNumberUpdater,
    db.balanceRepository,
    db.balanceStatusRepository,
    clock,
    config.projects,
    logger,
    ChainId.ETHEREUM,
    config.tvl.ethereum.minBlockTimestamp,
  )

  const cbvUpdater = new CBVUpdater(
    priceUpdater,
    balanceUpdater,
    db.reportRepository,
    db.reportStatusRepository,
    clock,
    config.projects,
    logger,
    config.tvl.ethereum.minBlockTimestamp,
  )

  // #endregion

  const start = async () => {
    logger = logger.for('EthereumTvlModule')
    logger.info('Starting')

    await ethereumBlockNumberUpdater.start()
    await balanceUpdater.start()
    await cbvUpdater.start()

    logger.info('Started')
  }

  return {
    reportUpdaters: [cbvUpdater],
    dataUpdaters: [ethereumBlockNumberUpdater, balanceUpdater],
    start,
  }
}
