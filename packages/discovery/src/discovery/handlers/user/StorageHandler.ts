import { Bytes, EthereumAddress, getErrorMessage } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import * as z from 'zod'

import { DiscoveryLogger } from '../../DiscoveryLogger'
import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import { Handler, HandlerResult } from '../Handler'
import { getReferencedName, Reference, resolveReference } from '../reference'
import { BytesFromString, NumberFromString } from '../types'
import { bytes32ToContractValue } from '../utils/bytes32ToContractValue'
import { valueToBigInt } from '../utils/valueToBigInt'

const SingleSlot = z.union([
  z.number().int().nonnegative(),
  BytesFromString,
  NumberFromString,
  Reference,
])

export type StorageHandlerDefinition = z.infer<typeof StorageHandlerDefinition>
export const StorageHandlerDefinition = z.strictObject({
  type: z.literal('storage'),
  slot: z.union([SingleSlot, z.array(SingleSlot).min(1)]),
  offset: z.optional(
    z.union([z.number().int().nonnegative(), NumberFromString, Reference]),
  ),
  returnType: z.optional(z.enum(['address', 'bytes', 'number'])),
  ignoreRelative: z.optional(z.boolean()),
})

export class StorageHandler implements Handler {
  readonly dependencies: string[]

  constructor(
    readonly field: string,
    private readonly definition: StorageHandlerDefinition,
    readonly logger: DiscoveryLogger,
  ) {
    this.dependencies = getDependencies(definition)
  }

  async execute(
    provider: DiscoveryProvider,
    address: EthereumAddress,
    blockNumber: number,
    previousResults: Record<string, HandlerResult | undefined>,
  ): Promise<HandlerResult> {
    this.logger.logExecution(this.field, ['Reading storage'])
    const resolved = resolveDependencies(this.definition, previousResults)

    let storage: Bytes
    try {
      const slot = computeSlot(resolved)
      storage = await provider.getStorage(address, slot, blockNumber)
    } catch (e) {
      return { field: this.field, error: getErrorMessage(e) }
    }
    return {
      field: this.field,
      value: bytes32ToContractValue(storage, resolved.returnType),
      ignoreRelative: this.definition.ignoreRelative,
    }
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

type ResolvedDefinition = ReturnType<typeof resolveDependencies>
function resolveDependencies(
  definition: StorageHandlerDefinition,
  previousResults: Record<string, HandlerResult | undefined>,
) {
  let offset = 0n
  if (definition.offset) {
    const resolved = resolveReference(definition.offset, previousResults)
    offset = valueToBigInt(resolved)
  }

  let slot: bigint | bigint[]
  if (Array.isArray(definition.slot)) {
    slot = definition.slot.map((x) => {
      const resolved = resolveReference(x, previousResults)
      return valueToBigInt(resolved)
    })
  } else {
    const resolved = resolveReference(definition.slot, previousResults)
    slot = valueToBigInt(resolved)
  }

  const returnType: 'number' | 'address' | 'bytes' =
    definition.returnType ?? 'bytes'

  return {
    slot,
    offset,
    returnType,
  }
}

function computeSlot(resolved: ResolvedDefinition) {
  if (!Array.isArray(resolved.slot)) {
    return resolved.slot + resolved.offset
  }

  const parts = [...resolved.slot]
  while (parts.length >= 3) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const a = parts.shift()!
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const b = parts.shift()!
    parts.unshift(hashBigints([b, a]))
  }
  const slot = hashBigints(parts.reverse())
  return slot + resolved.offset
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
