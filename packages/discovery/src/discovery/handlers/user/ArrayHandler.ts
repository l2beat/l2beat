import type { ChainSpecificAddress } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { utils } from 'ethers'
import type { ContractValue } from '../../output/types'

import type { IProvider } from '../../provider/IProvider'
import { declareHandler, type Handler, type HandlerResult } from '../Handler'
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

const DEFAULT_MAX_LENGTH = 100

export type ArrayHandlerDefinition = v.infer<typeof ArrayHandlerDefinition>
export const ArrayHandlerDefinition = v.strictObject({
  type: v.literal('array').describe('The type of the array'),
  indices: v
    .union([v.array(v.number()), v.string()])
    .optional()
    .describe(
      'An array of numbers, e.g. `[1,3,5]` a reference to another field, e.g. `{{ value }}` that will be used as indices to access a given array',
    ),
  method: v
    .string()
    .optional()
    .describe(
      'Name or abi of the method to be called. If omitted the name of the field is used. The abi should be provided in the human readable abi format',
    ),
  length: v
    .union([v.number().check((v) => Number.isInteger(v) && v >= 0), Reference])
    .optional()
    .describe(
      'A number, e.g. `3` or a reference to another field, e.g. `{{ value }}` that will be used to determine the number of calls. If this is not provided the method is called until it reverts',
    ),
  maxLength: v
    .number()
    .check((v) => Number.isInteger(v) && v >= 0)
    .optional()
    .describe(
      `A guard against infinite loops. Prevents the method to be called an excessive number of times. Defaults to ${DEFAULT_MAX_LENGTH}`,
    ),
  startIndex: v
    .number()
    .check((v) => Number.isInteger(v) && v >= 0)
    .optional()
    .describe('The index of the first element to be read. Defaults to `0`'),
  ignoreRelative: v
    .boolean()
    .optional()
    .describe(
      "If set to `true`, the method's result will not be considered a relative. This is useful when the method returns a value that a contract address, but it's not a contract that should be discovered.",
    ),
})

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

export const ArrayHandlerBundle = declareHandler(
  'array',
  {
    clazz: ArrayHandler,
    definition: ArrayHandlerDefinition,
  },
  {
    description: `
    The array handler allows you to read values by repeatedly calling an array method, that is a method that takes only one argument of type \`uint256\`.
    Such methods are automatically called by default, but the results are limited to 5 entries. Using this handler removes this limitation.`,
    examples: [
      {
        title: 'Just read the array using the field name as the method name',
        code: `{
          "type": "array"
        }`,
      },
      {
        title: 'Read the array but use another method',
        code: `{
          "type": "array",
          "method": "owners"
        }`,
      },
      {
        title: 'Read the array but specify full method abi',
        code: `{
          "type": "array",
          "method": "function owners(uint256 i) view returns (uint256)"
        }`,
      },
      {
        title: 'Read the array until some specific length',
        code: `{
          "type": "array",
          "method": "owners",
          "length": "{{ ownersLength }}"
        }`,
      },
      {
        title: 'Read a very large array',
        code: `{
          "type": "array",
          "method": "owners",
          "maxLength": 1000
        }`,
      },
      {
        title: 'Read only the first 5 prime elements from the array',
        code: `{
          "type": "array",
          "method": "owners",
          "indices": [2, 3, 5, 7, 11]
        }`,
      },
    ],
  },
)
