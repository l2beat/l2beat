import { DiscoveryOutput } from '@l2beat/discovery-types'
import { providers } from 'ethers'

import { DiscoveryModuleConfig } from '../config/types'
import { EtherscanLikeClient } from '../utils/EtherscanLikeClient'
import { AddressAnalyzer, Analysis } from './analysis/AddressAnalyzer'
import { ConfigReader } from './config/ConfigReader'
import { DiscoveryConfig } from './config/DiscoveryConfig'
import { DiscoveryLogger } from './DiscoveryLogger'
import { DiscoveryEngine } from './engine/DiscoveryEngine'
import { HandlerExecutor } from './handlers/HandlerExecutor'
import { diffDiscovery } from './output/diffDiscovery'
import { saveDiscoveryResult } from './output/saveDiscoveryResult'
import { toDiscoveryOutput } from './output/toDiscoveryOutput'
import { MulticallClient } from './provider/multicall/MulticallClient'
import { MulticallConfig } from './provider/multicall/types'
import { ProviderWithCache } from './provider/ProviderWithCache'
import { SQLiteCache } from './provider/SQLiteCache'
import { ProxyDetector } from './proxies/ProxyDetector'
import { SourceCodeService } from './source/SourceCodeService'

export async function runDiscovery(
  provider: providers.StaticJsonRpcProvider,
  etherscanClient: EtherscanLikeClient,
  multicallConfig: MulticallConfig,
  configReader: ConfigReader,
  config: DiscoveryModuleConfig,
): Promise<void> {
  const projectConfig = await configReader.readConfig(
    config.project,
    config.chain.name,
  )
  const projectMeta = await configReader.readMeta(
    config.project,
    config.chain.name,
  )

  const blockNumber =
    config.blockNumber ??
    (config.dev
      ? (await configReader.readDiscovery(config.project, config.chain.name))
          .blockNumber
      : await provider.getBlockNumber())

  const logger = DiscoveryLogger.CLI
  const result = await discover(
    provider,
    etherscanClient,
    multicallConfig,
    projectConfig,
    logger,
    blockNumber,
    config.chain.rpcGetLogsMaxRange,
  )
  await saveDiscoveryResult(
    result,
    projectConfig,
    projectMeta,
    blockNumber,
    logger,
    {
      sourcesFolder: config.sourcesFolder,
      flatSourcesFolder: config.flatSourcesFolder,
      discoveryFilename: config.discoveryFilename,
    },
  )
}

export async function dryRunDiscovery(
  provider: providers.StaticJsonRpcProvider,
  etherscanClient: EtherscanLikeClient,
  multicallConfig: MulticallConfig,
  configReader: ConfigReader,
  config: DiscoveryModuleConfig,
): Promise<void> {
  const blockNumber = await provider.getBlockNumber()
  const BLOCKS_PER_DAY = 86400 / 12
  const blockNumberYesterday = blockNumber - BLOCKS_PER_DAY

  const projectConfig = await configReader.readConfig(
    config.project,
    config.chain.name,
  )

  const [discovered, discoveredYesterday] = await Promise.all([
    justDiscover(
      provider,
      etherscanClient,
      multicallConfig,
      projectConfig,
      blockNumber,
      config.chain.rpcGetLogsMaxRange,
    ),
    justDiscover(
      provider,
      etherscanClient,
      multicallConfig,
      projectConfig,
      blockNumberYesterday,
      config.chain.rpcGetLogsMaxRange,
    ),
  ])

  const diff = diffDiscovery(
    discoveredYesterday.contracts,
    discovered.contracts,
    projectConfig,
  )

  if (diff.length > 0) {
    console.log(JSON.stringify(diff, null, 2))
  } else {
    console.log('No changes!')
  }
}

export async function justDiscover(
  provider: providers.StaticJsonRpcProvider,
  etherscanClient: EtherscanLikeClient,
  multicallConfig: MulticallConfig,
  config: DiscoveryConfig,
  blockNumber: number,
  getLogsMaxRange?: number,
): Promise<DiscoveryOutput> {
  const result = await discover(
    provider,
    etherscanClient,
    multicallConfig,
    config,
    DiscoveryLogger.CLI,
    blockNumber,
    getLogsMaxRange,
  )

  const { name } = config

  if (!name) {
    throw new Error('name is required')
  }

  return toDiscoveryOutput(name, config.chain, config.hash, blockNumber, result)
}

export async function discover(
  provider: providers.StaticJsonRpcProvider,
  etherscanClient: EtherscanLikeClient,
  multicallConfig: MulticallConfig,
  config: DiscoveryConfig,
  logger: DiscoveryLogger,
  blockNumber: number,
  getLogsMaxRange?: number,
): Promise<Analysis[]> {
  const sqliteCache = new SQLiteCache()
  await sqliteCache.init()

  const discoveryProvider = new ProviderWithCache(
    provider,
    etherscanClient,
    logger,
    config.chain,
    sqliteCache,
    getLogsMaxRange,
  )

  const proxyDetector = new ProxyDetector(discoveryProvider, logger)
  const sourceCodeService = new SourceCodeService(discoveryProvider)
  const multicallClient = new MulticallClient(
    discoveryProvider,
    multicallConfig,
  )
  const handlerExecutor = new HandlerExecutor(
    discoveryProvider,
    multicallClient,
    logger,
  )
  const addressAnalyzer = new AddressAnalyzer(
    discoveryProvider,
    proxyDetector,
    sourceCodeService,
    handlerExecutor,
    logger,
  )
  const discoveryEngine = new DiscoveryEngine(addressAnalyzer, logger)
  return discoveryEngine.discover(config, blockNumber)
}
