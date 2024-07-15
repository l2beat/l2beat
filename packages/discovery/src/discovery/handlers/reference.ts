import { ContractValue } from '@l2beat/discovery-types'
import * as z from 'zod'

import { EthereumAddress } from '@l2beat/shared-pure'
import { IProvider } from '../provider/IProvider'
import { HandlerResult } from './Handler'

export const SCOPE_VARIABLE_PREFIX = '#'
const REFERENCE_REGEX = /^\{\{ [#a-z_][a-z\d_]* \}\}$/i
export const Reference = z.string().regex(REFERENCE_REGEX)

export function getReferencedName(value: unknown): string | undefined {
  if (typeof value === 'string' && REFERENCE_REGEX.test(value)) {
    return value.slice(3, -3)
  }
}

export function resolveReference<T>(
  value: T,
  previousResults: Record<string, HandlerResult | undefined>,
  scopeVariables: ScopeVariables,
): T | ContractValue {
  const dependency = getReferencedName(value)
  if (!dependency) {
    return value
  }
  if (dependency.startsWith(SCOPE_VARIABLE_PREFIX)) {
    return decodeScopedVariable(dependency, scopeVariables)
  }
  const result = previousResults[dependency]
  if (!result) {
    throw new Error(`Missing dependency: ${dependency}`)
  }
  if (result.error) {
    throw new Error(`Dependency error: ${result.error}`)
  }
  if (result.value === undefined) {
    throw new Error(`Dependency error: missing value`)
  }
  return result.value
}

function decodeScopedVariable(key: string, map: ScopeVariables): ContractValue {
  const result = map[key.slice(1) as keyof ScopeVariables]
  if (result === undefined) {
    throw new Error(`Missing scoped variable: ${key}`)
  }
  return result
}

export interface ScopeVariables {
  blockNumber: number
  chainName: string
  contractAddress: string
}

export function generateScopeVariables(
  provider: IProvider,
  currentContractAddress: EthereumAddress,
): ScopeVariables {
  return {
    blockNumber: provider.blockNumber,
    chainName: provider.chain,
    contractAddress: currentContractAddress.toString(),
  }
}
