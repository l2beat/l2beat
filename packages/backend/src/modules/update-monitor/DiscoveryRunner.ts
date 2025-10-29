import { Logger } from '@l2beat/backend-tools'
import {
  type AllProviderStats,
  type AllProviders,
  type Analysis,
  ConfigReader,
  type ConfigRegistry,
  combinePermissionsIntoDiscovery,
  type DiscoveryBlockNumbers,
  type DiscoveryEngine,
  type DiscoveryOutput,
  DiscoveryRegistry,
  flattenDiscoveredSources,
  getDependenciesToDiscoverForProject,
  getDiscoveryPaths,
  modelPermissions,
  ProviderMeasurement,
  type ProviderStats,
  type TemplateService,
  toRawDiscoveryOutput,
} from '@l2beat/discovery'
import {
  assert,
  ChainSpecificAddress,
  UnixTime,
  unique,
  withoutUndefinedKeys,
} from '@l2beat/shared-pure'
import isError from 'lodash/isError'
import { Gauge } from 'prom-client'

export interface DiscoveryRunnerOptions {
  logger: Logger
  maxRetries?: number
  retryDelayMs?: number
}

export interface DiscoveryRunResult {
  discovery: DiscoveryOutput
  flatSources: Record<string, string>
}

export class DiscoveryRunner {
  constructor(
    private readonly allProviders: AllProviders,
    private readonly discoveryEngine: DiscoveryEngine,
    private readonly templateService: TemplateService,
  ) {}

  private async discover(
    projectName: string,
    discoveryTimestamp: number,
    dependentDiscoveries: 'useCurrentTimestamp' | DiscoveryBlockNumbers,
    logger: Logger,
    configReader?: ConfigReader,
  ): Promise<DiscoveryRunResult> {
    logger.info(
      `Attempting discovery of ${projectName} at timestamp ${discoveryTimestamp}`,
    )

    const discoveryPaths = getDiscoveryPaths()
    configReader ??= new ConfigReader(discoveryPaths.discovery)
    const rawConfig = configReader.readRawConfig(projectName)

    let toDiscover: string[] = []
    if (rawConfig.modelCrossChainPermissions) {
      logger.info('Discovering dependencies for cross-chain modelling')
      toDiscover = getDependenciesToDiscoverForProject(
        projectName,
        configReader,
      )
      logger.info('Dependent project:', toDiscover)
      logger.info(
        'Requested dependent block numbers:',
        dependentDiscoveries ?? 'none',
      )
    } else {
      logger.info('Discovering only current project - no cross-chain modelling')
      toDiscover.push(projectName)
    }

    if (dependentDiscoveries !== 'useCurrentTimestamp') {
      // Always default the discovery of current project to discoveryBlockNumber
      dependentDiscoveries[projectName] = {
        timestamp: discoveryTimestamp,
      }
    }

    const discoveries = await this.discoverMany(
      toDiscover,
      dependentDiscoveries,
      configReader,
      logger,
    )

    const metrics = this.allProviders.getStats()
    for (const [chain, chainMetrics] of Object.entries(metrics)) {
      setDiscoveryMetrics(chainMetrics, chain)
    }

    const permissionsOutput = await modelPermissions(
      projectName,
      discoveries,
      configReader,
      this.templateService,
      discoveryPaths,
      { debug: false },
    )
    const projectDiscovery = discoveries.get(projectName)
    combinePermissionsIntoDiscovery(
      projectDiscovery.discoveryOutput,
      permissionsOutput,
    )

    assert(projectDiscovery.analysis)
    // TODO: Should not be here - drop it and use implementation name once it's ready
    // if somebody changes the name and decides to re-colorize
    // then .flat folder will be incorrect
    // Duplicated from saveDiscoveryResult.ts
    const remappedResults = remapNames(
      projectDiscovery.analysis,
      projectDiscovery.discoveryOutput,
    )
    const flatSources = flattenDiscoveredSources(remappedResults, Logger.SILENT)

    return {
      discovery: withoutUndefinedKeys(projectDiscovery.discoveryOutput),
      flatSources,
    }
  }

