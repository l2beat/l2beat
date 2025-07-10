// NOTE(radomski): This file contains functions used to gently get us to a
// point where we always operate on chain-specific addresses. We don't want to
// change the internals of discovery yet, only the output.
//
// Once the internals operate on chain-specific addresses, we can remove this
// file.

import {
  assert,
  ChainSpecificAddress,
  EthereumAddress,
} from '@l2beat/shared-pure'
import type { ContractValue } from './types'

export function migrateImplementationNames(
  implementationNames: Record<string, string> | undefined,
  shortChainName: string,
): Record<ChainSpecificAddress, string> | undefined {
  if (implementationNames === undefined) {
    return undefined
  }

  return Object.fromEntries(
    Object.entries(implementationNames).map(([address, name]) => [
      ChainSpecificAddress.from(shortChainName, address),
      name,
    ]),
  )
}

export function migrateValues(
  values: Record<string, ContractValue | undefined>,
  shortChainName: string,
): Record<string, ContractValue | undefined> {
  assert(values !== undefined)

  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => [
      key,
      value === undefined ? undefined : migrateValue(value, shortChainName),
    ]),
  )
}

function migrateValue(
  value: ContractValue,
  shortChainName: string,
): ContractValue {
  if (typeof value === 'string' && EthereumAddress.checkIgnoringCase(value)) {
    return ChainSpecificAddress.from(shortChainName, value)
  }

  if (Array.isArray(value)) {
    return value.map((v) => migrateValue(v, shortChainName))
  }

  if (typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, value]) => [
        migrateValue(key, shortChainName),
        value === undefined ? undefined : migrateValue(value, shortChainName),
      ]),
    )
  }

  return value
}
