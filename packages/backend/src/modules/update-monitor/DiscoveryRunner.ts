import { Logger } from '@l2beat/backend-tools'
import {
  type AllProviderStats,
  type AllProviders,
  type Analysis,
  ConfigReader,
  type ConfigRegistry,
  type DiscoveryBlockNumbers,
  type DiscoveryEngine,
  type DiscoveryOutput,
  DiscoveryRegistry,
  ProviderMeasurement,
  type ProviderStats,
  type TemplateService,
  combinePermissionsIntoDiscovery,
  flattenDiscoveredSources,
  getDependenciesToDiscoverForProject,
  getDiscoveryPaths,
  modelPermissions,
  toRawDiscoveryOutput,
} from '@l2beat/discovery'
import { assert, withoutUndefinedKeys } from '@l2beat/shared-pure'
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

// 10 minutes
const MAX_RETRIES = 30
const RETRY_DELAY_MS = 20_000

export class DiscoveryRunner {
  constructor(
    private readonly allProviders: AllProviders,
    private readonly discoveryEngine: DiscoveryEngine,
    private readonly templateService: TemplateService,
    readonly chain: string,
  ) {}

  async getBlockNumber(): Promise<number> {
    return await this.allProviders.getLatestBlockNumber(this.chain)
  }

  private async discover(
    projectName: string,
    projectChain: string,
    discoveryBlockNumber: number,
    dependentDiscoveries: DiscoveryBlockNumbers = {},
    configReader?: ConfigReader,
  ): Promise<DiscoveryRunResult> {
    const discoveryPaths = getDiscoveryPaths()
    configReader ??= new ConfigReader(discoveryPaths.discovery)
    const rawConfig = configReader.readRawConfig(projectName)

    let toDiscover: { project: string; chain: string }[] = []
    if (rawConfig.modelCrossChainPermissions) {
      toDiscover = getDependenciesToDiscoverForProject(
        projectName,
        configReader,
      )
    } else {
      toDiscover.push({ project: projectName, chain: projectChain })
    }

    // Always default the discovery of current project to discoveryBlockNumber
    dependentDiscoveries[projectName] ??= {}
    dependentDiscoveries[projectName][projectChain] ??= {
      blockNumber: discoveryBlockNumber,
    }

    const discoveries = await this.discoverMany(
      toDiscover,
      dependentDiscoveries,
      configReader,
    )

    setDiscoveryMetrics(this.allProviders.getStats(projectChain), projectChain)

    const permissionsOutput = await modelPermissions(
      projectName,
      discoveries,
      configReader,
      this.templateService,
      discoveryPaths,
      { debug: false },
    )
    const projectDiscovery = discoveries.get(projectName, projectChain)
    combinePermissionsIntoDiscovery(
      projectDiscovery.discoveryOutput,
      permissionsOutput,
    )

    // TODO: Should not be here - drop it and use implementation name once it's ready
    // if somebody changes the name and decides to re-colorize
    // then .flat folder will be incorrect
    // Duplicated from saveDiscoveryResult.ts
    if (projectDiscovery.analysis === undefined) {
      throw new Error(
        `Discovery for ${projectName} on ${projectChain} has no analysis.`,
      )
    }
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
    toDiscover: { project: string; chain: string }[],
    dependentDiscoveries: DiscoveryBlockNumbers | undefined,
    configReader: ConfigReader,
  ) {
    const discoveries = new DiscoveryRegistry()
    for (const dependency of toDiscover) {
      const dependencyBlockNumber =
        dependentDiscoveries?.[dependency.project]?.[dependency.chain]
          ?.blockNumber

      if (dependencyBlockNumber === undefined) {
        // We rediscover on the past block number, but with current configs and dependencies.
        // Those dependencies might not have been referenced in the old discovery.
        // In that case we don't fail - the diff will show all those "added".
        console.log(
          `No block number found for dependency ${dependency.project} on ${dependency.chain}, skipping its rediscovery.`,
        )
        continue
      }
      const dependencyConfig = configReader.readConfig(
        dependency.project,
        dependency.chain,
      )
      const provider = this.allProviders.get(
        dependency.chain,
        dependencyBlockNumber,
      )
      const analysis = await this.discoveryEngine.discover(
        provider,
        dependencyConfig.structure,
      )
      const discovery = toRawDiscoveryOutput(
        this.templateService,
        dependencyConfig,
        dependencyBlockNumber,
        analysis,
      )
      discoveries.set(dependency.project, dependency.chain, discovery, analysis)
    }
    return discoveries
  }

  async discoverWithRetry(
    config: ConfigRegistry,
    blockNumber: number,
    logger: Logger,
    maxRetries = MAX_RETRIES,
    delayMs = RETRY_DELAY_MS,
    dependentDiscoveries?: DiscoveryBlockNumbers,
    configReader?: ConfigReader,
  ): Promise<DiscoveryRunResult> {
    let result: DiscoveryRunResult | undefined = undefined
    let err: Error | undefined = undefined

    for (let i = 0; i <= maxRetries; i++) {
      try {
        result = await this.discover(
          config.name,
          config.chain,
          blockNumber,
          dependentDiscoveries,
          configReader,
        )
        break
      } catch (error) {
        err = isError(err) ? (error as Error) : new Error(JSON.stringify(error))
      }

      const errorString = JSON.stringify(
        err,
        Object.getOwnPropertyNames(err),
        2,
      )
      logger.warn(
        `DiscoveryRunner: Retrying ${config.name} (chain: ${config.chain}) | attempt:${i} | error:${errorString}`,
      )
      await new Promise((resolve) => setTimeout(resolve, delayMs))
    }

    if (result?.discovery === undefined) {
      assert(
        err !== undefined,
        'Programmer error: Error should not be undefined there',
      )
      throw err
    }

    return result
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
    if (entry.type === 'EOA') {
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
