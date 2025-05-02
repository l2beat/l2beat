import path from 'path'
import type { Logger } from '@l2beat/backend-tools'
import type { HttpClient } from '@l2beat/shared'
import { providers } from 'ethers'
import type {
  DiscoveryChainConfig,
  DiscoveryModuleConfig,
} from '../config/types'
import { printSharedModuleInfo } from '../utils/printSharedModuleInfo'
import { OverwriteCacheWrapper } from './OverwriteCacheWrapper'
import type { Analysis } from './analysis/AddressAnalyzer'
import { TEMPLATES_PATH, TemplateService } from './analysis/TemplateService'
import type { ConfigReader } from './config/ConfigReader'
import type { ConfigRegistry } from './config/ConfigRegistry'
import type { DiscoveryPaths } from './config/getDiscoveryPaths'
import { getDiscoveryEngine } from './getDiscoveryEngine'
import { diffDiscovery } from './output/diffDiscovery'
import { printTemplatization } from './output/printTemplatization'
import { saveDiscoveryResult } from './output/saveDiscoveryResult'
import { toDiscoveryOutput } from './output/toDiscoveryOutput'
import type { DiscoveryOutput } from './output/types'
import { SQLiteCache } from './provider/SQLiteCache'
import { type AllProviderStats, printProviderStats } from './provider/Stats'

export async function runDiscovery(
  paths: DiscoveryPaths,
  http: HttpClient,
  configReader: ConfigReader,
  config: DiscoveryModuleConfig,
  chainConfigs: DiscoveryChainConfig[],
  logger: Logger,
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

  const { result, blockNumber, providerStats } = await discover(
    paths,
    chainConfigs,
    projectConfig,
    logger,
    configuredBlockNumber,
    http,
    config.overwriteCache,
  )

  const templatesFolder = path.join(paths.discovery, TEMPLATES_PATH)

  await saveDiscoveryResult(result, projectConfig, blockNumber, logger, {
    paths,
    sourcesFolder: config.sourcesFolder,
    flatSourcesFolder: config.flatSourcesFolder,
    discoveryFilename: config.discoveryFilename,
    saveSources: config.saveSources,
    templatesFolder,
  })

  if (config.project.startsWith('shared-')) {
    const allConfigs = configReader.readAllConfigsForChain(config.chain.name)
    const backrefConfigs = allConfigs
      .filter((c) => c.structure.sharedModules.includes(config.project))
      .map((c) => c.structure)
    printSharedModuleInfo(backrefConfigs)
  }

  if (config.printStats) {
    printProviderStats(logger, providerStats)
  }

  const templateService = new TemplateService(paths.discovery)

  printTemplatization(
    logger,
    result,
    !!config.verboseTemplatization,
    templateService,
  )
}

export async function dryRunDiscovery(
  paths: DiscoveryPaths,
  http: HttpClient,
  configReader: ConfigReader,
  config: DiscoveryModuleConfig,
  chainConfigs: DiscoveryChainConfig[],
  logger: Logger,
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
      paths,
      chainConfigs,
      projectConfig,
      blockNumber,
      http,
      config.overwriteCache,
      logger,
    ),
    justDiscover(
      paths,
      chainConfigs,
      projectConfig,
      blockNumberYesterday,
      http,
      config.overwriteCache,
      logger,
    ),
  ])

  const diff = diffDiscovery(discoveredYesterday.entries, discovered.entries)

  if (diff.length > 0) {
    console.log(JSON.stringify(diff, null, 2))
  } else {
    console.log('No changes!')
  }
}

async function justDiscover(
  paths: DiscoveryPaths,
  chainConfigs: DiscoveryChainConfig[],
  config: ConfigRegistry,
  blockNumber: number,
  http: HttpClient,
  overwriteCache: boolean,
  logger: Logger,
): Promise<DiscoveryOutput> {
  const { result } = await discover(
    paths,
    chainConfigs,
    config,
    logger,
    blockNumber,
    http,
    overwriteCache,
  )

  const templateService = new TemplateService(paths.discovery)
  return toDiscoveryOutput(templateService, config, blockNumber, result)
}

export async function discover(
  paths: DiscoveryPaths,
  chainConfigs: DiscoveryChainConfig[],
  config: ConfigRegistry,
  logger: Logger,
  blockNumber: number | undefined,
  http: HttpClient,
  overwriteChache: boolean,
): Promise<{
  result: Analysis[]
  blockNumber: number
  providerStats: AllProviderStats
}> {
  const sqliteCache = new SQLiteCache(paths.cache)

  const cache = overwriteChache
    ? new OverwriteCacheWrapper(sqliteCache)
    : sqliteCache

  const chain = config.structure.chain
  const { allProviders, discoveryEngine } = getDiscoveryEngine(
    paths,
    chainConfigs,
    cache,
    http,
    logger,
    chain,
  )
  blockNumber ??= await allProviders.getLatestBlockNumber(chain)
  const provider = allProviders.get(chain, blockNumber)
  return {
    result: await discoveryEngine.discover(provider, config.structure),
    blockNumber,
    providerStats: allProviders.getStats(chain),
  }
}
