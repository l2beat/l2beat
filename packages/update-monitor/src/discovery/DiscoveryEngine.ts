import { AddressAnalyzer } from '@l2beat/common'
import { providers } from 'ethers'

import { DiscoveryOptions } from './DiscoveryOptions'
import { walkConfig } from './walkConfig'

export class DiscoveryEngine {
  constructor(
    private provider: providers.Provider,
    private addressAnalyzer: AddressAnalyzer,
  ) {}

  async analyze(addresses: string[], options: Partial<DiscoveryOptions> = {}) {
    await walkConfig(this.provider, this.addressAnalyzer, addresses, {
      skipAddresses: [],
      skipMethods: {},
      ...options,
    })
  }
}
