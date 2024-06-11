import { EthereumAddress } from '@l2beat/shared-pure'

import { ContractValue } from '@l2beat/discovery-types'
import {
  ContractFieldSeverity,
  DiscoveryContractField,
} from '../config/RawDiscoveryConfig'
import { HandlerResult } from '../handlers/Handler'
import { ContractMeta } from './AddressAnalyzer'

export function getTargetsMeta(
  sourceAddress: EthereumAddress,
  handlerResults: HandlerResult[],
  fields: { [address: string]: DiscoveryContractField },
): { [address: string]: ContractMeta } | undefined {
  const result: Record<string, ContractMeta> = {}
  for (const handlerResult of handlerResults) {
    const target = fields?.[handlerResult.field]?.target
    if (target) {
      const addresses = getAddresses(handlerResult.value).map((a) =>
        a.toString(),
      )
      for (const address of addresses) {
        const meta = mergeContractMeta(
          result[address],
          targetConfigToMeta(sourceAddress, target),
        )
        if (meta) {
          result[address] = meta
        }
      }
    }
  }
  return isEmptyObject(result) ? undefined : result
}

export function targetConfigToMeta(
  address: EthereumAddress,
  target: DiscoveryContractField['target'],
): ContractMeta | undefined {
  if (target === undefined) {
    return undefined
  }
  const result: ContractMeta = {
    descriptions: target.description ? [target.description] : undefined,
    roles: toSet(target.role),
    category: toSet(target.category),
  }
  const permissions = toSet(target.permission)
  if (permissions !== undefined) {
    result.permissions = { [address.toString()]: permissions }
  }
  return isEmptyObject(result) ? undefined : result
}

export function getAddresses(
  value: ContractValue | undefined,
): EthereumAddress[] {
  if (Array.isArray(value)) {
    return value.flatMap((v) => getAddresses(v))
  } else if (typeof value === 'object') {
    return Object.values(value).flatMap((v) => getAddresses(v))
  } else if (typeof value === 'string') {
    try {
      return [EthereumAddress(value)]
    } catch {
      return []
    }
  }
  return []
}

export function toSet<T>(
  value: T | T[] | null | undefined,
): Set<T> | undefined {
  if (value === undefined || value === null) {
    return undefined
  }
  if (Array.isArray(value)) {
    return new Set([...value])
  }
  return new Set([value])
}

export function mergeSets<T>(
  a: Set<T> | undefined,
  b: Set<T> | undefined,
): Set<T> | undefined {
  if (a === undefined && b === undefined) {
    return undefined
  }
  return new Set([...(a ?? []), ...(b ?? [])])
}

export function concatArrays<T>(
  a: T[] | undefined,
  b: T[] | undefined,
): T[] | undefined {
  if (a === undefined && b === undefined) {
    return undefined
  }
  return [...(a ?? []), ...(b ?? [])]
}

export function mergeContractMeta(
  a: ContractMeta | undefined,
  b: ContractMeta | undefined,
): ContractMeta | undefined {
  if (a === undefined && b === undefined) {
    return undefined
  }
  a ??= {}
  b ??= {}
  const result: ContractMeta = {
    descriptions: concatArrays(a.descriptions, b.descriptions),
    roles: mergeSets(a.roles, b.roles),
    permissions: mergePermissions(a.permissions, b.permissions),
    category: mergeSets(a.category, b.category),
    types: mergeSets(a.types, b.types),
    severity: findHighestSeverity(a.severity, b.severity),
  }
  return result
}

export function mergePermissions(
  a: ContractMeta['permissions'] | undefined,
  b: ContractMeta['permissions'] | undefined,
): ContractMeta['permissions'] | undefined {
  if (a === undefined && b === undefined) {
    return undefined
  }
  a ??= {}
  b ??= {}
  const result: ContractMeta['permissions'] = {}
  for (const [address, permissions] of Object.entries(a)) {
    const merged = mergeSets(permissions, b[address])
    if (merged) {
      result[address] = merged
    }
  }
  return result
}

export function findHighestSeverity(
  a: ContractFieldSeverity | undefined,
  b: ContractFieldSeverity | undefined,
): ContractFieldSeverity | undefined {
  if (a === undefined && b === undefined) {
    return undefined
  }
  if (a === 'HIGH' || b === 'HIGH') {
    return 'HIGH'
  }
  if (a === 'MEDIUM' || b === 'MEDIUM') {
    return 'MEDIUM'
  }
  return 'LOW'
}

function isEmptyObject(obj: object): boolean {
  return (
    Object.keys(obj).length === 0 ||
    Object.values(obj).every((value) => value === undefined)
  )
}
