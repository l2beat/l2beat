import { Logger } from '@l2beat/backend-tools'
import {
  type AllProviders,
  type ConfigRegistry,
  type DiscoveryEngine,
  type DiscoveryOutput,
  type TemplateService,
  combinePermissionsIntoDiscovery,
  flattenDiscoveredSources,
  getDiscoveryPaths,
  modelPermissionsForIsolatedDiscovery,
  toRawDiscoveryOutput,
} from '@l2beat/discovery'
import type { Analysis } from '@l2beat/discovery'
import {
  type AllProviderStats,
  ProviderMeasurement,
  type ProviderStats,
} from '@l2beat/discovery'
import { assert } from '@l2beat/shared-pure'
import { isError } from 'lodash'
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
    config: ConfigRegistry,
    blockNumber: number,
  ): Promise<DiscoveryRunResult> {
    const provider = this.allProviders.get(config.chain, blockNumber)
    const result = await this.discoveryEngine.discover(
      provider,
      config.structure,
    )

    setDiscoveryMetrics(this.allProviders.getStats(config.chain), config.chain)

    const discovery = toRawDiscoveryOutput(
      this.templateService,
      config,
      blockNumber,
      result,
    )

    // This is a temporary solution to model project in isolation
    // until we refactor Update Monitor to support cross-chain discovery
    const discoveryPaths = getDiscoveryPaths()
    const permissionsOutput = await modelPermissionsForIsolatedDiscovery(
      discovery,
      config.permission,
      this.templateService,
      discoveryPaths,
    )
    combinePermissionsIntoDiscovery(discovery, permissionsOutput)

    // TODO: Should not be here - drop it and use implementation name once it's ready
    // if somebody changes the name and decides to re-colorize
    // then .flat folder will be incorrect
    // Duplicated from saveDiscoveryResult.ts
    const remappedResults = remapNames(result, discovery)
    const flatSources = flattenDiscoveredSources(remappedResults, Logger.SILENT)

    return { discovery: withoutUndefinedKeys(discovery), flatSources }
  }

  async discoverWithRetry(
    config: ConfigRegistry,
    blockNumber: number,
    logger: Logger,
    maxRetries = MAX_RETRIES,
    delayMs = RETRY_DELAY_MS,
  ): Promise<DiscoveryRunResult> {
    let result: DiscoveryRunResult | undefined = undefined
    let err: Error | undefined = undefined

    for (let i = 0; i <= maxRetries; i++) {
      try {
        result = await this.discover(config, blockNumber)
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

function withoutUndefinedKeys<T extends object>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T
}

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
