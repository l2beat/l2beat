import { ArbiscanClient, HttpClient, Logger } from '@l2beat/shared'
import { ChainId } from '@l2beat/shared-pure'
import { providers } from 'ethers'

import { Config } from '../../config'
import { BalanceUpdater } from '../../core/balances/BalanceUpdater'
import { ArbitrumBalanceProvider } from '../../core/balances/providers/ArbitrumBalanceProvider'
import { BlockNumberUpdater } from '../../core/BlockNumberUpdater'
import { Clock } from '../../core/Clock'
import { ArbitrumTotalSupplyProvider } from '../../core/totalSupply/providers/ArbitrumTotalSupplyProvider'
import { TotalSupplyUpdater } from '../../core/totalSupply/TotalSupplyUpdater'
import { ArbitrumMulticallClient } from '../../peripherals/arbitrum/multicall/ArbitrumMulticall'
import { EthereumClient } from '../../peripherals/ethereum/EthereumClient'
import { ApplicationModule } from '../ApplicationModule'
import { TvlDatabase } from './types'

export function createArbitrumTvlSubmodule(
  db: TvlDatabase,
  config: Config,
  logger: Logger,
  http: HttpClient,
  clock: Clock,
): ApplicationModule | undefined {
  if (!config.tvl.arbitrum) {
    logger.info('Arbitrum TVL module disabled')
    return
  }

  // #region peripherals

  const arbitrumProvider = new providers.AlchemyProvider(
    'arbitrum',
    config.tvl.arbitrum.alchemyApiKey,
  )

  const arbiscanClient = new ArbiscanClient(
    http,
    config.tvl.arbitrum.arbiscanApiKey,
    logger,
  )

  const arbitrumClient = new EthereumClient(arbitrumProvider, logger)

  const arbitrumMulticall = ArbitrumMulticallClient.forMainnet(arbitrumClient)

  const totalSupplyProvider = new ArbitrumTotalSupplyProvider(
    arbitrumClient,
    arbitrumMulticall,
  )

  // #endregion
  // #region updaters

  const arbiscanBlockNumberUpdater = new BlockNumberUpdater(
    arbiscanClient,
    db.blockNumberRepository,
    clock,
    logger,
    ChainId.ARBITRUM,
  )

  const arbitrumBalanceProvider = new ArbitrumBalanceProvider(
    arbitrumClient,
    arbitrumMulticall,
  )

  const arbitrumBalanceUpdater = new BalanceUpdater(
    arbitrumBalanceProvider,
    arbiscanBlockNumberUpdater,
    db.balanceRepository,
    db.balanceStatusRepository,
    clock,
    [],
    logger,
    ChainId.ARBITRUM,
  )

  const totalSupplyUpdater = new TotalSupplyUpdater(
    totalSupplyProvider,
    arbiscanBlockNumberUpdater,
    db.totalSupplyRepository,
    db.totalSupplyStatusRepository,
    clock,
    [],
    logger,
    ChainId.ARBITRUM,
  )

  // #endregion

  const start = async () => {
    logger = logger.for('ArbitrumTvlModule')
    logger.info('Starting')

    await arbiscanBlockNumberUpdater.start()
    await arbitrumBalanceUpdater.start()
    await totalSupplyUpdater.start()

    logger.info('Started')
  }

  return {
    start,
  }
}
