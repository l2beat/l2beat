import { DiscoveryOutput } from '@l2beat/shared'
import { Gauge, Histogram } from 'prom-client'

import { DiscoveryConfig } from './config/DiscoveryConfig'
import { DiscoveryEngine } from './engine/DiscoveryEngine'
import { toDiscoveryOutput } from './output/toDiscoveryOutput'

export class DiscoveryRunner {
  constructor(private readonly discoveryEngine: DiscoveryEngine) {}

  async run(
    config: DiscoveryConfig,
    blockNumber: number,
  ): Promise<DiscoveryOutput> {
    const histogramDone = syncHistogram.startTimer()

    const result = await this.discoveryEngine.discover(config, blockNumber)

    histogramDone({ project: config.name })
    latestBlock.set({ project: config.name }, blockNumber)

    return toDiscoveryOutput(config.name, config.hash, blockNumber, result)
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
