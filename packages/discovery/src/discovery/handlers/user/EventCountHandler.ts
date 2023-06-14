import { EthereumAddress } from '@l2beat/shared-pure'
import * as z from 'zod'

import { DiscoveryLogger } from '../../DiscoveryLogger'
import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import { Handler, HandlerResult } from '../Handler'

export type EventCountHandlerDefinition = z.infer<
  typeof EventCountHandlerDefinition
>
export const EventCountHandlerDefinition = z.strictObject({
  type: z.literal('eventCount'),
  topics: z.array(z.string()),
})

export class EventCountHandler implements Handler {
  readonly dependencies: string[] = []

  constructor(
    readonly field: string,
    readonly definition: EventCountHandlerDefinition,
    readonly logger: DiscoveryLogger,
  ) {}

  async execute(
    provider: DiscoveryProvider,
    address: EthereumAddress,
    blockNumber: number,
  ): Promise<HandlerResult> {
    this.logger.logExecution(this.field, [`Counting events`])
    const logs = await provider.getLogs(
      address,
      this.definition.topics,
      0,
      blockNumber,
    )

    return {
      field: this.field,
      value: logs.length,
    }
  }
}
