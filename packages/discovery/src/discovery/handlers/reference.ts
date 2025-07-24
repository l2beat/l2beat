import type { ChainSpecificAddress } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import type { ContractValue } from '../output/types'
import type { IProvider } from '../provider/IProvider'
import type { HandlerResult } from './Handler'

const REFERENCE_REGEX = /^\{\{\s*[$a-z_][$.a-z\d_]*\s*\}\}$/i
export const Reference = v.string().check((v) => REFERENCE_REGEX.test(v))

export function getReferencedName(value: unknown): string | undefined {
  if (typeof value === 'string' && REFERENCE_REGEX.test(value)) {
    return value.slice(2, -2).trim()
  }
}

export type ReferenceInput = Record<string, ContractValue>
export function generateReferenceInput(
  _previousResults: Record<string, HandlerResult | undefined>,
  provider: IProvider,
  currentContractAddress: ChainSpecificAddress,
): ReferenceInput {
  const contractValues = Object.fromEntries(
    Object.keys(_previousResults).map((k) => [k, _previousResults[k]?.value]),
  )

  return {
    ...contractValues,
    $: {
      address: currentContractAddress.toString(),
    },
    $$: {
      blockNumber: provider.blockNumber,
      chainName: provider.chain,
    },
  }
}

export function resolveReference<T>(
  value: T,
  input: ReferenceInput,
): T | ContractValue {
  const dependency = getReferencedName(value)
  if (!dependency) {
    return value
  }
  const path = dependency.split('.')

  let result: ContractValue | undefined = input
  for (const element of path) {
    if (typeof result !== 'object' || Array.isArray(result)) {
      throw new Error(
        `Unexpected element found while resolving reference path ${dependency}`,
      )
    }

    result = result[element]
  }

  if (result === undefined) {
    throw new Error(`Missing dependency: ${dependency}`)
  }

  return result
}

export function resolveReferenceFromValues(
  value: string,
  previousResults: Record<string, ContractValue | undefined>,
): ContractValue {
  const dependency = getReferencedName(value)
  if (dependency === undefined) {
    return value
  }
  const result = previousResults[dependency]
  if (result === undefined) {
    throw new Error(`Missing dependency: ${dependency}`)
  }
  return result
}
