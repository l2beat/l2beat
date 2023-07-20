import { EtherscanClient, HttpClient, Logger } from '@l2beat/shared'
import { ChainId } from '@l2beat/shared-pure'
import { providers } from 'ethers'

import { Config } from '../../config'
import { CBVUpdater } from '../../core/assets/'
import { BalanceUpdater } from '../../core/balances/BalanceUpdater'
import { EthereumBalanceProvider } from '../../core/balances/providers/EthereumBalanceProvider'
import { BlockNumberUpdater } from '../../core/BlockNumberUpdater'
import { Clock } from '../../core/Clock'
import { PriceUpdater } from '../../core/PriceUpdater'
import { EthereumClient } from '../../peripherals/ethereum/EthereumClient'
import { MulticallClient } from '../../peripherals/ethereum/MulticallClient'
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
    logger.info('Ethereum TVL module disabled')
    return
  }

  // #region peripherals

  const ethereumProvider = new providers.AlchemyProvider(
    'mainnet',
    config.tvl.ethereum.alchemyApiKey,
  )
  const ethereumClient = new EthereumClient(ethereumProvider, logger)
  const multicall = new MulticallClient(ethereumClient)

  const etherscanClient = new EtherscanClient(
    http,
    config.tvl.ethereum.etherscanApiKey,
    config.tvl.ethereum.minBlockTimestamp,
    logger,
  )
  const ethereumBalanceProvider = new EthereumBalanceProvider(multicall)

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
    ethereumBalanceProvider,
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
    updaters: [cbvUpdater],
    start,
  }
}
