import { AddressAnalyzer } from '@l2beat/common'
import { Contract, Event, providers } from 'ethers'

import { BlockTimestampService } from './BlockTimestampService'

export class EventProcessor {
  constructor(
    private blockTimestampService: BlockTimestampService,
    private addressAnalyzer: AddressAnalyzer,
    private provider: providers.Provider
  ) {}

  //TODO: Add cache !

  async processEvent(event: Event) {
    let implOfProxyName = ''
    const [timestamp, implementationName] = await Promise.all([
      this.blockTimestampService.getBlockTimestamp(event.blockNumber),
      this.addressAnalyzer.getName(event.args?.agent),
    ])
    if (implementationName === 'OwnedUpgradabilityProxy') {
      const implContract = new Contract(
        event.args?.agent,
        ['function implementation() view returns (address)'],
        this.provider
      )
      const implementationAddress = await implContract.implementation()
      implOfProxyName = await this.addressAnalyzer.getName(
        implementationAddress
      )
    }
    return {
      blockNumber: event.blockNumber,
      transactionHash: event.transactionHash,
      user: event.args?.user as string,
      agent: event.args?.agent as string,
      timestamp,
      implementationName,
      implOfProxyName,
    }
  }
}
