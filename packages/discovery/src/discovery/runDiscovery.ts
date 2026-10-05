import type { Logger } from '@l2beat/backend-tools'
import type { HttpClient } from '@l2beat/shared'
import { ChainSpecificAddress, UnixTime, unique } from '@l2beat/shared-pure'
import chalk from 'chalk'
import path from 'path'
import type {
  DiscoveryChainConfig,
  DiscoveryModuleConfig,
} from '../config/types'
import {
  findEntrypointConsumers,
  ownsEntrypoints,
  printEntrypointConsumers,
} from '../utils/printEntrypointConsumers'
import type { Analysis } from './analysis/AddressAnalyzer'
import { TEMPLATES_PATH, TemplateService } from './analysis/TemplateService'
import type { ConfigReader } from './config/ConfigReader'
import type { ConfigRegistry } from './config/ConfigRegistry'
import type { DiscoveryPaths } from './config/getDiscoveryPaths'
import type { StructureConfig } from './config/StructureConfig'
import { makeEntryStructureConfig } from './config/structureUtils'
import type { AddressStats } from './engine/DiscoveryEngine'
import { getDiscoveryEngine } from './getDiscoveryEngine'
import { HandlerExecutor } from './handlers/HandlerExecutor'
import { OverwriteCacheWrapper } from './OverwriteCacheWrapper'
import { diffDiscovery } from './output/diffDiscovery'
import { printTemplatization } from './output/printTemplatization'
import { saveDiscoveryResult } from './output/saveDiscoveryResult'
import { toDiscoveryOutput } from './output/toDiscoveryOutput'
import type { DiscoveryOutput } from './output/types'
import type { AllProviders } from './provider/AllProviders'
import type { DiscoveryCache } from './provider/DiscoveryCache'
import { SQLiteCache } from './provider/SQLiteCache'
import { type AllProviderStats, printProviderStats } from './provider/Stats'
import {
  gatherRequest,
  Templatizer,
  type TemplatizerSettings,
} from './templatizer/Templatizer'
import { getTemplatizerSettings } from './templatizer/templatizerSettings'

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

  const { result, timestamp, usedBlockNumbers, providerStats, addressStats } =
    await discover(
      paths,
      chainConfigs,
      projectConfig,
      logger,
      timestampDate,
      http,
      config.overwriteCache,
      await getTemplatizerSettings(config, paths, configReader),
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

  if (ownsEntrypoints(projectConfig.structure)) {
    printEntrypointConsumers(
      logger,
      findEntrypointConsumers(configReader, config.project),
    )
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

  if (addressStats.skipped > 0) {
    printMaxAddressesWarning(
      logger,
      addressStats.skipped,
      projectConfig.structure.maxAddresses,
    )
  }
}

function printMaxAddressesWarning(
  logger: Logger,
  skipped: number,
  maxAddresses: number,
) {
  const lines = [
    '  ⚠  WARNING — DISCOVERY IS INCOMPLETE  ⚠  ',
    '',
    `  maxAddresses limit reached: ${skipped} address${skipped === 1 ? '' : 'es'} were SKIPPED.`,
    '  These addresses were NOT analyzed and are MISSING from discovered.json.',
    '',
    `  FIX: raise "maxAddresses" (currently ${maxAddresses}) in the project config,`,
    '       then re-run discovery.',
  ]
  const width = lines.reduce((max, l) => Math.max(max, l.length), 0)
  const padded = lines.map((l) => ' ' + l.padEnd(width) + ' ')
  const blank = ' '.repeat(width + 2)
  const banner = [blank, ...padded, blank].map((l) => chalk.bgRed.white.bold(l))
  logger.info('')
  for (const line of banner) {
    logger.info(line)
  }
  logger.info('')
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
  templatizerSettings?: TemplatizerSettings,
): Promise<{
  result: Analysis[]
  timestamp: UnixTime
  usedBlockNumbers: Record<string, number>
  providerStats: Record<string, AllProviderStats>
  addressStats: AddressStats
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
  const discovered = await discoveryEngine.discover(
    allProviders,
    config.structure,
    timestamp,
  )
  const { analyses: result, stats: addressStats } =
    templatizerSettings === undefined
      ? discovered
      : await templatizeAndRediscover(discovered, {
          paths,
          chainConfigs,
          cache,
          http,
          logger,
          allProviders,
          structure: config.structure,
          timestamp,
          settings: templatizerSettings,
        })
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
    addressStats,
  }
}

interface TemplatizeContext {
  paths: DiscoveryPaths
  chainConfigs: DiscoveryChainConfig[]
  cache: DiscoveryCache
  http: HttpClient
  logger: Logger
  allProviders: AllProviders
  structure: StructureConfig
  timestamp: UnixTime
  settings: TemplatizerSettings
}

/**
 * `--ai`: the templatizer runs over what discovery found, and discovery
 * runs again with what it wrote, until a pass writes nothing. Another run
 * is needed because a new template changes the values of every contract it
 * matches, and its address fields can reach contracts discovery has not
 * seen yet. The reruns read the RPC cache the first run filled.
 */
async function templatizeAndRediscover(
  first: { analyses: Analysis[]; stats: AddressStats },
  context: TemplatizeContext,
): Promise<{ analyses: Analysis[]; stats: AddressStats }> {
  const { paths, chainConfigs, cache, http, logger, allProviders } = context
  const templatizer = new Templatizer(
    new TemplateService(paths.discovery),
    new HandlerExecutor(),
    context.settings,
    logger.for('Templatizer'),
  )
  const requestFor = async (address: ChainSpecificAddress) =>
    gatherRequest(
      await allProviders.get(
        ChainSpecificAddress.longChain(address),
        context.timestamp,
      ),
      address,
      makeEntryStructureConfig(context.structure, address),
    )
  let discovered = first
  while (
    await templatizer.templatizeDiscovered(discovered.analyses, requestFor)
  ) {
    logger.info('Templatizer wrote templates; discovering again to apply them')
    // A new engine, because the first one loaded the templates as they were.
    const { discoveryEngine } = getDiscoveryEngine(
      paths,
      chainConfigs,
      cache,
      http,
      logger,
    )
    discovered = await discoveryEngine.discover(
      allProviders,
      context.structure,
      context.timestamp,
    )
  }
  return discovered
}
