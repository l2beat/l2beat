import { z } from 'zod'

import { DiscoveryLogger } from '../../DiscoveryLogger'
import { Handler, HandlerResult } from '../Handler'

export type HardCodedDefinition = z.infer<typeof HardCodedDefinition>
export const HardCodedDefinition = z.strictObject({
  type: z.literal('hardcoded'),
  value: z.any(),
})

export class HardCodedHandler implements Handler {
  readonly dependencies: string[] = []

  constructor(
    readonly field: string,
    private readonly definition: HardCodedDefinition,
    readonly logger: DiscoveryLogger,
  ) {}

  execute(): Promise<HandlerResult> {
    return Promise.resolve({
      field: this.field,
      value: this.definition.value,
    })
  }
}
