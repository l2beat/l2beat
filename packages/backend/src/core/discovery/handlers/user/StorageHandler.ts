import { Bytes, EthereumAddress, HEX_REGEX } from '@l2beat/types'
import * as z from 'zod'

import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import { Handler, HandlerResult } from '../Handler'
import { bytes32ToContractValue } from '../utils/bytes32ToContractValue'

export type StorageHandlerDefinition = z.infer<typeof StorageHandlerDefinition>
export const StorageHandlerDefinition = z.strictObject({
  type: z.literal('storage'),
  slot: z.union([
    z
      .string()
      .regex(HEX_REGEX)
      .transform((x) => Bytes.fromHex(x)),
    z.number(),
  ]),
  returnType: z.optional(z.enum(['address', 'bytes', 'number'])),
})

export class StorageHandler implements Handler {
  static type = 'storage' as const

  constructor(
    readonly field: string,
    private readonly definition: StorageHandlerDefinition,
  ) {}

  async execute(
    provider: DiscoveryProvider,
    address: EthereumAddress,
  ): Promise<HandlerResult> {
    const storage = await provider.getStorage(address, this.definition.slot)
    return {
      field: this.field,
      value: bytes32ToContractValue(
        storage,
        this.definition.returnType ?? 'bytes',
      ),
    }
  }
}
