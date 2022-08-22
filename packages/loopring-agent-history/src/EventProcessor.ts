import { AddressAnalyzer } from '@l2beat/common'
import { EthereumAddress } from '@l2beat/types'
import { Contract, Event, providers } from 'ethers'

import { BlockTimestampService } from './BlockTimestampService'

export class EventProcessor {
  constructor(
    private blockTimestampService: BlockTimestampService,
    private addressAnalyzer: AddressAnalyzer,
    private provider: providers.Provider,
  ) {}

  //TODO: Add cache !

  async processEvent(event: Event) {
    let implOfProxyName = ''
    const agent = EthereumAddress(event.args?.agent as string)
    const [timestamp, implementationName] = await Promise.all([
      this.blockTimestampService.getBlockTimestamp(event.blockNumber),
      this.addressAnalyzer.getName(agent),
    ])
    if (implementationName === 'OwnedUpgradabilityProxy') {
      const implContract = new Contract(
        agent.toString(),
        ['function implementation() view returns (address)'],
        this.provider,
      )
      const implementationAddress = EthereumAddress(
        (await implContract.functions.implementation()) as string,
      )
      implOfProxyName = await this.addressAnalyzer.getName(
        implementationAddress,
      )
    }
    return {
      blockNumber: event.blockNumber,
      transactionHash: event.transactionHash,
      user: event.args?.user as string,
      agent,
      timestamp,
      implementationName,
      implOfProxyName,
    }
  }
}
