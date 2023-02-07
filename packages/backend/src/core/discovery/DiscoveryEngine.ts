import { MainnetEtherscanClient } from '@l2beat/shared'
import { providers } from 'ethers'

import { discover } from './discover'
import { DiscoveryConfig } from './DiscoveryConfig'
import { DiscoveryLogger } from './DiscoveryLogger'
import { DiscoveryProvider } from './provider/DiscoveryProvider'
import { parseDiscoveryOutput } from './saveDiscoveryResult'
import { ProjectParameters } from './types'
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
    const discoveryProvider = new DiscoveryProvider(
      this.provider,
      this.etherscanClient,
      blockNumber,
    )

    const discovered = await discover(discoveryProvider, config, this.logger)
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
