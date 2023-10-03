import { DiscoveryOutput } from '@l2beat/discovery-types'
import { providers } from 'ethers'

import { DiscoveryModuleConfig } from '../config/config.discovery'
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
import { ProviderWithCache } from './provider/ProviderWithCache'
import { SQLiteCache } from './provider/SQLiteCache'
import { ProxyDetector } from './proxies/ProxyDetector'
import { SourceCodeService } from './source/SourceCodeService'

export async function runDiscovery(
  provider: providers.StaticJsonRpcProvider,
  etherscanClient: EtherscanLikeClient,
  configReader: ConfigReader,
  config: DiscoveryModuleConfig,
): Promise<void> {
  const projectConfig = await configReader.readConfig(
    config.project,
    config.chainId,
  )

  const blockNumber =
    config.blockNumber ??
    (config.dev
      ? (await configReader.readDiscovery(config.project, config.chainId))
          .blockNumber
      : await provider.getBlockNumber())

  const logger = DiscoveryLogger.CLI
  const result = await discover(
    provider,
    etherscanClient,
    projectConfig,
    logger,
    blockNumber,
    config.getLogsMaxRange,
  )
  await saveDiscoveryResult(
    result,
    projectConfig,
    blockNumber,
    projectConfig.hash,
    config.chainId,
  )
}

export async function dryRunDiscovery(
  provider: providers.StaticJsonRpcProvider,
  etherscanClient: EtherscanLikeClient,
  configReader: ConfigReader,
  config: DiscoveryModuleConfig,
): Promise<void> {
  const blockNumber = await provider.getBlockNumber()
  const BLOCKS_PER_DAY = 86400 / 12
  const blockNumberYesterday = blockNumber - BLOCKS_PER_DAY

  const projectConfig = await configReader.readConfig(
    config.project,
    config.chainId,
  )

  const [discovered, discoveredYesterday] = await Promise.all([
    justDiscover(
      provider,
      etherscanClient,
      projectConfig,
      blockNumber,
      config.getLogsMaxRange,
    ),
    justDiscover(
      provider,
      etherscanClient,
      projectConfig,
      blockNumberYesterday,
      config.getLogsMaxRange,
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
  config: DiscoveryConfig,
  blockNumber: number,
  getLogsMaxRange?: number,
): Promise<DiscoveryOutput> {
  const result = await discover(
    provider,
    etherscanClient,
    config,
    DiscoveryLogger.CLI,
    blockNumber,
    getLogsMaxRange,
  )

  const { name } = config

  if (!name) {
    throw new Error('name is required')
  }

  return toDiscoveryOutput(
    name,
    config.chainId,
    config.hash,
    blockNumber,
    result,
  )
}

export async function discover(
  provider: providers.StaticJsonRpcProvider,
  etherscanClient: EtherscanLikeClient,
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
    config.chainId,
    sqliteCache,
    getLogsMaxRange,
  )

  const proxyDetector = new ProxyDetector(discoveryProvider, logger)
  const sourceCodeService = new SourceCodeService(discoveryProvider)
  const handlerExecutor = new HandlerExecutor(discoveryProvider, logger)
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
