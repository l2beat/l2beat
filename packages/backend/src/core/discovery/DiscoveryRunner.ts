import {
  ConfigReader,
  diffDiscovery,
  DiscoveryConfig,
  DiscoveryEngine,
  DiscoveryProvider,
  toDiscoveryOutput,
} from '@l2beat/discovery'
import type { DiscoveryOutput } from '@l2beat/discovery-types'
import { ChainId } from '@l2beat/shared-pure'
import { assert } from 'console'
import { isEqual, isError } from 'lodash'
import { Gauge, Histogram } from 'prom-client'

export interface DiscoveryRunnerOptions {
  injectInitialAddresses: boolean
  runSanityCheck: boolean
  maxRetries?: number
  retryDelayMs?: number
}

// 10 minutes
const MAX_RETRIES = 30
const RETRY_DELAY_MS = 20_000

export class DiscoveryRunner {
  constructor(
    private readonly discoveryProvider: DiscoveryProvider,
    private readonly discoveryEngine: DiscoveryEngine,
    private readonly configReader: ConfigReader,
    private readonly chainId: ChainId,
  ) {}

  async getBlockNumber(): Promise<number> {
    return this.discoveryProvider.getBlockNumber()
  }

  getChainId(): ChainId {
    return this.chainId
  }

  async run(
    projectConfig: DiscoveryConfig,
    blockNumber: number,
    options: DiscoveryRunnerOptions,
  ) {
    const config = options.injectInitialAddresses
      ? await this.updateInitialAddresses(projectConfig)
      : projectConfig

    const discovery = await this.discoverWithRetry(
      config,
      blockNumber,
      options.maxRetries,
      options.retryDelayMs,
    )

    if (options.runSanityCheck) {
      await this.sanityCheck(discovery, config, blockNumber)
    }

    return discovery
  }

  async discover(
    config: DiscoveryConfig,
    blockNumber: number,
  ): Promise<DiscoveryOutput> {
    const histogramDone = syncHistogram.startTimer()

    const result = await this.discoveryEngine.discover(config, blockNumber)

    histogramDone({ project: config.name })
    latestBlock.set({ project: config.name }, blockNumber)

    return toDiscoveryOutput(
      config.name,
      config.chainId,
      config.hash,
      blockNumber,
      result,
    )
  }

  async discoverWithRetry(
    config: DiscoveryConfig,
    blockNumber: number,
    maxRetries = MAX_RETRIES,
    delayMs = RETRY_DELAY_MS,
  ): Promise<DiscoveryOutput> {
    let discovery: DiscoveryOutput | undefined = undefined
    let err: Error | undefined = undefined

    for (let i = 0; i <= maxRetries; i++) {
      try {
        discovery = await this.discover(config, blockNumber)
        break
      } catch (error) {
        err = isError(err) ? (error as Error) : new Error(JSON.stringify(error))
      }

      console.log(
        `DiscoveryRunner: Retrying ${config.name} (chain: ${ChainId.getName(
          config.chainId,
        )}) | attempt:${i}`,
      )
      await new Promise((resolve) => setTimeout(resolve, delayMs))
    }

    if (discovery === undefined) {
      assert(
        err !== undefined,
        'Programmer error: Error should not be undefined there',
      )
      throw err
    }

    return discovery
  }

  // 3rd party APIs are unstable, so we do a sanity check before sending
  // notifications, which makes the same request again and compares the
  // results.
  async sanityCheck(
    discovery: DiscoveryOutput,
    projectConfig: DiscoveryConfig,
    blockNumber: number,
  ) {
    const secondDiscovery = await this.discover(projectConfig, blockNumber)

    if (!isEqual(discovery, secondDiscovery)) {
      const diff = diffDiscovery(
        discovery.contracts,
        secondDiscovery.contracts,
        projectConfig,
      )
      throw new Error(
        `[${projectConfig.name}] Sanity check failed | ${blockNumber}\n
        potential-diff ${JSON.stringify(diff)}}`,
      )
    }
  }

  // There was a case connected with Amarok (better described in L2B-1521)
  // the problem was with stack too deep in the discovery caused by misconfigured new contract
  // that had a lot of relatives (e.g. Uniswap, DAI)
  // unfortunately, it resulted in not discovering important contracts because they cannot be put on the stack
  // this function ensures that initial addresses are taken from discovered.json
  // so this way we will always discover "known" contracts
  async updateInitialAddresses(config: DiscoveryConfig) {
    const discovery = await this.configReader.readDiscovery(
      config.name,
      ChainId.ETHEREUM,
    )
    const initialAddresses = discovery.contracts.map((c) => c.address)
    return new DiscoveryConfig({
      ...config.raw,
      initialAddresses,
    })
  }
}

const latestBlock = new Gauge({
  name: 'discovery_last_synced',
  help: 'Value showing latest block number with which UpdateMonitor was run',
  labelNames: ['project'],
})

const syncHistogram = new Histogram({
  name: 'discovery_sync_duration_histogram',
  help: 'Histogram showing discovery duration',
  labelNames: ['project'],
  buckets: [2, 4, 6, 8, 10, 15, 20, 30, 60, 120],
})
