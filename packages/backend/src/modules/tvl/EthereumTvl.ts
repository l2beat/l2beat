import { EtherscanClient, HttpClient, Logger } from '@l2beat/shared'
import { ChainId } from '@l2beat/shared-pure'
import { providers } from 'ethers'

import { Config } from '../../config'
import { NMVUpdater } from '../../core/assets/NMVUpdater'
import { BalanceUpdater } from '../../core/balances/BalanceUpdater'
import { EthereumBalanceProvider } from '../../core/balances/providers/EthereumBalanceProvider'
import { BlockNumberUpdater } from '../../core/BlockNumberUpdater'
import { Clock } from '../../core/Clock'
import { PriceUpdater } from '../../core/PriceUpdater'
import { AggregatedReportUpdater } from '../../core/reports/AggregatedReportUpdater'
import { ReportUpdater } from '../../core/reports/ReportUpdater'
import { EthereumClient } from '../../peripherals/ethereum/EthereumClient'
import { MulticallClient } from '../../peripherals/ethereum/MulticallClient'
import { ApplicationModule } from '../ApplicationModule'
import { TvlDatabase } from './types'

export function createEthereumTvlSubmodule(
  db: TvlDatabase,
  priceUpdater: PriceUpdater,
  config: Config,
  logger: Logger,
  http: HttpClient,
  clock: Clock,
): ApplicationModule | undefined {
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
  )

  const nativeAssetUpdate = new NMVUpdater(
    priceUpdater,
    db.reportRepository,
    db.reportStatusRepository,
    clock,
    logger,
  )

  const reportUpdater = new ReportUpdater(
    priceUpdater,
    balanceUpdater,
    db.reportRepository,
    db.reportStatusRepository,
    clock,
    config.projects,
    logger,
  )

  const aggregatedReportUpdater = new AggregatedReportUpdater(
    reportUpdater,
    nativeAssetUpdate,
    db.aggregatedReportRepository,
    db.aggregatedReportStatusRepository,
    clock,
    config.projects,
    logger,
  )

  // #endregion

  const start = async () => {
    logger = logger.for('EthereumTvlModule')
    logger.info('Starting')

    await ethereumBlockNumberUpdater.start()
    await balanceUpdater.start()
    await reportUpdater.start()
    await aggregatedReportUpdater.start()

    logger.info('Started')
  }

  return {
    start,
  }
}
