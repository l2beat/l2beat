import { DiscoveryOutput } from '@l2beat/discovery-types'
import { providers } from 'ethers'

import { printSharedModuleInfo } from '../cli/printSharedModuleInfo'
import { DiscoveryChainConfig, DiscoveryModuleConfig } from '../config/types'
import { HttpClient } from '../utils/HttpClient'
import { DiscoveryLogger } from './DiscoveryLogger'
import { Analysis } from './analysis/AddressAnalyzer'
import { ConfigReader } from './config/ConfigReader'
import { DiscoveryConfig } from './config/DiscoveryConfig'
import { getDiscoveryEngine } from './getDiscoveryEngine'
import { diffDiscovery } from './output/diffDiscovery'
import { saveDiscoveryResult } from './output/saveDiscoveryResult'
import { toDiscoveryOutput } from './output/toDiscoveryOutput'
import { SQLiteCache } from './provider/SQLiteCache'
import { AllProviderStats, printProviderStats } from './provider/Stats'

export async function runDiscovery(
  http: HttpClient,
  configReader: ConfigReader,
  config: DiscoveryModuleConfig,
  chainConfigs: DiscoveryChainConfig[],
): Promise<void> {
  const projectConfig = configReader.readConfig(
    config.project,
    config.chain.name,
  )

  const configuredBlockNumber =
    config.blockNumber ??
    (config.dev
      ? configReader.readDiscovery(config.project, config.chain.name)
          .blockNumber
      : undefined)

  const logger = DiscoveryLogger.CLI
  const { result, blockNumber, providerStats } = await discover(
    chainConfigs,
    projectConfig,
    logger,
    configuredBlockNumber,
    http,
  )

  await saveDiscoveryResult(result, projectConfig, blockNumber, logger, {
    sourcesFolder: config.sourcesFolder,
    flatSourcesFolder: config.flatSourcesFolder,
    discoveryFilename: config.discoveryFilename,
    saveSources: config.saveSources,
  })

  if (config.project.startsWith('shared-')) {
    const allConfigs = configReader.readAllConfigsForChain(config.chain.name)
    const backrefConfigs = allConfigs.filter((c) =>
      c.sharedModules.includes(config.project),
    )
    printSharedModuleInfo(backrefConfigs)
  }

  if (config.printStats) {
    printProviderStats(providerStats)
  }
}

export async function dryRunDiscovery(
  http: HttpClient,
  configReader: ConfigReader,
  config: DiscoveryModuleConfig,
  chainConfigs: DiscoveryChainConfig[],
): Promise<void> {
  const provider = new providers.StaticJsonRpcProvider(config.chain.rpcUrl)
  const blockNumber = await provider.getBlockNumber()
  const BLOCKS_PER_DAY = 86400 / 12
  const blockNumberYesterday = blockNumber - BLOCKS_PER_DAY

  const projectConfig = configReader.readConfig(
    config.project,
    config.chain.name,
  )

  const [discovered, discoveredYesterday] = await Promise.all([
    justDiscover(chainConfigs, projectConfig, blockNumber, http),
    justDiscover(chainConfigs, projectConfig, blockNumberYesterday, http),
  ])

  const diff = diffDiscovery(
    discoveredYesterday.contracts,
    discovered.contracts,
  )

  if (diff.length > 0) {
    console.log(JSON.stringify(diff, null, 2))
  } else {
    console.log('No changes!')
  }
}

async function justDiscover(
  chainConfigs: DiscoveryChainConfig[],
  config: DiscoveryConfig,
  blockNumber: number,
  http: HttpClient,
): Promise<DiscoveryOutput> {
  const { result } = await discover(
    chainConfigs,
    config,
    DiscoveryLogger.CLI,
    blockNumber,
    http,
  )
  return toDiscoveryOutput(
    config.name,
    config.chain,
    config.hash,
    blockNumber,
    result,
  )
}

export async function discover(
  chainConfigs: DiscoveryChainConfig[],
  config: DiscoveryConfig,
  logger: DiscoveryLogger,
  blockNumber: number | undefined,
  http: HttpClient,
): Promise<{
  result: Analysis[]
  blockNumber: number
  providerStats: AllProviderStats
}> {
  const sqliteCache = new SQLiteCache()
  await sqliteCache.init()

  const { allProviders, discoveryEngine } = getDiscoveryEngine(
    chainConfigs,
    sqliteCache,
    http,
    logger,
    config.chain,
  )
  blockNumber ??= await allProviders.getLatestBlockNumber(config.chain)
  const provider = allProviders.get(config.chain, blockNumber)
  return {
    result: await discoveryEngine.discover(provider, config),
    blockNumber,
    providerStats: allProviders.getStats(config.chain),
  }
}
