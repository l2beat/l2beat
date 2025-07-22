import type { ChainSpecificAddress } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { utils } from 'ethers'
import type { ContractValue } from '../../output/types'

import type { IProvider } from '../../provider/IProvider'
import type { Handler, HandlerResult } from '../Handler'
import {
  generateReferenceInput,
  getReferencedName,
  Reference,
  type ReferenceInput,
  resolveReference,
} from '../reference'
import { callMethod } from '../utils/callMethod'
import { getFunctionFragment } from '../utils/getFunctionFragment'
import { valueToNumber } from '../utils/valueToNumber'

export type ArrayHandlerDefinition = v.infer<typeof ArrayHandlerDefinition>
export const ArrayHandlerDefinition = v.strictObject({
  type: v.literal('array'),
  indices: v.union([v.array(v.number()), v.string()]).optional(),
  method: v.string().optional(),
  length: v
    .union([v.number().check((v) => Number.isInteger(v) && v >= 0), Reference])
    .optional(),
  maxLength: v
    .number()
    .check((v) => Number.isInteger(v) && v >= 0)
    .optional(),
  startIndex: v
    .number()
    .check((v) => Number.isInteger(v) && v >= 0)
    .optional(),
  ignoreRelative: v.boolean().optional(),
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
    address: ChainSpecificAddress,
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
    const maxLength = Math.min(
      resolved.maxLength,
      resolved.length ?? Number.POSITIVE_INFINITY,
    )
    const callIndex = createCallIndex(provider, address, this.fragment)
    const arrayFragment = getArrayFragment(this.fragment)

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
          return {
            field: this.field,
            // biome-ignore lint/style/noNonNullAssertion: we know it's there
            value: current.value!,
            fragment: arrayFragment,
          }
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
        fragment: arrayFragment,
      }
    }
    return {
      field: this.field,
      value,
      ignoreRelative: resolved.ignoreRelative,
      fragment: arrayFragment,
    }
  }
}
function createCallIndex(
  provider: IProvider,
  address: ChainSpecificAddress,
  fragment: utils.FunctionFragment,
) {
  return async (index: number) => {
    return await callMethod(provider, address, fragment, [index])
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

export function getArrayFragment(
  fragment: utils.FunctionFragment,
): utils.FunctionFragment {
  const { ParamType, FunctionFragment, FormatTypes } = utils

  const original = fragment.outputs ?? []
  const core: utils.ParamType =
    original.length === 1
      ? // biome-ignore lint/style/noNonNullAssertion: We know it's there
        original[0]!
      : ParamType.from({ type: 'tuple', components: original })

  const wrapped = ParamType.from({
    type: core.baseType === 'tuple' ? 'tuple[]' : `${core.type}[]`,
    ...(core.components ? { components: core.components } : {}),
  })

  const json = JSON.parse(fragment.format(FormatTypes.json))
  json.outputs = [JSON.parse(wrapped.format(FormatTypes.json))]
  return FunctionFragment.from(json)
}
