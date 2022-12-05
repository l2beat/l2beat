import { getErrorMessage } from '@l2beat/common'
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
  constructor(
    readonly field: string,
    private readonly definition: StorageHandlerDefinition,
  ) {}

  async execute(
    provider: DiscoveryProvider,
    address: EthereumAddress,
  ): Promise<HandlerResult> {
    let storage: Bytes
    try {
      storage = await provider.getStorage(address, this.definition.slot)
    } catch (e) {
      return { field: this.field, error: getErrorMessage(e) }
    }
    return {
      field: this.field,
      value: bytes32ToContractValue(
        storage,
        this.definition.returnType ?? 'bytes',
      ),
    }
  }
}
