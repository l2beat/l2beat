import { MainnetEtherscanClient } from '@l2beat/common'
import { providers } from 'ethers'

import { AnalyzedData } from './analyzeItem'
import { discover } from './discover'
import { DiscoveryConfig } from './DiscoveryConfig'
import { DiscoveryLogger } from './DiscoveryLogger'
import { DiscoveryProvider } from './provider/DiscoveryProvider'

export class DiscoveryEngine {
  constructor(
    private readonly provider: providers.AlchemyProvider,
    private readonly etherscanClient: MainnetEtherscanClient,
    private readonly logger: DiscoveryLogger,
  ) {}

  async run(
    config: DiscoveryConfig,
    blockNumber: number,
  ): Promise<AnalyzedData[]> {
    const discoveryProvider = new DiscoveryProvider(
      this.provider,
      this.etherscanClient,
      blockNumber,
    )

    return discover(discoveryProvider, config, this.logger)
  }
}
