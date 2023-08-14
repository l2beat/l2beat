import { ArbiscanClient, HttpClient, Logger } from '@l2beat/shared'
import { ChainId, ValueType } from '@l2beat/shared-pure'
import { providers } from 'ethers'

import { Config } from '../../config'
import { ArbitrumEBVUpdater } from '../../core/assets/ArbitrumEBVUpdater'
import { BalanceUpdater } from '../../core/balances/BalanceUpdater'
import { ArbitrumBalanceProvider } from '../../core/balances/providers/ArbitrumBalanceProvider'
import { BlockNumberUpdater } from '../../core/BlockNumberUpdater'
import { Clock } from '../../core/Clock'
import { PriceUpdater } from '../../core/PriceUpdater'
import { ArbitrumTotalSupplyProvider } from '../../core/totalSupply/providers/ArbitrumTotalSupplyProvider'
import { TotalSupplyUpdater } from '../../core/totalSupply/TotalSupplyUpdater'
import { ArbitrumMulticallClient } from '../../peripherals/arbitrum/multicall/ArbitrumMulticall'
import { EthereumClient } from '../../peripherals/ethereum/EthereumClient'
import { TvlSubmodule } from '../ApplicationModule'
import { TvlDatabase } from './types'

export function createArbitrumTvlSubmodule(
  db: TvlDatabase,
  priceUpdater: PriceUpdater,
  config: Config,
  logger: Logger,
  http: HttpClient,
  clock: Clock,
): TvlSubmodule | undefined {
  if (!config.tvl.arbitrum) {
    logger.info('Arbitrum TVL module disabled')
    return
  }

  // #region peripherals
  const arbitrumEBVTokens = config.tokens.filter(
    (t) => t.chainId === ChainId.ARBITRUM && t.type === ValueType.EBV,
  )

  const arbitrumProvider = new providers.JsonRpcProvider(
    config.tvl.arbitrum.providerUrl,
    'arbitrum',
  )

  const arbiscanClient = new ArbiscanClient(
    http,
    config.tvl.arbitrum.arbiscanApiKey,
    config.tvl.arbitrum.minBlockTimestamp,
    logger,
  )

  const arbitrumClient = new EthereumClient(arbitrumProvider, logger, 25)

  const arbitrumMulticall = ArbitrumMulticallClient.forMainnet(arbitrumClient)

  const totalSupplyProvider = new ArbitrumTotalSupplyProvider(
    arbitrumClient,
    arbitrumMulticall,
  )

  const arbitrumBalanceProvider = new ArbitrumBalanceProvider(
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
    config.tvl.arbitrum.minBlockTimestamp,
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
    config.tvl.arbitrum.minBlockTimestamp,
  )

  const totalSupplyUpdater = new TotalSupplyUpdater(
    totalSupplyProvider,
    arbiscanBlockNumberUpdater,
    db.totalSupplyRepository,
    db.totalSupplyStatusRepository,
    clock,
    arbitrumEBVTokens,
    logger,
    ChainId.ARBITRUM,
    config.tvl.arbitrum.minBlockTimestamp,
  )

  const ebvUpdater = new ArbitrumEBVUpdater(
    priceUpdater,
    arbitrumBalanceUpdater,
    totalSupplyUpdater,
    db.reportRepository,
    db.reportStatusRepository,
    clock,
    arbitrumEBVTokens,
    logger,
    config.tvl.arbitrum.minBlockTimestamp,
  )

  // #endregion

  const start = async () => {
    logger = logger.for('ArbitrumTvlModule')
    logger.info('Starting')

    await arbiscanBlockNumberUpdater.start()
    await arbitrumBalanceUpdater.start()
    await totalSupplyUpdater.start()
    await ebvUpdater.start()

    logger.info('Started')
  }

  return {
    updaters: [ebvUpdater],
    start,
  }
}
