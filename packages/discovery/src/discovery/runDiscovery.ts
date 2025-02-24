import path from 'path'
import type { DiscoveryOutput } from '@l2beat/discovery-types'
import type { HttpClient } from '@l2beat/shared'
import { providers } from 'ethers'
import type {
  DiscoveryChainConfig,
  DiscoveryModuleConfig,
} from '../config/types'
import { printSharedModuleInfo } from '../utils/printSharedModuleInfo'
import { DiscoveryLogger } from './DiscoveryLogger'
import { OverwriteCacheWrapper } from './OverwriteCacheWrapper'
import type { Analysis } from './analysis/AddressAnalyzer'
import { TEMPLATES_PATH } from './analysis/TemplateService'
import type { ConfigReader } from './config/ConfigReader'
import type { DiscoveryConfig } from './config/DiscoveryConfig'
import { getDiscoveryEngine } from './getDiscoveryEngine'
import { diffDiscovery } from './output/diffDiscovery'
import { printTemplatization } from './output/printTemplatization'
import { saveDiscoveryResult } from './output/saveDiscoveryResult'
import { toDiscoveryOutput } from './output/toDiscoveryOutput'
import { SQLiteCache } from './provider/SQLiteCache'
import { type AllProviderStats, printProviderStats } from './provider/Stats'

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
    configReader.rootPath,
    chainConfigs,
    projectConfig,
    logger,
    configuredBlockNumber,
    http,
    config.overwriteCache,
  )

  const templatesFolder = path.join(configReader.rootPath, TEMPLATES_PATH)

  await saveDiscoveryResult(result, projectConfig, blockNumber, logger, {
    sourcesFolder: config.sourcesFolder,
    flatSourcesFolder: config.flatSourcesFolder,
    discoveryFilename: config.discoveryFilename,
    saveSources: config.saveSources,
    buildModels: config.buildModels,
    templatesFolder,
  })

  if (config.project.startsWith('shared-')) {
    const allConfigs = configReader.readAllConfigsForChain(config.chain.name)
    const backrefConfigs = allConfigs.filter((c) =>
      c.sharedModules.includes(config.project),
    )
    printSharedModuleInfo(backrefConfigs)
  }

  if (config.printStats) {
    printProviderStats(logger, providerStats)
  }

  printTemplatization(logger, result, !!config.verboseTemplatization)
}

export async function dryRunDiscovery(
  discoveryPath: string,
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
    justDiscover(
      discoveryPath,
      chainConfigs,
      projectConfig,
      blockNumber,
      http,
      config.overwriteCache,
    ),
    justDiscover(
      discoveryPath,
      chainConfigs,
      projectConfig,
      blockNumberYesterday,
      http,
      config.overwriteCache,
    ),
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
  discoveryPath: string,
  chainConfigs: DiscoveryChainConfig[],
  config: DiscoveryConfig,
  blockNumber: number,
  http: HttpClient,
  overwriteCache: boolean,
): Promise<DiscoveryOutput> {
  const { result } = await discover(
    discoveryPath,
    chainConfigs,
    config,
    DiscoveryLogger.CLI,
    blockNumber,
    http,
    overwriteCache,
  )
  return toDiscoveryOutput(config, blockNumber, result)
}

export async function discover(
  discoveryPath: string,
  chainConfigs: DiscoveryChainConfig[],
  config: DiscoveryConfig,
  logger: DiscoveryLogger,
  blockNumber: number | undefined,
  http: HttpClient,
  overwriteChache: boolean,
): Promise<{
  result: Analysis[]
  blockNumber: number
  providerStats: AllProviderStats
}> {
  const sqliteCache = new SQLiteCache()

  const cache = overwriteChache
    ? new OverwriteCacheWrapper(sqliteCache)
    : sqliteCache

  const { allProviders, discoveryEngine } = getDiscoveryEngine(
    discoveryPath,
    chainConfigs,
    cache,
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
