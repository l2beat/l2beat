import { ArbiscanClient, HttpClient, Logger } from '@l2beat/shared'
import { assert, ChainId, ProjectId } from '@l2beat/shared-pure'
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
  const arbitrumTokens = getExternalTokens(arbitrumProject)

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
    arbitrumTokens,
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
    arbitrumProject,
    arbitrumTokens,
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

function filterArbitrumProject(projects: Project[]) {
  const result = projects.filter((x) => x.projectId === ProjectId.ARBITRUM)
  assert(
    result.length === 1,
    'Expected there only to be a single matching project',
  )
  return result
}

function getExternalTokens(project: Project[]) {
  assert(
    project.length === 1,
    'Expected there only to be a single matching project',
  )
  assert(project[0].externalTokens, 'No external tokens configured')
  return project[0].externalTokens.assets
}
