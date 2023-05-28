import {
  diffDiscovery,
  DiscoveryConfig,
  DiscoveryEngine,
  toDiscoveryOutput,
} from '@l2beat/discovery'
import { DiscoveryOutput } from '@l2beat/shared'
import { isEqual } from 'lodash'
import { Gauge, Histogram } from 'prom-client'

export class DiscoveryRunner {
  constructor(private readonly discoveryEngine: DiscoveryEngine) {}

  async run(config: DiscoveryConfig, blockNumber: number) {
    const discovery = await this.discover(config, blockNumber)
    await this.sanityCheck(discovery, config, blockNumber)
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

    return toDiscoveryOutput(config.name, config.hash, blockNumber, result)
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
