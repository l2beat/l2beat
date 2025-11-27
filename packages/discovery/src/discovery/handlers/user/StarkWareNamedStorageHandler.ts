import { Bytes, type ChainSpecificAddress } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { utils } from 'ethers'

import { getErrorMessage } from '../../../utils/getErrorMessage.js'
import type { IProvider } from '../../provider/IProvider.js'
import type { Handler, HandlerResult } from '../Handler.js'
import { bytes32ToContractValue } from '../utils/bytes32ToContractValue.js'

export type StarkWareNamedStorageHandlerDefinition = v.infer<
  typeof StarkWareNamedStorageHandlerDefinition
>
export const StarkWareNamedStorageHandlerDefinition = v.strictObject({
  type: v.literal('starkWareNamedStorage'),
  tag: v.string(),
  returnType: v.enum(['address', 'bytes', 'number']).optional(),
  ignoreRelative: v.boolean().optional(),
})

export class StarkWareNamedStorageHandler implements Handler {
  readonly dependencies = []

  constructor(
    readonly field: string,
    private readonly definition: StarkWareNamedStorageHandlerDefinition,
  ) {}

  async execute(
    provider: IProvider,
    address: ChainSpecificAddress,
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
