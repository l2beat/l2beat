import { v } from '@l2beat/validate'

import type { Handler, HandlerResult } from '../Handler'

export type HardCodedDefinition = v.infer<typeof HardCodedDefinition>
export const HardCodedDefinition = v.strictObject({
  type: v.literal('hardcoded'),
  value: v.unknown(),
})

export class HardCodedHandler implements Handler {
  readonly dependencies: string[] = []

  constructor(
    readonly field: string,
    private readonly definition: HardCodedDefinition,
  ) {}

  execute(): Promise<HandlerResult> {
    return Promise.resolve({
      field: this.field,
      // biome-ignore lint/suspicious/noExplicitAny: it's fine
      value: this.definition.value as any,
    })
  }
}
