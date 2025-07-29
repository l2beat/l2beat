import type { Logger } from '@l2beat/backend-tools'
import type { HttpClient } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { providers } from 'ethers'
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

async function getTimestamp(
  configReader: ConfigReader,
  config: DiscoveryModuleConfig,
): Promise<Date> {
  if (config.blockNumber !== undefined) {
    const provider = new providers.StaticJsonRpcProvider(config.chain.rpcUrl)
    return UnixTime.toDate(
      (await provider.getBlock(config.blockNumber)).timestamp,
    )
  }

  const configuredTimestamp =
    config.timestamp ??
    (config.dev
      ? configReader.readDiscovery(config.project, config.chain.name).timestamp
      : undefined) ??
    UnixTime.now()

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
  const projectConfig = configReader.readConfig(
    config.project,
    config.chain.name,
  )

  const timestampDate = await getTimestamp(configReader, config)

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
      projectDiscoveryFolder: configReader.getProjectChainPath(
        projectConfig.structure.name,
        projectConfig.structure.chain,
      ),
    },
  )

  // TODO(radomski): This is a disaster from the point of view of separation of
  // concerns. We should agree on what even is a shared module and how to
  // handle them cleanly.
  if (config.project.startsWith('shared-')) {
    const allConfigs = configReader.readAllDiscoveredConfigsForChain(
      config.chain.name,
    )
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
  const now = UnixTime.now()
  const yesterday = now - UnixTime.DAY

  const projectConfig = configReader.readConfig(
    config.project,
    config.chain.name,
  )

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
  overwriteChache: boolean,
): Promise<{
  result: Analysis[]
  timestamp: UnixTime
  usedBlockNumbers: Record<string, number>
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
  const timestamp = UnixTime.fromDate(timestampDate ?? new Date())
  const provider = await allProviders.get(chain, timestamp)
  return {
    result: await discoveryEngine.discover(provider, config.structure),
    timestamp,
    usedBlockNumbers: { [chain]: provider.blockNumber },
    providerStats: allProviders.getStats(chain),
  }
}
