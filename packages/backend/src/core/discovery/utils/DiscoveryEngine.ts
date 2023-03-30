import { MainnetEtherscanClient, ProjectParameters } from '@l2beat/shared'
import { providers } from 'ethers'
import { Gauge, Histogram } from 'prom-client'

import { DiscoveryConfig } from '../config/DiscoveryConfig'
import { discover } from '../discover'
import { DiscoveryProvider } from '../provider/DiscoveryProvider'
import { DiscoveryLogger } from './DiscoveryLogger'
import { parseDiscoveryOutput } from './saveDiscoveryResult'

export class DiscoveryEngine {
  constructor(
    private readonly provider: providers.AlchemyProvider,
    private readonly etherscanClient: MainnetEtherscanClient,
    private readonly logger: DiscoveryLogger,
  ) {}

  async run(
    config: DiscoveryConfig,
    blockNumber: number,
  ): Promise<ProjectParameters> {
    const metricsDone = initMetrics()

    const discoveryProvider = new DiscoveryProvider(
      this.provider,
      this.etherscanClient,
      blockNumber,
    )

    const discovered = await discover(discoveryProvider, config, this.logger)

    metricsDone({ project: config.name }, blockNumber)

    // TODO: test this line
    return parseDiscoveryOutput(discovered, config, blockNumber, config.hash)
  }
}

const latestBlock = new Gauge({
  name: 'discovery_last_synced',
  help: 'Value showing latest block number with which DiscoveryWatcher was run',
  labelNames: ['project'],
})

const syncHistogram = new Histogram({
  name: 'discovery_sync_duration_histogram',
  help: 'Histogram showing discovery duration',
  labelNames: ['project'],
  buckets: [2, 4, 6, 8, 10, 15, 20, 30, 60, 120],
})

function initMetrics(): (
  labels: { project: string },
  blockNumber: number,
) => void {
  const histogramDone = syncHistogram.startTimer()

  return (labels, blockNumber) => {
    histogramDone(labels)
    latestBlock.set(labels, blockNumber)
  }
}
