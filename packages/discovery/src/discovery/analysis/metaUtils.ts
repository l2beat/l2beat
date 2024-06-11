import { EthereumAddress } from '@l2beat/shared-pure'

import { ContractValue } from '@l2beat/discovery-types'
import {
  ContractFieldSeverity,
  DiscoveryContractField,
  Permission,
  StackCategory,
  StackRole,
  ValueType,
} from '../config/RawDiscoveryConfig'
import { HandlerResult } from '../handlers/Handler'
import { Analysis } from './AddressAnalyzer'

type AddressToMetaMap = { [address: string]: ContractMeta }

// using `| undefined` for strong type safety,
// making sure ever field of meta is always processed.
export interface ContractMeta {
  descriptions: string[] | undefined
  roles: Set<StackRole> | undefined
  permissions: { [permission: string]: Set<EthereumAddress> } | undefined
  category: Set<StackCategory> | undefined
  types: Set<ValueType> | undefined
  severity: ContractFieldSeverity | undefined
}

export function mergeContractMeta(
  a?: ContractMeta,
  b?: ContractMeta,
): ContractMeta | undefined {
  const result: ContractMeta = {
    descriptions: concatArrays(a?.descriptions, b?.descriptions),
    roles: mergeSets(a?.roles, b?.roles),
    permissions: mergePermissions(a?.permissions, b?.permissions),
    category: mergeSets(a?.category, b?.category),
    types: mergeSets(a?.types, b?.types),
    severity: findHighestSeverity(a?.severity, b?.severity),
  }
  return isEmptyObject(result) ? undefined : result
}

export function mergePermissions(
  a: ContractMeta['permissions'] = {},
  b: ContractMeta['permissions'] = {},
): ContractMeta['permissions'] | undefined {
  const result: ContractMeta['permissions'] = {}
  const combinedKeys = new Set([
    ...Object.keys(a ?? {}),
    ...Object.keys(b ?? {}),
  ])
  for (const key of combinedKeys) {
    const merged = mergeSets(a[key], b[key])
    if (merged !== undefined) {
      result[key] = merged
    }
  }
  return isEmptyObject(result) ? undefined : result
}

export function getTargetsMeta(
  self: EthereumAddress,
  handlerResults: HandlerResult[],
  fields: { [address: string]: DiscoveryContractField },
): AddressToMetaMap | undefined {
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
          targetConfigToMeta(self, target),
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
  self: EthereumAddress,
  target: DiscoveryContractField['target'],
): ContractMeta | undefined {
  if (target === undefined) {
    return undefined
  }
  const result: ContractMeta = {
    descriptions: target.description ? [target.description] : undefined,
    roles: toSet(target.role),
    permissions: getTargetPermissions(self, toSet(target.permission)),
    category: toSet(target.category),
    types: undefined,
    severity: undefined,
  }
  return isEmptyObject(result) ? undefined : result
}

export function getTargetPermissions(
  self: EthereumAddress,
  permission?: Set<Permission>,
): ContractMeta['permissions'] | undefined {
  if (permission === undefined) {
    return undefined
  }
  return Object.fromEntries([...permission].map((p) => [p, new Set([self])]))
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

export function invertMeta(analysisList: Analysis[]): AddressToMetaMap {
  const result: AddressToMetaMap = {}
  for (const analysis of analysisList) {
    if (analysis.type === 'Contract') {
      const targetsMeta = analysis.targetsMeta
      if (targetsMeta !== undefined) {
        for (const [targetAddress, targetMeta] of Object.entries(targetsMeta)) {
          const merged = mergeContractMeta(result[targetAddress], targetMeta)
          if (merged) {
            result[targetAddress] = merged
          }
        }
      }
    }
  }
  return result
}
