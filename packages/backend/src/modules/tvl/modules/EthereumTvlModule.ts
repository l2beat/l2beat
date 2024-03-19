import { assert, Logger } from '@l2beat/backend-tools'
import { EtherscanClient, HttpClient } from '@l2beat/shared'
import { ChainId } from '@l2beat/shared-pure'
import { providers } from 'ethers'

import { Config } from '../../../config'
import { MulticallClient } from '../../../peripherals/multicall/MulticallClient'
import { Peripherals } from '../../../peripherals/Peripherals'
import { RpcClient } from '../../../peripherals/rpcclient/RpcClient'
import { Clock } from '../../../tools/Clock'
import { CBVUpdater } from '../assets'
import {
  BalanceProvider,
  ETHEREUM_BALANCE_ENCODING,
} from '../balances/BalanceProvider'
import { BalanceUpdater } from '../balances/BalanceUpdater'
import { BlockNumberUpdater } from '../BlockNumberUpdater'
import { PriceUpdater } from '../PriceUpdater'
import { BalanceRepository } from '../repositories/BalanceRepository'
import { BalanceStatusRepository } from '../repositories/BalanceStatusRepository'
import { BlockNumberRepository } from '../repositories/BlockNumberRepository'
import { ReportRepository } from '../repositories/ReportRepository'
import { ReportStatusRepository } from '../repositories/ReportStatusRepository'
import { TvlModule } from './types'

export function createEthereumTvlModule(
  peripherals: Peripherals,
  priceUpdater: PriceUpdater,
  config: Config,
  logger: Logger,
  http: HttpClient,
  clock: Clock,
): TvlModule | undefined {
  const tvlConfig = config.tvl.ethereum.config
  if (!tvlConfig) {
    logger.info('EthereumTvlModule disabled')
    return
  }

  logger = logger.tag('ethereum')

  // #region peripherals

  assert(tvlConfig.blockNumberProviderConfig.type === 'etherscan')

  const etherscanClient = new EtherscanClient(
    http,
    tvlConfig.blockNumberProviderConfig.etherscanApiUrl,
    tvlConfig.blockNumberProviderConfig.etherscanApiKey,
    tvlConfig.minBlockTimestamp,
    ChainId.ETHEREUM,
    logger,
  )

  const ethereumClient = peripherals.getClient(RpcClient, {
    url: tvlConfig.providerUrl,
    callsPerMinute: tvlConfig.providerCallsPerMinute,
  })
  const multicallClient = new MulticallClient(
    ethereumClient,
    tvlConfig.multicallConfig,
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
    peripherals.getRepository(BlockNumberRepository),
    clock,
    logger,
    ChainId.ETHEREUM,
    tvlConfig.minBlockTimestamp,
  )

  const balanceUpdater = new BalanceUpdater(
    balanceProvider,
    ethereumBlockNumberUpdater,
    peripherals.getRepository(BalanceRepository),
    peripherals.getRepository(BalanceStatusRepository),
    clock,
    config.projects,
    logger,
    ChainId.ETHEREUM,
    tvlConfig.minBlockTimestamp,
  )

  const cbvUpdater = new CBVUpdater(
    priceUpdater,
    balanceUpdater,
    peripherals.getRepository(ReportRepository),
    peripherals.getRepository(ReportStatusRepository),
    clock,
    config.projects,
    logger,
    tvlConfig.minBlockTimestamp,
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
    chain: config.tvl.ethereum.chain,
    reportUpdaters: [cbvUpdater],
    dataUpdaters: [ethereumBlockNumberUpdater, balanceUpdater],
    start,
  }
}
