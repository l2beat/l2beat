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

  // eslint-disable-next-line @typescript-eslint/require-await
  async execute(): Promise<HandlerResult> {
    return {
      field: this.field,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      value: this.definition.value,
    }
  }
}
