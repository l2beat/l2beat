import type { Logger } from '@l2beat/backend-tools'
import type { HttpClient } from '@l2beat/shared'
import { ChainSpecificAddress, UnixTime, unique } from '@l2beat/shared-pure'
import path from 'path'
import type {
  DiscoveryChainConfig,
  DiscoveryModuleConfig,
} from '../config/types'
import { printSharedModuleInfo } from '../utils/printSharedModuleInfo'
import type { Analysis } from './analysis/AddressAnalyzer'
import { TEMPLATES_PATH, TemplateService } from './analysis/TemplateService'
import type { ConfigReader } from './config/ConfigReader'
import type { ConfigRegistry } from './config/ConfigRegistry'
import type { DiscoveryPaths } from './config/getDiscoveryPaths'
import { getDiscoveryEngine } from './getDiscoveryEngine'
import { OverwriteCacheWrapper } from './OverwriteCacheWrapper'
import { diffDiscovery } from './output/diffDiscovery'
import { printTemplatization } from './output/printTemplatization'
import { saveDiscoveryResult } from './output/saveDiscoveryResult'
import { toDiscoveryOutput } from './output/toDiscoveryOutput'
import type { DiscoveryOutput } from './output/types'
import { SQLiteCache } from './provider/SQLiteCache'
import { type AllProviderStats, printProviderStats } from './provider/Stats'

function getTimestamp(
  configReader: ConfigReader,
  config: DiscoveryModuleConfig,
): Date {
  // TODO(radomski): I don't know how to handle discovery on a block with different chains
  if (config.blockNumber !== undefined) {
    throw new Error('Discovery on a block is not supported yet')
    // const provider = new providers.StaticJsonRpcProvider(config.chain.rpcUrl)
    // return UnixTime.toDate(
    //   (await provider.getBlock(config.blockNumber)).timestamp,
    // )
  }

  const configuredTimestamp =
    config.timestamp ??
    (config.dev
      ? configReader.readDiscovery(config.project).timestamp
      : undefined) ??
    UnixTime.now() - UnixTime.MINUTE

  return UnixTime.toDate(configuredTimestamp)
}

export async function runDiscovery(
  paths: DiscoveryPaths,
  http: HttpClient,
  configReader: ConfigReader,
  config: DiscoveryModuleConfig,
  chainConfigs: DiscoveryChainConfig[],
  logger: Logger,
): Promise<void> {
  const projectConfig = configReader.readConfig(config.project)

  const timestampDate = getTimestamp(configReader, config)

  const { result, timestamp, usedBlockNumbers, providerStats } = await discover(
    paths,
    chainConfigs,
    projectConfig,
    logger,
    timestampDate,
    http,
    config.overwriteCache,
  )

  const templatesFolder = path.join(paths.discovery, TEMPLATES_PATH)

  await saveDiscoveryResult(
    result,
    projectConfig,
    timestamp,
    usedBlockNumbers,
    logger,
    {
      paths,
      sourcesFolder: config.sourcesFolder,
      flatSourcesFolder: config.flatSourcesFolder,
      discoveryFilename: config.discoveryFilename,
      saveSources: config.saveSources,
      templatesFolder,
      projectDiscoveryFolder: configReader.getProjectPath(
        projectConfig.structure.name,
      ),
    },
  )

  // TODO(radomski): This is a disaster from the point of view of separation of
  // concerns. We should agree on what even is a shared module and how to
  // handle them cleanly.
  if (config.project.startsWith('shared-')) {
    const allConfigs = configReader
      .readAllDiscoveredProjects()
      .map((p) => configReader.readConfig(p))
    const backrefConfigs = allConfigs
      .filter((c) => c.structure.sharedModules.includes(config.project))
      .map((c) => c.structure)
    printSharedModuleInfo(logger, backrefConfigs)
  }

  if (config.printStats) {
    printProviderStats(logger, providerStats)
  }

  const templateService = new TemplateService(paths.discovery)

  printTemplatization(
    logger,
    result,
    !!config.verboseTemplatization,
    projectConfig.color,
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
  const now = UnixTime.now() - UnixTime.MINUTE
  const yesterday = now - UnixTime.DAY

  const projectConfig = configReader.readConfig(config.project)

  const [discovered, discoveredYesterday] = await Promise.all([
    justDiscover(
      paths,
      chainConfigs,
      projectConfig,
      UnixTime.toDate(now),
      http,
      config.overwriteCache,
      logger,
    ),
    justDiscover(
      paths,
      chainConfigs,
      projectConfig,
      UnixTime.toDate(yesterday),
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
  timestampDate: Date,
  http: HttpClient,
  overwriteCache: boolean,
  logger: Logger,
): Promise<DiscoveryOutput> {
  const { result, timestamp, usedBlockNumbers } = await discover(
    paths,
    chainConfigs,
    config,
    logger,
    timestampDate,
    http,
    overwriteCache,
  )

  const templateService = new TemplateService(paths.discovery)

  return toDiscoveryOutput(
    templateService,
    config,
    timestamp,
    usedBlockNumbers,
    result,
  )
}

export async function discover(
  paths: DiscoveryPaths,
  chainConfigs: DiscoveryChainConfig[],
  config: ConfigRegistry,
  logger: Logger,
  timestampDate: Date | undefined,
  http: HttpClient,
  overwriteCache: boolean,
): Promise<{
  result: Analysis[]
  timestamp: UnixTime
  usedBlockNumbers: Record<string, number>
  providerStats: Record<string, AllProviderStats>
}> {
  const sqliteCache = new SQLiteCache(paths.cache)

  const cache = overwriteCache
    ? new OverwriteCacheWrapper(sqliteCache)
    : sqliteCache

  const { allProviders, discoveryEngine } = getDiscoveryEngine(
    paths,
    chainConfigs,
    cache,
    http,
    logger,
  )
  const timestamp = UnixTime.fromDate(timestampDate ?? new Date())
  const result = await discoveryEngine.discover(
    allProviders,
    config.structure,
    timestamp,
  )
  const chains = unique(
    result.map((c) => ChainSpecificAddress.longChain(c.address)),
  )

  const usedBlockNumbers: Record<string, number> = {}
  for (const chain of chains) {
    const provider = await allProviders.get(chain, timestamp)
    usedBlockNumbers[chain] = provider.blockNumber
  }

  return {
    result,
    timestamp,
    usedBlockNumbers,
    providerStats: allProviders.getStats(),
  }
}
