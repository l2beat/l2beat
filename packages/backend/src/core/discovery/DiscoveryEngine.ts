import { MainnetEtherscanClient, wrapAndMeasure } from '@l2beat/shared'
import { providers } from 'ethers'
import { Histogram } from 'prom-client'

import { discover } from './discover'
import { DiscoveryConfig } from './DiscoveryConfig'
import { DiscoveryLogger } from './DiscoveryLogger'
import { DiscoveryProvider } from './provider/DiscoveryProvider'
import { parseDiscoveryOutput } from './saveDiscoveryResult'
import { ProjectParameters } from './types'
import { getDiscoveryConfigHash } from './utils/getDiscoveryConfigHash'

const discoveryHistogram = new Histogram({
  name: 'discovery_duration_histogram',
  help: 'Histogram showing discovery duration',
  labelNames: ['project'],
  buckets: [10, 30, 60, 120, 300],
})

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
    const discoveryProvider = new DiscoveryProvider(
      this.provider,
      this.etherscanClient,
      blockNumber,
    )

    const wrappedDiscovery = wrapAndMeasure(
      async () => await discover(discoveryProvider, config, this.logger),
      {
        histogram: discoveryHistogram,
        labels: {
          project: config.name,
        },
      },
    )
    const discovered = await wrappedDiscovery()

    const configHash = getDiscoveryConfigHash(config)

    // TODO: test this line
    return parseDiscoveryOutput(
      discovered,
      config.name,
      blockNumber,
      configHash,
    )
  }
}
