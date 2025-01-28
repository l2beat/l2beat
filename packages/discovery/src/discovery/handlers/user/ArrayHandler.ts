import type { ContractValue } from '@l2beat/discovery-types'
import type { EthereumAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import * as z from 'zod'

import type { IProvider } from '../../provider/IProvider'
import type { Handler, HandlerResult } from '../Handler'
import {
  Reference,
  type ReferenceInput,
  generateReferenceInput,
  getReferencedName,
  resolveReference,
} from '../reference'
import { callMethod } from '../utils/callMethod'
import { getFunctionFragment } from '../utils/getFunctionFragment'
import { valueToNumber } from '../utils/valueToNumber'

export type ArrayHandlerDefinition = z.infer<typeof ArrayHandlerDefinition>
export const ArrayHandlerDefinition = z.strictObject({
  type: z.literal('array'),
  indices: z.optional(z.union([z.array(z.number()), z.string()])),
  method: z.optional(z.string()),
  length: z.optional(z.union([z.number().int().nonnegative(), Reference])),
  maxLength: z.optional(z.number().int().nonnegative()),
  startIndex: z.optional(z.number().int().nonnegative()),
  pickFields: z.optional(z.array(z.string())),
  ignoreRelative: z.optional(z.boolean()),
})

const DEFAULT_MAX_LENGTH = 100

export class ArrayHandler implements Handler {
  readonly dependencies: string[] = []
  readonly fragment: utils.FunctionFragment

  constructor(
    readonly field: string,
    private readonly definition: ArrayHandlerDefinition,
    abi: string[],
  ) {
    const dependency = getReferencedName(definition.length)
    if (dependency) {
      this.dependencies.push(dependency)
    }
    const indicesDependency = getReferencedName(definition.indices)
    if (indicesDependency) {
      this.dependencies.push(indicesDependency)
    }
    this.fragment = getFunctionFragment(
      definition.method ?? field,
      abi,
      isArrayFragment,
    )
  }

  getMethod(): string {
    return this.fragment.format(utils.FormatTypes.full)
  }

  async execute(
    provider: IProvider,
    address: EthereumAddress,
    previousResults: Record<string, HandlerResult | undefined>,
  ): Promise<HandlerResult> {
    const referenceInput = generateReferenceInput(
      previousResults,
      provider,
      address,
    )
    const resolved = resolveDependencies(this.definition, referenceInput)

    const value: ContractValue[] = []
    const startIndex = resolved.startIndex
    const maxLength = Math.min(resolved.maxLength, resolved.length ?? Infinity)
    const callIndex = createCallIndex(
      provider,
      address,
      this.fragment,
      this.definition.pickFields,
    )
    if (resolved.indices) {
      const results = await Promise.all(
        resolved.indices.map(async (index) => {
          const current = await callIndex(index)
          if (current.error) {
            if (
              current.error !== 'Execution reverted' ||
              resolved.length !== undefined
            ) {
              return { field: this.field, error: current.error }
            }
          }
          // biome-ignore lint/style/noNonNullAssertion: we know it's there
          return { field: this.field, value: current.value! }
        }),
      )
      if (results.some((r) => r.error)) {
        const errors = results.filter((r) => r.error).map((r) => r.error)
        return { field: this.field, error: errors.join(',') }
      }

      for (const result of results) {
        // biome-ignore lint/style/noNonNullAssertion: we know it's there
        value.push(result.value!)
      }
    } else {
      for (let i = startIndex; i < maxLength + startIndex; i++) {
        const current = await callIndex(i)
        if (current.error) {
          if (
            current.error !== 'Execution reverted' ||
            resolved.length !== undefined
          ) {
            return { field: this.field, error: current.error }
          }
          break
        }
        // biome-ignore lint/style/noNonNullAssertion: we know it's there
        value.push(current.value!)
      }
    }
    if (
      value.length === resolved.maxLength &&
      value.length !== resolved.length
    ) {
      return {
        field: this.field,
        value,
        error: 'Too many values. Provide a higher maxLength value',
      }
    }
    return { field: this.field, value, ignoreRelative: resolved.ignoreRelative }
  }
}
function createCallIndex(
  provider: IProvider,
  address: EthereumAddress,
  fragment: utils.FunctionFragment,
  pickFields?: string[],
) {
  return async (index: number) => {
    return await callMethod(provider, address, fragment, [index], pickFields)
  }
}

function resolveDependencies(
  definition: ArrayHandlerDefinition,
  referenceInput: ReferenceInput,
): {
  method: string | undefined
  length: number | undefined
  indices: number[] | undefined
  maxLength: number
  startIndex: number
  ignoreRelative: boolean | undefined
} {
  let length: number | undefined
  if (definition.length !== undefined) {
    const resolved = resolveReference(definition.length, referenceInput)
    length = valueToNumber(resolved)
  }

  let indices: number[] | undefined
  if (
    definition.indices !== undefined &&
    typeof definition.indices === 'string'
  ) {
    const resolved = resolveReference(definition.indices, referenceInput)
    if (!Array.isArray(resolved)) {
      throw new Error('Expected array of indices')
    }
    indices = resolved.map((v) => valueToNumber(v))
  } else {
    indices = definition.indices
  }

  if (indices !== undefined && length !== undefined) {
    throw new Error('Cannot define both indices and length')
  }

  return {
    method: definition.method,
    indices,
    length,
    maxLength: definition.maxLength ?? DEFAULT_MAX_LENGTH,
    startIndex: definition.startIndex ?? 0,
    ignoreRelative: definition.ignoreRelative,
  }
}

function isArrayFragment(fragment: utils.FunctionFragment): boolean {
  return (
    (fragment.stateMutability === 'view' ||
      fragment.stateMutability === 'pure') &&
    fragment.inputs.length === 1 &&
    ['uint16', 'uint32', 'uint64', 'uint256'].includes(
      fragment.inputs[0]?.type ?? '',
    )
  )
}
