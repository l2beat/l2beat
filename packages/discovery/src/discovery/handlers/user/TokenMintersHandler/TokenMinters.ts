import type { ChainSpecificAddress } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import type { IProvider } from '../../../provider/IProvider'
import type { Handler, HandlerResult } from '../../Handler'
import { getYieldFiMinters } from './yield-fi'

export type TokenMintersDefinition = v.infer<typeof TokenMintersDefinition>
export const TokenMintersDefinition = v.strictObject({
  type: v.literal('minters'),
  kind: v.literal('yieldfi'),
  permissionlessMinting: v.boolean().optional(),
})

export class TokenMintersHandler implements Handler {
  readonly dependencies: string[] = []

  constructor(
    readonly field: string,
    readonly definition: TokenMintersDefinition,
    readonly abi: string[],
  ) {}

  async execute(
    provider: IProvider,
    token: ChainSpecificAddress,
  ): Promise<HandlerResult> {
    // TODO: to handle based on the kind
    const minters = await getYieldFiMinters(
      provider,
      token,
      this.field,
      this.abi,
    )

    return {
      field: '$minters',
      value: {
        members: minters,
        permissionlessMinting: this.definition.permissionlessMinting,
      },
    }
  }
}
