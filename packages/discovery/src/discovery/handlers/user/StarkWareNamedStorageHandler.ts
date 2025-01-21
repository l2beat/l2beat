import { Bytes, type EthereumAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import * as z from 'zod'

import { getErrorMessage } from '../../../utils/getErrorMessage'
import type { IProvider } from '../../provider/IProvider'
import type { Handler, HandlerResult } from '../Handler'
import { bytes32ToContractValue } from '../utils/bytes32ToContractValue'

export type StarkWareNamedStorageHandlerDefinition = z.infer<
  typeof StarkWareNamedStorageHandlerDefinition
>
export const StarkWareNamedStorageHandlerDefinition = z.strictObject({
  type: z.literal('starkWareNamedStorage'),
  tag: z.string(),
  returnType: z.optional(z.enum(['address', 'bytes', 'number'])),
  ignoreRelative: z.optional(z.boolean()),
})

export class StarkWareNamedStorageHandler implements Handler {
  readonly dependencies = []

  constructor(
    readonly field: string,
    private readonly definition: StarkWareNamedStorageHandlerDefinition,
  ) {}

  async execute(
    provider: IProvider,
    address: EthereumAddress,
  ): Promise<HandlerResult> {
    let storage: Bytes
    try {
      const slot = Bytes.fromHex(
        utils.solidityKeccak256(['string'], [this.definition.tag]),
      )
      storage = await provider.getStorage(address, slot)
    } catch (e) {
      return { field: this.field, error: getErrorMessage(e) }
    }
    return {
      field: this.field,
      value: bytes32ToContractValue(
        storage,
        this.definition.returnType ?? 'bytes',
      ),
      ignoreRelative: this.definition.ignoreRelative,
    }
  }
}
