import { getErrorMessage } from '@l2beat/common'
import { Bytes, EthereumAddress } from '@l2beat/types'
import { utils } from 'ethers'
import * as z from 'zod'

import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import { ContractValue } from '../../types'
import { Handler, HandlerResult } from '../Handler'
import { getReferencedName, Reference, resolveReference } from '../reference'
import { BytesFromString, NumberFromString } from '../types'
import { bytes32ToContractValue } from '../utils/bytes32ToContractValue'

const SingleSlot = z.union([
  z.number(),
  BytesFromString,
  NumberFromString,
  Reference,
])

export type StorageHandlerDefinition = z.infer<typeof StorageHandlerDefinition>
export const StorageHandlerDefinition = z.strictObject({
  type: z.literal('storage'),
  slot: z.union([SingleSlot, z.array(SingleSlot).min(1)]),
  offset: z.optional(z.union([z.number(), NumberFromString, Reference])),
  returnType: z.optional(z.enum(['address', 'bytes', 'number'])),
})

export class StorageHandler implements Handler {
  readonly dependencies: string[]

  constructor(
    readonly field: string,
    private readonly definition: StorageHandlerDefinition,
  ) {
    this.dependencies = getDependencies(definition)
  }

  async execute(
    provider: DiscoveryProvider,
    address: EthereumAddress,
    previousResults: Record<string, HandlerResult | undefined>,
  ): Promise<HandlerResult> {
    let storage: Bytes
    try {
      const slot = computeSlot(this.definition, previousResults)
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
    }
  }
}

function computeSlot(
  definition: StorageHandlerDefinition,
  previousResults: Record<string, HandlerResult | undefined>,
) {
  let slot = 0n

  if (definition.offset) {
    const resolved = resolveReference(definition.offset, previousResults)
    slot = contractValueToBigInt(resolved)
  }

  if (Array.isArray(definition.slot)) {
    const parts = definition.slot.map((x) => {
      const resolved = resolveReference(x, previousResults)
      return contractValueToBigInt(resolved)
    })
    while (parts.length >= 3) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const a = parts.shift()!
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const b = parts.shift()!
      parts.unshift(hashBigints([b, a]))
    }
    slot += hashBigints(parts.reverse())
  } else {
    const resolved = resolveReference(definition.slot, previousResults)
    slot += contractValueToBigInt(resolved)
  }

  return slot
}

function hashBigints(values: bigint[]) {
  return BigInt(
    utils.keccak256(
      utils.defaultAbiCoder.encode(
        values.map(() => 'uint256'),
        values,
      ),
    ),
  )
}

function contractValueToBigInt(value: bigint | Bytes | ContractValue) {
  if (Array.isArray(value)) {
    throw new Error('Cannot convert value to bigint')
  }
  if (value instanceof Bytes) {
    return BigInt(value.toString())
  }
  try {
    return BigInt(value)
  } catch (e) {
    throw new Error('Cannot convert value to bigint')
  }
}

function getDependencies(definition: StorageHandlerDefinition) {
  const dependencies: string[] = []
  const add = (value: string | undefined) => value && dependencies.push(value)

  add(getReferencedName(definition.offset))
  add(getReferencedName(definition.slot))
  if (Array.isArray(definition.slot)) {
    for (const value of definition.slot) {
      add(getReferencedName(value))
    }
  }
  return dependencies
}
