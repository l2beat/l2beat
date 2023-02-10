import { MainnetEtherscanClient, ProjectParameters } from '@l2beat/shared'
import { providers } from 'ethers'
import { Gauge, Histogram } from 'prom-client'

import { discover } from './discover'
import { DiscoveryConfig } from './DiscoveryConfig'
import { DiscoveryLogger } from './DiscoveryLogger'
import { DiscoveryProvider } from './provider/DiscoveryProvider'
import { parseDiscoveryOutput } from './saveDiscoveryResult'
import { getDiscoveryConfigHash } from './utils/getDiscoveryConfigHash'

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

    const configHash = getDiscoveryConfigHash(config)

    metricsDone({ project: config.name })

    // TODO: test this line
    return parseDiscoveryOutput(
      discovered,
      config.name,
      blockNumber,
      configHash,
    )
  }
}

const syncHistogram = new Histogram({
  name: 'discovery_sync_duration_histogram',
  help: 'Histogram showing discovery duration',
  labelNames: ['project'],
  buckets: [2, 4, 6, 8, 10, 15, 20, 30, 60, 120],
})

const syncDuration = new Gauge({
  name: 'discovery_sync_duration',
  help: 'Value showing how long does it take to sync all the projects',
  labelNames: ['project'],
})

function initMetrics(): (labels: { project: string }) => void {
  const syncDone = syncDuration.startTimer()
  const histogramDone = syncHistogram.startTimer()

  return (labels) => {
    syncDone(labels)
    histogramDone(labels)
  }
}
