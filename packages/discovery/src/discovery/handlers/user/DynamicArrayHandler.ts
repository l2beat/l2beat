import { Bytes, EthereumAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import * as z from 'zod'

import { getErrorMessage } from '../../../utils/getErrorMessage'
import { DiscoveryLogger } from '../../DiscoveryLogger'
import { IProvider } from '../../provider/IProvider'
import { Handler, HandlerResult } from '../Handler'
import { getReferencedName, resolveReference } from '../reference'
import { SingleSlot } from '../storageCommon'
import { bytes32ToContractValue } from '../utils/bytes32ToContractValue'
import { valueToBigInt } from '../utils/valueToBigInt'

// Solidity differentiates between two different array types:
//  - static sized arrays   e.g. address[32]
//  - dynamic sized arrays  e.g. address[]
// This handler is designed for dynamically sized arrays and does not work with
// statically sized arrays! This is because the first slot of a dynamic array
// contains its length instead of actual data, also the place in storage where
// the data is located is i = keccak256(slot) instead of i = slot.
export type DynamicArrayHandlerDefinition = z.infer<
  typeof DynamicArrayHandlerDefinition
>
export const DynamicArrayHandlerDefinition = z.strictObject({
  type: z.literal('dynamicArray'),
  slot: SingleSlot,
  returnType: z.optional(z.enum(['address'])),
  ignoreRelative: z.optional(z.boolean()),
})

export class DynamicArrayHandler implements Handler {
  readonly dependencies: string[]

  constructor(
    readonly field: string,
    private readonly definition: DynamicArrayHandlerDefinition,
    readonly logger: DiscoveryLogger,
  ) {
    this.dependencies = getDependencies(definition)
  }

  async execute(
    provider: IProvider,
    address: EthereumAddress,
    previousResults: Record<string, HandlerResult | undefined>,
  ): Promise<HandlerResult> {
    this.logger.logExecution(this.field, ['Reading dynamic array storage'])
    const resolved = resolveDependencies(this.definition, previousResults)

    const elementStorages: Bytes[] = []
    try {
      const lengthSlot = resolved.slot
      const length = await provider.getStorageAsBigint(address, lengthSlot)
      for (let index = 0n; index < length; index++) {
        const elementSlot = computeDynamicSlot(lengthSlot, index)
        const elementStorage = await provider.getStorage(address, elementSlot)
        elementStorages.push(elementStorage)
      }
    } catch (e) {
      return { field: this.field, error: getErrorMessage(e) }
    }

    return {
      field: this.field,
      value: elementStorages.map((e) =>
        bytes32ToContractValue(e, resolved.returnType),
      ),
      ignoreRelative: this.definition.ignoreRelative,
    }
  }
}

function getDependencies(definition: DynamicArrayHandlerDefinition): string[] {
  const dependencies: string[] = []
  const add = (value: string | undefined) => value && dependencies.push(value)

  add(getReferencedName(definition.slot))
  if (Array.isArray(definition.slot)) {
    for (const value of definition.slot) {
      add(getReferencedName(value))
    }
  }
  return dependencies
}

function resolveDependencies(
  definition: DynamicArrayHandlerDefinition,
  previousResults: Record<string, HandlerResult | undefined>,
): {
  slot: bigint
  returnType: 'number' | 'address' | 'bytes'
} {
  const resolved = resolveReference(definition.slot, previousResults)
  const slot = valueToBigInt(resolved)

  const returnType = definition.returnType ?? 'address'

  return {
    slot,
    returnType,
  }
}

function computeDynamicSlot(lengthSlot: bigint, index: bigint): bigint {
  return hashBigints([lengthSlot]) + index
}

function hashBigints(values: bigint[]): bigint {
  return BigInt(
    utils.keccak256(
      utils.defaultAbiCoder.encode(
        values.map(() => 'uint256'),
        values,
      ),
    ),
  )
}
