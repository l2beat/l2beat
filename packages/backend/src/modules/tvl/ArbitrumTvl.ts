import { ArbiscanClient, HttpClient, Logger } from '@l2beat/shared'
import { assert, ChainId } from '@l2beat/shared-pure'
import { providers } from 'ethers'

import { Config } from '../../config'
import { ArbitrumEBVUpdater } from '../../core/assets/ArbitrumEBVUpdater'
import { BalanceUpdater } from '../../core/balances/BalanceUpdater'
import { ArbitrumBalanceProvider } from '../../core/balances/providers/ArbitrumBalanceProvider'
import { BlockNumberUpdater } from '../../core/BlockNumberUpdater'
import { Clock } from '../../core/Clock'
import { PriceUpdater } from '../../core/PriceUpdater'
import { ARBITRUM_PROJECT_ID } from '../../core/reports/custom/arbitrum'
import { ArbitrumTotalSupplyProvider } from '../../core/totalSupply/providers/ArbitrumTotalSupplyProvider'
import { TotalSupplyUpdater } from '../../core/totalSupply/TotalSupplyUpdater'
import { Project } from '../../model'
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

  const arbitrumProject = filterArbitrumProject(config.projects)
  assert(
    arbitrumProject.length === 1,
    'Expected there only to be a single matching project',
  )
  assert(arbitrumProject[0].externalTokens, 'No external tokens configured')
  const arbitrumTokens = arbitrumProject[0].externalTokens.assets

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
    arbitrumProject,
    logger,
    ChainId.ARBITRUM,
  )

  const totalSupplyUpdater = new TotalSupplyUpdater(
    totalSupplyProvider,
    arbiscanBlockNumberUpdater,
    db.totalSupplyRepository,
    db.totalSupplyStatusRepository,
    clock,
    arbitrumTokens,
    logger,
    ChainId.ARBITRUM,
  )

  const ebvUpdater = new ArbitrumEBVUpdater(
    priceUpdater,
    arbitrumBalanceUpdater,
    totalSupplyUpdater,
    db.reportRepository,
    db.reportStatusRepository,
    clock,
    arbitrumProject,
    arbitrumTokens,
    logger,
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
    start,
  }
}

function filterArbitrumProject(projects: Project[]) {
  return projects.filter((x) => x.projectId === ARBITRUM_PROJECT_ID)
}
