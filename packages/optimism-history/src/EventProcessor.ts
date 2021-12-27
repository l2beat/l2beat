import { AddressAnalyzer } from '@l2beat/common'
import { Event } from 'ethers'

import { BlockTimestampService } from './BlockTimestampService'
import { OptimismNameService } from './OptimismNameService'

export class EventProcessor {
  constructor(
    private blockTimestampService: BlockTimestampService,
    private optimismNameService: OptimismNameService,
    private addressAnalyzer: AddressAnalyzer
  ) {}

  async processEvent(event: Event) {
    const [timestamp, name, implementationName] = await Promise.all([
      this.blockTimestampService.getBlockTimestamp(event.blockNumber),
      this.optimismNameService.getOptimismName(
        event.args?.name.hash,
        event.transactionHash
      ),
      this.addressAnalyzer.getName(event.args?.newAddress),
    ])
    return {
      blockNumber: event.blockNumber,
      transactionHash: event.transactionHash,
      nameHash: event.args?.name.hash as string,
      oldAddress: event.args?.oldAddress as string,
      newAddress: event.args?.newAddress as string,
      timestamp,
      name,
      implementationName,
    }
  }
}
