import { EthereumAddress } from '@l2beat/types'
import { utils } from 'ethers'
import { FunctionFragment } from 'ethers/lib/utils'
import * as z from 'zod'

import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import { ContractValue } from '../../types'
import { Handler, HandlerResult } from '../Handler'
import { getReferencedName, Reference, resolveReference } from '../reference'
import { callMethod } from '../utils/callMethod'
import { toFunctionFragment } from '../utils/toFunctionFragment'
import { valueToNumber } from '../utils/valueToNumber'

export type ArrayHandlerDefinition = z.infer<typeof ArrayHandlerDefinition>
export const ArrayHandlerDefinition = z.strictObject({
  type: z.literal('array'),
  method: z.optional(z.string()),
  length: z.optional(z.union([z.number().int().nonnegative(), Reference])),
  maxLength: z.optional(z.number().int().nonnegative()),
})

const DEFAULT_MAX_LENGTH = 100

export class ArrayHandler implements Handler {
  readonly dependencies: string[] = []
  readonly fragment: FunctionFragment

  constructor(
    readonly field: string,
    private readonly definition: ArrayHandlerDefinition,
    abi: string[],
  ) {
    const dependency = getReferencedName(definition.length)
    if (dependency) {
      this.dependencies.push(dependency)
    }
    const method = definition.method ?? field
    if (method.includes(' ')) {
      this.fragment = toFunctionFragment(method)
      if (!isArrayFragment(this.fragment)) {
        throw new Error('Invalid method abi')
      }
    } else {
      const fragment = abi
        .filter((x) => x.startsWith(`function ${method}`))
        .map(toFunctionFragment)
        .find(isArrayFragment)
      if (!fragment) {
        throw new Error(`Cannot find an array method for ${method}`)
      }
      this.fragment = fragment
    }
  }

  getMethod() {
    return this.fragment.format(utils.FormatTypes.full)
  }

  async execute(
    provider: DiscoveryProvider,
    address: EthereumAddress,
    previousResults: Record<string, HandlerResult | undefined>,
  ): Promise<HandlerResult> {
    let length: number | undefined
    if (this.definition.length !== undefined) {
      const resolved = resolveReference(this.definition.length, previousResults)
      length = valueToNumber(resolved)
    }

    if (length) {
      const results = await Promise.all(
        Array.from({ length }).map((_, index) =>
          callMethod(provider, address, this.fragment, [index]),
        ),
      )
      const errorResult = results.find((x) => x.error)
      if (errorResult) {
        return { field: this.field, error: errorResult.error }
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const value = results.map((x) => x.value!)
      return { field: this.field, value }
    } else {
      const value: ContractValue[] = []
      const maxLength = this.definition.maxLength ?? DEFAULT_MAX_LENGTH
      for (let i = 0; i < maxLength; i++) {
        const current = await callMethod(provider, address, this.fragment, [i])
        if (current.error) {
          if (current.error !== 'Execution reverted') {
            return { field: this.field, error: current.error }
          }
          break
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        value.push(current.value!)
      }
      if (value.length === maxLength) {
        return {
          field: this.field,
          value,
          error: 'Too many values. Provide a higher maxLength value',
        }
      }
      return { field: this.field, value }
    }
  }
}

function isArrayFragment(fragment: utils.FunctionFragment) {
  return fragment.inputs.length === 1 && fragment.inputs[0].type === 'uint256'
}
