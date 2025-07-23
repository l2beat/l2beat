import type { ChainSpecificAddress } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'

import type { IProvider } from '../../provider/IProvider'
import type { Handler, HandlerResult } from '../Handler'

export type EventCountHandlerDefinition = v.infer<
  typeof EventCountHandlerDefinition
>
export const EventCountHandlerDefinition = v.strictObject({
  type: v.literal('eventCount'),
  topics: v.array(v.union([v.string(), v.null()])),
})

export class EventCountHandler implements Handler {
  readonly dependencies: string[] = []

  constructor(
    readonly field: string,
    readonly definition: EventCountHandlerDefinition,
  ) {}

  async execute(
    provider: IProvider,
    address: ChainSpecificAddress,
  ): Promise<HandlerResult> {
    const logs = await provider.getLogs(address, this.definition.topics)
    return {
      field: this.field,
      value: logs.length,
    }
  }
}
