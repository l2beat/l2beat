import type { EthereumAddress } from '@l2beat/shared-pure'
import * as z from 'zod'

import type { IProvider } from '../../provider/IProvider'
import type { Handler, HandlerResult } from '../Handler'

export type EventCountHandlerDefinition = z.infer<
  typeof EventCountHandlerDefinition
>
export const EventCountHandlerDefinition = z.strictObject({
  type: z.literal('eventCount'),
  topics: z.array(z.union([z.string(), z.null()])),
})

export class EventCountHandler implements Handler {
  readonly dependencies: string[] = []

  constructor(
    readonly field: string,
    readonly definition: EventCountHandlerDefinition,
  ) {}

  async execute(
    provider: IProvider,
    address: EthereumAddress,
  ): Promise<HandlerResult> {
    const logs = await provider.getLogs(address, this.definition.topics)
    return {
      field: this.field,
      value: logs.length,
    }
  }
}
