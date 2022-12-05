import { EthereumAddress } from '@l2beat/types'
import * as z from 'zod'

import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import { Handler, HandlerResult } from '../Handler'

export type ArrayHandlerDefinition = z.infer<typeof ArrayHandlerDefinition>
export const ArrayHandlerDefinition = z.strictObject({
  type: z.literal('array'),
})

export class ArrayHandler implements Handler {
  constructor(
    readonly field: string,
    private readonly _definition: ArrayHandlerDefinition,
  ) {}

  async execute(
    _provider: DiscoveryProvider,
    _address: EthereumAddress,
  ): Promise<HandlerResult> {
    return Promise.resolve({
      field: this.field,
      value: [],
    })
  }
}
