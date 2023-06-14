import { ContractValue, EthereumAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import * as z from 'zod'

import { DiscoveryLogger } from '../../DiscoveryLogger'
import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import { Handler, HandlerResult } from '../Handler'
import { getReferencedName, Reference, resolveReference } from '../reference'
import { callMethod } from '../utils/callMethod'
import { getFunctionFragment } from '../utils/getFunctionFragment'
import { valueToNumber } from '../utils/valueToNumber'

export type ArrayHandlerDefinition = z.infer<typeof ArrayHandlerDefinition>
export const ArrayHandlerDefinition = z.strictObject({
  type: z.literal('array'),
  method: z.optional(z.string()),
  length: z.optional(z.union([z.number().int().nonnegative(), Reference])),
  maxLength: z.optional(z.number().int().nonnegative()),
  startIndex: z.optional(z.number().int().nonnegative()),
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
    readonly logger: DiscoveryLogger,
  ) {
    const dependency = getReferencedName(definition.length)
    if (dependency) {
      this.dependencies.push(dependency)
    }
    this.fragment = getFunctionFragment(
      definition.method ?? field,
      abi,
      isArrayFragment,
    )
  }

  getMethod() {
    return this.fragment.format(utils.FormatTypes.full)
  }

  async execute(
    provider: DiscoveryProvider,
    address: EthereumAddress,
    blockNumber: number,
    previousResults: Record<string, HandlerResult | undefined>,
  ): Promise<HandlerResult> {
    this.logger.logExecution(this.field, [
      'Calling array ',
      this.fragment.name + '(i)',
    ])
    const resolved = resolveDependencies(this.definition, previousResults)

    const value: ContractValue[] = []
    const maxLength = Math.min(resolved.maxLength, resolved.length ?? Infinity)
    for (let i = resolved.startIndex; i < maxLength; i++) {
      const current = await callMethod(
        provider,
        address,
        this.fragment,
        [i],
        blockNumber,
      )
      if (current.error) {
        if (
          current.error !== 'Execution reverted' ||
          resolved.length !== undefined
        ) {
          return { field: this.field, error: current.error }
        }
        break
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      value.push(current.value!)
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

function resolveDependencies(
  definition: ArrayHandlerDefinition,
  previousResults: Record<string, HandlerResult | undefined>,
) {
  let length: number | undefined
  if (definition.length !== undefined) {
    const resolved = resolveReference(definition.length, previousResults)
    length = valueToNumber(resolved)
  }

  return {
    method: definition.method,
    length,
    maxLength: definition.maxLength ?? DEFAULT_MAX_LENGTH,
    startIndex: definition.startIndex ?? 0,
    ignoreRelative: definition.ignoreRelative,
  }
}

function isArrayFragment(fragment: utils.FunctionFragment) {
  return (
    (fragment.stateMutability === 'view' ||
      fragment.stateMutability === 'pure') &&
    fragment.inputs.length === 1 &&
    fragment.inputs[0].type === 'uint256'
  )
}