  private async discoverMany(
    toDiscover: string[],
    dependentDiscoveries: 'useCurrentTimestamp' | DiscoveryBlockNumbers,
    configReader: ConfigReader,
    logger: Logger,
  ) {
    const discoveries = new DiscoveryRegistry()
    for (const dependency of toDiscover) {
      let dependencyTimestamp
      if (dependentDiscoveries === 'useCurrentTimestamp') {
        dependencyTimestamp = UnixTime.now()
      } else {
        dependencyTimestamp = dependentDiscoveries?.[dependency]?.timestamp

        if (dependencyTimestamp === undefined) {
          // We rediscover on the past block number, but with current configs and dependencies.
          // Those dependencies might not have been referenced in the old discovery.
          // In that case we don't fail - the diff will show all those "added".
          logger.info(
            `No block number found for dependency ${dependency}, skipping its rediscovery.`,
          )
          continue
        }
      }

      const dependencyConfig = configReader.readConfig(dependency)
      logger.info(
        `Discovering ${dependencyConfig.name} at timestamp ${dependencyTimestamp}`,
      )
      const analysis = await this.discoveryEngine.discover(
        this.allProviders,
        dependencyConfig.structure,
        dependencyTimestamp,
      )

      const chains = unique(
        analysis.map((c) => ChainSpecificAddress.longChain(c.address)),
      )

      const usedBlockNumbers: Record<string, number> = {}
      for (const chain of chains) {
        const provider = await this.allProviders.get(chain, dependencyTimestamp)
        usedBlockNumbers[chain] = provider.blockNumber
      }

      const discovery = toRawDiscoveryOutput(
        this.templateService,
        dependencyConfig,
        dependencyTimestamp,
        usedBlockNumbers,
        analysis,
      )
      discoveries.set(dependency, discovery, analysis)
    }
    return discoveries
  }

  async run(
    config: ConfigRegistry,
    timestamp: UnixTime,
    logger: Logger,
    dependentDiscoveries?: 'useCurrentTimestamp' | DiscoveryBlockNumbers,
    configReader?: ConfigReader,
  ): Promise<DiscoveryRunResult> {
    try {
      return await this.discover(
        config.name,
        timestamp,
        dependentDiscoveries ?? {},
        logger,
        configReader,
      )
    } catch (error) {
      const err = isError(error)
        ? (error as Error)
        : new Error(JSON.stringify(error))
      const errorString = JSON.stringify(
        err,
        Object.getOwnPropertyNames(err),
        2,
      )

      logger.warn(
        `DiscoveryRunner: Failed to discover ${config.name} - error: ${errorString}`,
      )
      throw err
    }
  }
}

function setDiscoveryMetrics(stats: AllProviderStats, chain: string) {
  setProviderGauge(
    lowLevelProviderCountGauge,
    lowLevelProviderDurationGauge,
    stats.lowLevelMeasurements,
    chain,
  )
  setProviderGauge(
    cacheProviderCountGauge,
    cacheProviderDurationGauge,
    stats.cacheMeasurements,
    chain,
  )
  setProviderGauge(
    highLevelProviderCountGauge,
    highLevelProviderDurationGauge,
    stats.highLevelMeasurements,
    chain,
  )
}

function setProviderGauge(
  countGauge: ProviderGauge,
  durationGauge: ProviderGauge,
  stats: ProviderStats,
  chain: string,
) {
  for (const [key, index] of Object.entries(ProviderMeasurement)) {
    const entry = stats.get(index)
    let avg = 0
    if (entry.durations.length > 0) {
      avg = entry.durations.reduce((acc, v) => acc + v) / entry.durations.length
    }

    countGauge.set({ chain: chain, method: key }, entry.count)
    durationGauge.set({ chain: chain, method: key }, avg)
  }
}

type ProviderGauge = Gauge<'chain' | 'method'>
const lowLevelProviderCountGauge: ProviderGauge = new Gauge({
  name: 'update_monitor_low_level_provider_stats',
  help: 'Low level provider calls done during discovery',
  labelNames: ['chain', 'method'],
})
const lowLevelProviderDurationGauge: ProviderGauge = new Gauge({
  name: 'update_monitor_low_level_provider_duration_stats',
  help: 'Average duration of methods in low level provider calls done during discovery',
  labelNames: ['chain', 'method'],
})

const cacheProviderCountGauge: ProviderGauge = new Gauge({
  name: 'update_monitor_cache_provider_stats',
  help: 'Cache hit counts done during discovery',
  labelNames: ['chain', 'method'],
})
const cacheProviderDurationGauge: ProviderGauge = new Gauge({
  name: 'update_monitor_cache_provider_duration_stats',
  help: 'Average duration of methods when a cache hit occurs during discovery',
  labelNames: ['chain', 'method'],
})

const highLevelProviderCountGauge: ProviderGauge = new Gauge({
  name: 'update_monitor_high_level_provider_stats',
  help: 'High level provider calls done during discovery',
  labelNames: ['chain', 'method'],
})
const highLevelProviderDurationGauge: ProviderGauge = new Gauge({
  name: 'update_monitor_high_level_provider_duration_stats',
  help: 'Average duration of methods in high level provider calls done during discovery',
  labelNames: ['chain', 'method'],
})

function remapNames(
  results: Analysis[],
  discoveryOutput: DiscoveryOutput,
): Analysis[] {
  return results.map((entry) => {
    if (entry.type === 'EOA' || entry.type === 'Reference') {
      return entry
    }

    const matchingEntry = discoveryOutput.entries.find(
      (e) => e.address === entry.address,
    )

    if (!matchingEntry) {
      return entry
    }

    const newName = matchingEntry.name ?? entry.name

    return {
      ...entry,
      name: newName,
    }
  })
}
